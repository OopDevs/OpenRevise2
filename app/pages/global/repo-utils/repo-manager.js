class RepoManager {
  constructor () {
    this.repoStore = localforage.createInstance({
      name: 'OpenRevise2-Repos'
    })
    this.repoList = []
    this.repoMeta = []
    this.repoData = []
    return new Promise((resolve, reject) => {
      this.repoStore.getItem('repoList').then(function (repoList) {
        if (repoList !== []) {
          this.repoList = repoList
        }
        resolve()
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  refreshRepos () {
    for (var repo in this.repoList) {
      console.log(repo)
    }
  }

  addRepo (repoURL) {
    this.repoList.push(repoURL)
    return new Promise((resolve, reject) => {
      this.repoStore.setItem('repoList', this.repoList).then(function () {
        this.repoStore.getItem('repoList').then(function (repoList) {
          if (this.repoList === repoList) {
            resolve()
          } else {
            reject(new Error('New repoList mismatch. The repo list might not be saved.'))
          }
        })
      })
    })
  }

  removeRepo (repoURL) {
    return new Promise((resolve, reject) => {
      if (this.repoList.includes(repoURL)) {
        this.repoList.pop()
      }
    })
  }
}
