class RepoManager {
  constructor () {
    this.repoStore = localforage.createInstance({
      name: 'OpenRevise2-Repos'
    })
    this.repoURLs = []
    this.repoMetas = []
    this.repoData = []
    this.repoContactor = new Worker('global/repo-utils/repo-worker.js')
    var that = this
    return new Promise((resolve, reject) => {
      that.repoStore.getItem('repoURLs').then(function (repoURLs) {
        if (repoURLs !== [] && typeof (repoURLs) !== 'undefined' && repoURLs !== null) {
          that.repoURLs = repoURLs
        } else {
          // Add the default repository (CHANGE ME IF REQUIRED!)
          that.addRepo('https://openstudysystems.github.io/OpenReviseNotes').catch(function (err) {
            console.error(err)
          })
        }
        that.refreshRepoMetas().then(function () {
          resolve({
            ManagerInstance: that,
            repoURLs: that.repoURLs,
            repoMetas: that.repoMetas
          })
        }).catch(function (err) {
          reject(err)
        })
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  refreshRepoMetas () {
    var that = this
    return new Promise(function (resolve, reject) {
      that.repoContactor.postMessage(that.repoURLs)
      that.repoContactor.onmessage = function (e) {
        try {
          if (e.data === 'error') {
            reject(new Error('Could not get the repo meta!'))
          } else {
            that.repoMetas = []
            for (var repoMeta of e.data) {
              that.repoMetas.push(repoMeta)
            }
            resolve(that.repoMetas)
          }
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  _checkDbMismatch () {
    var that = this
    return new Promise(function (resolve, reject) {
      that.repoStore.getItem('repoURLs').then(function (repoURLs) {
        console.log(repoURLs)
        if (that.repoURLs === repoURLs) {
          resolve()
        } else {
          reject(new Error('repoURLs mismatch. The repo list might not be saved.'))
        }
      })
    })
  }

  addRepo (repoURLs) {
    var that = this
    this.repoURLs.push(repoURLs)
    return new Promise((resolve, reject) => {
      that.repoStore.setItem('repoURLs', that.repoURLs).then(function () {
        that._checkDbMismatch().then(function () {
          resolve(that.repoURLs)
        }).catch(function (err) {
          reject(err)
        })
      })
    })
  }

  removeRepo (repoURLs) {
    var that = this
    if (this.repoURLs.includes(repoURLs)) {
      this.repoURLs.pop()
    }
    return new Promise((resolve, reject) => {
      that.repoStore.setItem('repoURLs', that.repoURLs).then(function () {
        that._checkDbMismatch().then(function () {
          resolve(that.repoURLs)
        }).catch(function (err) {
          reject(err)
        })
      })
    })
  }
}
