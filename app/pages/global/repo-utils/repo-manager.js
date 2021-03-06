// TODO: cache data for each session
// TODO: optimize by reducing refresh calls

class RepoManagerInstance {
  constructor () {
    this.repoStore = localforage.createInstance({
      name: 'OpenRevise2-Repos'
    })
    this.repoURLs = []
    this.repoMetas = []
    this.repoDatas = []
    this.firstLaunch = true
  }

  initializeInstance () {
    var that = this
    return new Promise((resolve, reject) => {
      that.repoStore.getItem('repoURLs').then(function (repoURLs) {
        if (repoURLs !== [] && typeof (repoURLs) !== 'undefined' && repoURLs !== null) {
          that.firstLaunch = false
          that.repoURLs = repoURLs
          that.refreshRepoMetas().then(function () {
            resolve({
              instance: that,
              repoURLs: that.repoURLs,
              repoMetas: that.repoMetas
            })
          }).catch(function (err) {
            reject(err)
          })
        } else {
          // Add the default repository (CHANGE ME IF REQUIRED!)
          that.addRepo('https://oopdevs.github.io/OpenReviseNotes').then(function () {
            resolve({
              repoURLs: that.repoURLs,
              repoMetas: that.repoMetas
            })
          }).catch(function (err) {
            reject(err)
          })
        }
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  getURLFromOpenReviseURI (openreviseRepoURI) {
    var URIParts = openreviseRepoURI.split('/')
    console.log(URIParts)
    var processedURL = ''
    for (var repoMetaIndex in this.repoMetas) {
      if (URIParts[0] === this.repoMetas[repoMetaIndex].meta.name) {
        processedURL += this.repoURLs[repoMetaIndex] + this.repoMetas[repoMetaIndex].db.path
        if (Object.prototype.hasOwnProperty.call(this.repoDatas[repoMetaIndex], URIParts[1])) {
          processedURL += URIParts[1] + '/'
          if (Object.prototype.hasOwnProperty.call(this.repoDatas[repoMetaIndex][URIParts[1]], URIParts[2])) {
            processedURL += URIParts[2] + '/'
            var filenameParts = URIParts[3].split('.')
            if (this.repoDatas[repoMetaIndex][URIParts[1]][URIParts[2]][filenameParts[1]].indexOf(URIParts[3]) > -1) {
              processedURL += URIParts[3]
            }
          }
        }
        break
      }
    }
    return encodeURI(processedURL)
  }

  addDefaultRepo () {
    return this.addRepo('https://oopdevs.github.io/OpenReviseNotes')
  }

  refreshRepoMetas () {
    var that = this
    return new Promise(function (resolve, reject) {
      var repoContactor = new Worker('global/repo-utils/workers/repo-worker-meta.js')
      repoContactor.onerror = function (err) {
        repoContactor.terminate()
        reject(err)
      }
      repoContactor.onmessage = function (e) {
        try {
          repoContactor.terminate()
          that.repoMetas = []
          for (var repoMeta of e.data) {
            that.repoMetas.push(repoMeta)
          }
          resolve(that.repoMetas)
        } catch (err) {
          reject(err)
        }
      }
      repoContactor.postMessage(that.repoURLs)
    })
  }

  refreshRepoDatas () {
    var that = this
    return new Promise(function (resolve, reject) {
      var repoContactor = new Worker('global/repo-utils/workers/repo-worker-data.js')
      repoContactor.onerror = function (err) {
        repoContactor.terminate()
        reject(err)
      }
      repoContactor.onmessage = function (e) {
        try {
          repoContactor.terminate()
          that.repoDatas = []
          for (var repoData of e.data) {
            that.repoDatas.push(repoData)
          }
          resolve(that.repoDatas)
        } catch (err) {
          reject(err)
        }
      }
      repoContactor.postMessage({
        repoURLs: that.repoURLs,
        repoMetas: that.repoMetas
      })
    })
  }

  _checkDbMismatch () {
    var that = this
    return new Promise(function (resolve, reject) {
      that.repoStore.getItem('repoURLs').then(function (repoURLs) {
        if (that.repoURLs.length === repoURLs.length) {
          resolve()
        } else {
          reject(new Error('repoURLs length mismatch. The repo list might not be saved.'))
        }
      })
    })
  }

  _recheckMetaData () {
    var that = this
    return new Promise(function (resolve, reject) {
      that.refreshRepoMetas().then(function () {
        that.refreshRepoDatas().then(function () {
          resolve(that.repoURLs)
        }).catch(function (err) {
          reject(err)
        })
      })
    })
  }

  addRepo (repoURL) {
    var that = this
    if (this.repoURLs.indexOf(repoURL) > -1) {
      return new Promise(function (resolve, reject) {
        var newError = new Error('Repo is already in the list! Not adding.')
        console.error(newError)
        reject(newError)
      })
    } else {
      this.repoURLs.push(repoURL)
      return new Promise((resolve, reject) => {
        that.repoStore.setItem('repoURLs', that.repoURLs).then(function () {
          if (that.firstLaunch) {
            that._recheckMetaData().then(function (repoURLs) {
              resolve(repoURLs)
            }).catch(function (err) {
              reject(err)
            })
          } else {
            that._checkDbMismatch().then(function () {
              that._recheckMetaData().then(function (repoURLs) {
                resolve(repoURLs)
              }).catch(function (err) {
                reject(err)
              })
            }).catch(function (err) {
              reject(err)
            })
          }
        })
      })
    }
  }

  removeRepo (repoURLsToDelete, all = false) {
    var that = this
    if (this.repoURLs.length > 1 || all === true) {
      for (var repoURL of this.repoURLs) {
        for (var repoURLToDelete of repoURLsToDelete) {
          if (repoURL === repoURLToDelete) {
            this.repoURLs.splice(this.repoURLs.indexOf(repoURLToDelete), 1)
          }
        }
      }
      return new Promise(function (resolve, reject) {
        that.repoStore.setItem('repoURLs', that.repoURLs).then(function () {
          that._checkDbMismatch().then(function () {
            that._recheckMetaData().then(function () {
              resolve(that.repoURLs)
            }).catch(function (err) {
              reject(err)
            })
          }).catch(function (err) {
            reject(err)
          })
        })
      })
    } else {
      return new Promise(function (resolve, reject) {
        var newError = new Error('This is the last repo in the list! Not removing!')
        console.error(newError)
        reject(newError)
      })
    }
  }

  resetRepos () {
    var that = this
    return new Promise(function (resolve, reject) {
      that.removeRepo(that.repoURLs, true).then(function () {
        that.addDefaultRepo().then(function (repoURLs) {
          resolve(repoURLs)
        }).catch(function (err) {
          console.error(new Error('Reset failed due to exception!'))
          reject(err)
        })
      }).catch(function (err) {
        console.error(new Error('Reset failed due to exception'))
        reject(err)
      })
    })
  }
}
