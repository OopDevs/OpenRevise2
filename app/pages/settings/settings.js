// TODO: clean up code
// TODO: fix repo code to remove betaFlag and allow user usage

(function () {
  SettingsManager.get('Global-SelectedTheme').then(function (selectedTheme) {
    console.log('Current theme: ' + selectedTheme)
    $('#settings-theme-select').val(selectedTheme)
    $('#settings-theme-select').on('change', function () {
      var that = this
      SettingsManager.set('Global-SelectedTheme', this.value).then(function () {
        try {
          MasterManager.swapAppTheme(that.value)
        } catch (err) {
          new BulmaModal('#settings-modal-themechangefailed').show()
          $('#settings-theme-select').val('bulma')
        }
      })
    })
  })
  var repos = new RepoManagerInstance()
  function addRepoCard (repoURL, repoMetaName) {
    $('#settings-repository-list').append(sprintf('<div class="tile is-child box"><h1 class="title is-4">%1$s</h1><h2 class="subtitle is-6">%2$s</h2></div>', repoURL, repoMetaName))
  }
  function addRepoDelete (repoURL, repoMetaName) {
    $('#settings-modal-repository-remove-select').append(sprintf('<option value="%1$s">%1$s (%2$s)</option>', repoURL, repoMetaName))
  }
  function addReposIntoView (repoURLs) {
    for (var repoURL of repoURLs) {
      var repoMetaName = repos.repoMetas[repoURLs.indexOf(repoURL)].meta.name
      if (typeof (repoMetaName) !== 'undefined') {
        addRepoCard(repoMetaName, repoURL)
      } else {
        addRepoCard('Unknown name', repoURL)
      }
      addRepoDelete(repoURL, repoMetaName)
    }
  }
  repos.initializeInstance().then(function (readyObject) {
    for (var repoURL of readyObject.repoURLs) {
      var repoMeta = readyObject.repoMetas[readyObject.repoURLs.indexOf(repoURL)].meta
      if (typeof (repoMeta) !== 'undefined') {
        addRepoCard(repoMeta.name, repoURL)
        addRepoDelete(repoURL, repoMeta.name)
      } else {
        addRepoCard('Unknown name', repoURL)
        addRepoDelete(repoURL, 'Unknown name')
      }
    }
    var modals = {
      addRepo: new BulmaModal('#settings-modal-repository-add'),
      removeRepo: new BulmaModal('#settings-modal-repository-remove'),
      resetRepo: new BulmaModal('#settings-modal-repository-reset')
    }
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
      repos.addRepo(newRepoURL).then(function (repoURLs) {
        var repoMetaName = repos.repoMetas[repoURLs.indexOf(newRepoURL)].meta.name
        if (typeof (repoMetaName) !== 'undefined') {
          addRepoCard(repoMetaName, newRepoURL)
        } else {
          addRepoCard('Unknown name', newRepoURL)
        }
        addRepoDelete(repoURL, repoMetaName)
        $('#settings-modal-repository-add-input').val('')
        $('#settings-modal-repository-add-button-add').removeClass('is-loading')
        modals.addRepo.close()
      }).catch(function (err) {
        console.error('An error occured while adding the repository "' + newRepoURL + '":', err)
        new BulmaModal('#settings-modal-addrepoerror').show()
        repos.removeRepo(newRepoURL).then(function () {
          $('#settings-modal-repository-add-button-add').removeClass('is-loading')
          modals.addRepo.close()
        }).catch(function (err) {
          console.error(err)
        })
      })
    })
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
      $('#settings-modal-repository-remove-button-remove').addClass('is-loading')
      $('#settings-modal-repository-remove-select').prop('disabled', true)
      repos.removeRepo($('#settings-modal-repository-remove-select').val()).then(function (repoURLs) {
        $('#settings-modal-repository-remove-select').prop('disabled', false)
        $('#settings-modal-repository-remove-select').empty()
        $('#settings-repository-list').empty()
        addReposIntoView(repoURLs)
        $('#settings-modal-repository-remove-button-remove').removeClass('is-loading')
        $('#settings-modal-repository-remove-button-remove').prop('disabled', true)
        modals.removeRepo.close()
      }).catch(function (err) {
        $('#settings-modal-repository-remove-button-remove').removeClass('is-loading')
        $('#settings-modal-repository-remove-select').prop('disabled', false)
        $('#settings-modal-repository-remove-button-remove').prop('disabled', true)
        console.error(err)
      })
    })
    $('#settings-repository-buttons-reset').click(function () {
      modals.resetRepo.show()
    })
    $('#settings-modal-repository-reset-button-reset').click(function () {
      $(this).addClass('is-loading')
      $(this).prop('disabled', true)
      var that = this
      repos.resetRepos().then(function (repoURLs) {
        $('#settings-repository-list').empty()
        addReposIntoView(repoURLs)
        $(that).removeClass('is-loading')
        $(that).prop('disabled', false)
        modals.resetRepo.close()
      }).catch(function (err) {
        $(that).removeClass('is-loading')
        $(that).prop('disabled', false)
        modals.resetRepo.close()
        console.error(err)
      })
    })
  }).catch(function (err) {
    console.error('An error occured while loading the repository list!:', err)
    $('#settings-repository-buttons-add').prop('disabled', true)
    $('#settings-repository-buttons-remove').prop('disabled', true)
    new BulmaModal('#settings-modal-loadrepoerror').show()
  })
})()
