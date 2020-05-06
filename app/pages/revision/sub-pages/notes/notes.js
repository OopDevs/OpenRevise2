(function () {
  $('#notes-breadcrumb-revision').click(function () {
    MasterManager.exitSubpage('revision')
  })
  function handleRepoManagerRejection (err) {
    console.error('An error occured while performing a RepoManager transaction:', err)
    $('#notes-buttons-refresh').removeClass('is-loading')
    $('#notes-buttons-refresh').prop('disabled', true)
    $('#notes-select-repo').prop('disabled', true)
    new BulmaModal('#notes-modal-loadrepoerror').show()
  }
  // For special 'courses' that shouldn't be displayed with the other courses.
  // e.g Past Papers and Blog, which is handled in their separate pages.
  var SPECIAL_COURSES = ['Past Papers', 'Blog']
  var repos = new RepoManagerInstance()
  var repoDatasCache = {}
  repos.initializeInstance().then(function () {
    function refreshCoursesList () {
      $('#notes-buttons-refresh').addClass('is-loading')
      $('#notes-select-repo').prop('disabled', true)
      $('#notes-courses-list').empty()
      $('#notes-select-repo').empty()
      $('#notes-select-repo').append('<option value="all">All repositories</option>')
      repos.refreshRepoDatas().then(function (repoDatas) {
        repoDatasCache = {}
        for (var repoDatasIndex in repoDatas) {
          var repoMetaName = repos.repoMetas[repoDatasIndex].meta.name
          repoDatasCache[repoMetaName] = {}
          $('#notes-select-repo').append(sprintf('<option value="%1$s">%1$s</option>', repoMetaName))
          for (var course in repoDatas[repoDatasIndex]) {
            if (jQuery.inArray(course, SPECIAL_COURSES) === -1) {
              repoDatasCache[repoMetaName][course] = repoDatas[repoDatasIndex][course]
              $('#notes-courses-list').append(
                sprintf('<div class="tile is-child box is-clickable openrevise-repo-courses" data-openrevise-repouri="%1$s"><h1 class="title is-4">%2$s</h1><h2 class="subtitle is-6">%3$s</h2></div>',
                  repoMetaName + '/' + course,
                  course,
                  repoMetaName))
            }
          }
        }
        $('.openrevise-repo-courses').click(function () {
          console.log($(this).data('openrevise-repouri'))
        })
        $('#notes-select-repo').val('all')
        $('#notes-buttons-refresh').removeClass('is-loading')
        $('#notes-select-repo').prop('disabled', false)
        console.log(repoDatasCache)
      }).catch(function (err) {
        handleRepoManagerRejection(err)
      })
    }
    // Use only after the data has been refreshed at least once!
    function filterCoursesList (filter) {
      $('#notes-select-repo').prop('disabled', true)
      $('#notes-courses-list').empty()
      $('#notes-buttons-refresh').addClass('is-loading')
      repoDatasCache = {}
      for (var repoDatasIndex in repos.repoDatas) {
        var repoMetaName = repos.repoMetas[repoDatasIndex].meta.name
        repoDatasCache[repoMetaName] = {}
        if (filter === 'all' || filter === repoMetaName) {
          for (var course in repos.repoDatas[repoDatasIndex]) {
            if (jQuery.inArray(course, SPECIAL_COURSES) === -1) {
              repoDatasCache[repoMetaName][course] = repos.repoDatas[repoDatasIndex][course]
              $('#notes-courses-list').append(
                sprintf('<div class="tile is-child box is-clickable openrevise-repo-courses" data-openrevise-repouri="%1$s"><h1 class="title is-4">%2$s</h1><h2 class="subtitle is-6">%3$s</h2></div>',
                  repoMetaName + '/' + course,
                  course,
                  repoMetaName))
            }
          }
        }
      }
      $('.openrevise-repo-courses').click(function () {
        console.log($(this).data('openrevise-repouri'))
      })
      $('#notes-buttons-refresh').removeClass('is-loading')
      $('#notes-select-repo').prop('disabled', false)
      console.log(repoDatasCache)
    }
    $('#notes-buttons-refresh').click(function () {
      refreshCoursesList()
    })
    $('#notes-select-repo').change(function () {
      console.log('Selected filter:' + this.value)
      filterCoursesList(this.value)
    })
    // Populate the list for the first time.
    refreshCoursesList()
  }).catch(function (err) {
    handleRepoManagerRejection(err)
  })
})()
