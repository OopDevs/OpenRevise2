(function () {
  $('#past-papers-breadcrumb-revision').click(function () {
    MasterManager.exitSubpage('revision')
  })
  function handleRepoManagerRejection (err) {
    console.error('An error occured while performing a RepoManager transaction:', err)
    $('#past-papers-buttons-refresh').removeClass('is-loading')
    $('#past-papers-buttons-refresh').prop('disabled', true)
    $('#past-papers-select-repo').prop('disabled', true)
    new BulmaModal('#past-papers-modal-loadrepoerror').show()
  }
  var repos = new RepoManagerInstance()
  var repoDatasCache = {}
  function refreshPastPapersList () {
    $('#past-papers-select-repo').prop('disabled', true)
    $('#past-papers-select-repo').empty()
    $('#past-papers-papers-list').empty()
    $('#past-papers-buttons-refresh').addClass('is-loading')
    $('#past-papers-select-repo').append('<option value="all">All repositories</option>')
    repos.refreshRepoDatas().then(function (repoDatas) {
      repoDatasCache = {}
      for (var repoDatasIndex in repoDatas) {
        var repoMetaName = repos.repoMetas[repoDatasIndex].meta.name
        repoDatasCache[repoMetaName] = {}
        for (var course in repoDatas[repoDatasIndex]) {
          if (course === 'Past Papers') {
            repoDatasCache[repoMetaName][course] = {}
            $('#past-papers-select-repo').append(sprintf('<option value="%1$s">%1$s</option>', repoMetaName))
            for (var pastPapersList in repoDatas[repoDatasIndex][course]) {
              repoDatasCache[repoMetaName][course][pastPapersList] = repoDatas[repoDatasIndex][course][pastPapersList]
              if (repoDatas[repoDatasIndex][course][pastPapersList].md) {
                $('#past-papers-papers-list').append(
                  sprintf('<div class="tile is-child box is-clickable openrevise-repo-past-papers" data-openrevise-repouri="%1$s"><h1 class="title is-4">%2$s</h1><h2 class="subtitle is-6">%3$s</h2></div>',
                    repoMetaName + '/' + course + '/' + pastPapersList + '/' + 'Past Papers.md',
                    pastPapersList,
                    repoMetaName))
              }
            }
            break
          }
        }
      }
      $('.openrevise-repo-past-papers').click(function () {
        console.log(repos.getURLFromOpenReviseURI($(this).data('openrevise-repouri')))
      })
      $('#past-papers-select-repo').prop('disabled', false)
      $('#past-papers-buttons-refresh').removeClass('is-loading')
      console.log(repoDatasCache)
    }).catch(function (err) {
      handleRepoManagerRejection(err)
    })
  }
  function filterPastPapersList (filter) {
    $('#past-papers-select-repo').prop('disabled', true)
    $('#past-papers-papers-list').empty()
    $('#past-papers-buttons-refresh').addClass('is-loading')
    for (var repoDatasIndex in repos.repoDatas) {
      var repoMetaName = repos.repoMetas[repoDatasIndex].meta.name
      if (repoMetaName === filter || filter === 'all') {
        repoDatasCache[repoMetaName] = {}
        for (var course in repos.repoDatas[repoDatasIndex]) {
          if (course === 'Past Papers') {
            repoDatasCache[repoMetaName][course] = {}
            for (var pastPapersList in repos.repoDatas[repoDatasIndex][course]) {
              repoDatasCache[repoMetaName][course][pastPapersList] = repos.repoDatas[repoDatasIndex][course][pastPapersList]
              if (repos.repoDatas[repoDatasIndex][course][pastPapersList].md[0] === 'Past Papers.md') {
                $('#past-papers-papers-list').append(
                  sprintf('<div class="tile is-child box is-clickable openrevise-repo-past-papers" data-openrevise-repouri="%1$s"><h1 class="title is-4">%2$s</h1><h2 class="subtitle is-6">%3$s</h2></div>',
                    repoMetaName + '/' + course + '/' + pastPapersList + '/' + 'Past Papers.md',
                    pastPapersList,
                    repoMetaName))
              }
            }
            break
          }
        }
      }
    }
    $('.openrevise-repo-past-papers').click(function () {
      console.log(repos.getURLFromOpenReviseURI($(this).data('openrevise-repouri')))
    })
    $('#past-papers-select-repo').prop('disabled', false)
    $('#past-papers-buttons-refresh').removeClass('is-loading')
  }
  repos.initializeInstance().then(function () {
    refreshPastPapersList()
    $('#past-papers-select-repo').change(function () {
      console.log('Selected past papers repo filter: ' + this.value)
      filterPastPapersList(this.value)
    })
  }).catch(function (err) {
    handleRepoManagerRejection(err)
  })
})()
