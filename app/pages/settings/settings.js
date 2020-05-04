SettingsManager.get('selectedTheme').then(function (selectedTheme) {
  console.log('Current theme: ' + selectedTheme)
  $('#settings-theme-select').val(selectedTheme)
  $('#settings-theme-select').on('change', function () {
    var that = this
    SettingsManager.set('selectedTheme', this.value).then(function () {
      try {
        swapAppTheme(that.value)
      } catch (err) {
        new BulmaModal('#settings-modal-themechangefailed').show()
        $('#settings-theme-select').val('bulma')
      }
    })
  })
})

function initRepoSettings () {
  var repos = new RepoManagerInstance()
  var repoCard = '<div class="card"><div class="card-content"><div class="media"><div class="media-left"><span class="icon is-square is-large is-hidden-mobile"><i class="fas fa-%3$s"></i></span></div><div class="media-content"><p class="title is-4">%1$s</p><p class="subtitle is-6">%2$s</p></div></div></div></div><br>'
  function addRepoCard (repoURL, repoMetaName, icon) {
    $('#settings-repository-list').append(sprintf(repoCard, repoURL, repoMetaName, icon))
  }
  function addRepoDelete (repoURL, repoMetaName) {
    $('#settings-modal-repository-remove-select').append(sprintf('<option value="%1$s">%1$s (%2$s)</option>', repoURL, repoMetaName))
  }
  repos.then(function (repoData) {
    for (var repoURL of repoData.repoURLs) {
      var repoMeta = repoData.repoMetas[repoData.repoURLs.indexOf(repoURL)].meta
      if (typeof (repoMeta) !== 'undefined') {
        addRepoCard(repoMeta.name, repoURL, 'check')
        addRepoDelete(repoURL, repoMeta.name)
      } else {
        addRepoCard('Unknown name', repoURL, 'exclamation-triangle')
        addRepoDelete(repoURL, 'Unknown name')
      }
    }
    var modals = {
      addRepo: new BulmaModal('#settings-modal-repository-add'),
      removeRepo: new BulmaModal('#settings-modal-repository-remove')
    }
    $('#settings-repository-buttons-add').prop('disabled', false)
    $('#settings-repository-buttons-add').click(function () {
      modals.addRepo.show()
    })
    $('#settings-modal-repository-add-input').on('input', function () {
      if (this.value === '') {
        $('#settings-modal-repository-add-button-add').prop('disabled', true)
      } else {
        $('#settings-modal-repository-add-button-add').prop('disabled', false)
      }
    })
    $('#settings-modal-repository-add-button-add').click(function () {
      $('#settings-modal-repository-add-button-add').addClass('is-loading')
      var newRepoURL = $('#settings-modal-repository-add-input').val()
      repoData.instance.addRepo(newRepoURL).then(function (repoURLs) {
        var repoMetaName = repos.instance.repoMetas[repoURLs.indexOf(newRepoURL)].meta.name
        if (typeof (repoMetaName) !== 'undefined') {
          addRepoCard(repoMetaName, newRepoURL, 'check')
        } else {
          addRepoCard(newRepoURL, 'Unknown name', 'exclamation-triangle')
        }
        addRepoDelete(repoURL, repoMetaName)
        $('#settings-modal-repository-add-input').val('')
        $('#settings-modal-repository-add-button-add').removeClass('is-loading')
        modals.addRepo.close()
      }).catch(function (err) {
        console.error('An error occured while adding the repository "' + newRepoURL + '":', err)
        new BulmaModal('#settings-modal-addrepoerror').show()
        repoData.instance.removeRepo(newRepoURL).then(function () {
          $('#settings-modal-repository-add-button-add').removeClass('is-loading')
          modals.addRepo.close()
        }).catch(function (err) {
          console.error(err)
        })
      })
    })
    $('#settings-repository-buttons-remove').prop('disabled', false)
    $('#settings-repository-buttons-remove').click(function () {
      modals.removeRepo.show()
    })
    $('#settings-modal-repository-remove-select').change(function () {
      if ($('#settings-modal-repository-remove-select').val() === []) {
        $('#settings-modal-repository-remove-button-remove').prop('disabled', true)
      } else {
        $('#settings-modal-repository-remove-button-remove').prop('disabled', false)
      }
    })
    $('#settings-modal-repository-remove-button-remove').click(function () {
      console.log('Delete the shit')
    })
    $('#settings-repository-buttons-loading').removeClass('is-loading')
  }).catch(function (err) {
    console.error('An error occured while loading the repository list!:', err)
    $('#settings-repository-buttons-add').prop('disabled', true)
    $('#settings-repository-buttons-remove').prop('disabled', true)
    $('#settings-repository-buttons-loading').removeClass('is-loading')
    new BulmaModal('#settings-modal-loadrepoerror').show()
  })
}

initRepoSettings()
