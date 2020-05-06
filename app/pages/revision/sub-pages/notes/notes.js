(function () {
  $('#notes-breadcrumb-revision').click(function () {
    MasterManager.exitSubpage('revision')
  })
  // For special 'courses' that shouldn't be displayed with the other courses.
  // e.g Past Papers and Blog, which is handled in their separate pages.
  var SPECIAL_COURSES = ['Past Papers', 'Blog']
  var repos = new RepoManagerInstance()
  repos.initializeInstance().then(function (readyObject) {
    var repoDatasCache = {}
    function refreshCoursesList (filter) {
      $('#notes-courses-list').empty()
      $('#notes-select-repo').empty()
      $('#notes-select-repo').append('<option value="all">All repositories</option>')
      $('#notes-buttons-refresh').addClass('is-loading')
      $('#notes-select-repo').prop('disabled', true)
      repos.refreshRepoDatas().then(function (repoDatas) {
        for (var repoDatasIndex in repoDatas) {
          var repoMetaName = readyObject.repoMetas[repoDatasIndex].meta.name
          repoDatasCache[repoMetaName] = {}
          $('#notes-select-repo').append(sprintf('<option value="%1$s">%1$s</option>', repoMetaName))
          if (filter === 'all' || filter === repoMetaName) {
            for (var course in repoDatas[repoDatasIndex]) {
              if (jQuery.inArray(course, SPECIAL_COURSES) === -1) {
                repoDatasCache[repoMetaName][course] = repoDatas[repoDatasIndex]
                $('#notes-courses-list').append(
                  sprintf('<div class="tile is-child box is-clickable openrevise-repo-courses" data-openrevise-repouri="%1$s"><h1 class="title is-4">%2$s</h1><h2 class="subtitle is-6">%3$s</h2></div>',
                    repoMetaName + '/' + course,
                    course,
                    repoMetaName))
              }
            }
          }
        }
        $('#notes-select-repo').val(filter)
        $('#notes-buttons-refresh').removeClass('is-loading')
        $('#notes-select-repo').prop('disabled', false)
      }).catch(function (err) {
        console.error('An error occured while reloading the repository list!:', err)
        $('#notes-buttons-refresh').removeClass('is-loading')
        $('#notes-buttons-refresh').prop('disabled', true)
        $('#notes-select-repo').prop('disabled', true)
        new BulmaModal('#notes-modal-loadrepoerror').show()
      })
    }
    $('#notes-buttons-refresh').click(function () {
      refreshCoursesList('all')
    })
    $('#notes-select-repo').change(function () {
      refreshCoursesList(this.value)
    })
    // Populate the list for the first time.
    refreshCoursesList('all')
  }).catch(function (err) {
    console.error('An error occured while initializing the repository list!:', err)
    $('#notes-buttons-refresh').removeClass('is-loading')
    $('#notes-buttons-refresh').prop('disabled', true)
    $('#notes-select-repo').prop('disabled', true)
    new BulmaModal('#notes-modal-loadrepoerror').show()
  })
})()
