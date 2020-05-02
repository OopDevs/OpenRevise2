SettingsManager.get('selectedTheme').then(function (selectedTheme) {
  console.log('Current theme: ' + selectedTheme)
  $('#settings-select-theme').val(selectedTheme)
  $('#settings-select-theme').on('change', function () {
    swapAppTheme(this.value)
    SettingsManager.set('selectedTheme', this.value).then(function () {
      SettingsManager.get('selectedTheme').then(function (selectedTheme2) {
        if (selectedTheme2 === this.value) {
          console.log('Set theme: ' + selectedTheme2)
        }
      })
    })
  })
})

function initRepoSettings () {
  var repos = new RepoManager()
  var repoCard = '<div class="card"><div class="card-content"><div class="media"><div class="media-left"><span class="icon is-square is-large is-hidden-mobile"><i class="fas fa-%3$s"></i></span></div><div class="media-content"><p class="title is-4">%1$s</p><p class="subtitle is-6">%2$s</p></div></div></div></div>'
  repos.then(function (repoData) {
    var repoURLsList = $('#settings-repository-list')
    for (var repoURL of repoData.repoURLs) {
      var repoMeta = repoData.repoMetas[repoData.repoURLs.indexOf(repoURL)].meta
      console.log(repoMeta)
      if (typeof (repoMeta) !== 'undefined') {
        repoURLsList.append(sprintf(repoCard, repoMeta.name, repoURL, 'check'))
      } else {
        repoURLsList.append(sprintf(repoCard, 'Unknown name', repoURL, 'exclamation-triangle'))
      }
    }
    repoData.ManagerInstance.refreshRepoMetas().then(function (repoMeta) {
      console.log('Test' + repoMeta)
    })
  })
}

initRepoSettings()
