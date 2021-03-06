// TODO: clean up code!

(function () {
  $('#notes-breadcrumb-revision').click(function () {
    MasterManager.exitSubpage('revision')
  })
  function handleRepoManagerRejection (err) {
    console.error('An error occured while performing a RepoManager transaction:', err)
    $('#notes-buttons-repos-refresh').removeClass('is-loading')
    $('#notes-buttons-repos-refresh').prop('disabled', true)
    $('#notes-select-repo').prop('disabled', true)
    new BulmaModal('#notes-modals-loadrepoerror').show()
  }
  // For special 'courses' that shouldn't be displayed with the other courses.
  // e.g Past Papers and Blog, which is handled in their separate pages.
  var SPECIAL_COURSES = ['Past Papers', 'Blog']
  var repos = new RepoManagerInstance()
  var repoDatasCache = {}
  var embeddedNotesViewer = new EmbeddableNotesViewer('#notes-section-notesviewer')
  function filterCourseChaptersList () {
    var URIParts = $('#notes-select-chapter').children('option:selected').data('openrevise-repouri').split('/')
    if (Object.prototype.hasOwnProperty.call(repoDatasCache[URIParts[0]][URIParts[1]], URIParts[2])) {
      $('#notes-select-chapter').prop('disabled', true)
      $('#notes-chapter-filelist').empty()
      for (var fileFormat in repoDatasCache[URIParts[0]][URIParts[1]][URIParts[2]]) {
        $('#notes-chapter-filelist').append(sprintf('<h1 class="title is-4 is-unselectable">%1$s</h1>', '.' + fileFormat))
        var fileFormatList = $('<ul></ul>')
        for (var file of repoDatasCache[URIParts[0]][URIParts[1]][URIParts[2]][fileFormat]) {
          fileFormatList.append(sprintf('<li><a class="openrevise-repo-chapter-file is-link" data-openrevise-repouri="%1$s">%2$s<a></li>',
            URIParts[0] + '/' + URIParts[1] + '/' + URIParts[2] + '/' + file,
            file))
        }
        $('#notes-chapter-filelist').append(fileFormatList)
      }
      $('.openrevise-repo-chapter-file').click(function () {
        var repoURIData = $(this).data('openrevise-repouri')
        var realURL = repos.getURLFromOpenReviseURI(repoURIData)
        var URIParts = repoURIData.split('/')
        if (URIParts[3].split('.')[1] === 'md') {
          NotesViewerController.loadMarkdownFromURL(realURL)
          embeddedNotesViewer.showNotesViewer()
        } else {
          window.open(realURL, '_blank')
        }
      })
      $('#notes-select-chapter').prop('disabled', false)
    } else {
      throw new TypeError('Chapter does not exist!', URIParts[2])
    }
  }
  function refreshCourseChaptersList (openreviseRepoURI) {
    var URIParts = openreviseRepoURI.split('/')
    console.log(repoDatasCache[URIParts[0]])
    if (Object.prototype.hasOwnProperty.call(repoDatasCache[URIParts[0]], URIParts[1])) {
      $('#notes-courses-view').addClass('is-hidden')
      $('#notes-chapter-fileslist').empty()
      $('#notes-chapter-title').text(openreviseRepoURI)
      $('#notes-buttons-chapter-loading').addClass('is-loading')
      $('#notes-chapters-view').removeClass('is-hidden')
      $('#notes-breadcrumb-notes').removeClass('is-active')
      $('#notes-breadcrumbs').append('<li id="notes-breadcrumb-chapters" class="is-active"><a><span class="icon is-small"><i class="fas fa-bookmark"></i></span><span>Chapters</span></a></li>')
      $('#notes-select-chapter').empty()
      for (var chapter in repoDatasCache[URIParts[0]][URIParts[1]]) {
        $('#notes-select-chapter').append(sprintf('<option value="%1$s" data-openrevise-repouri="%2$s">%1$s</option>', chapter, URIParts[0] + '/' + URIParts[1] + '/' + chapter))
      }
      filterCourseChaptersList()
      $('#notes-select-chapter').prop('disabled', false)
      $('#notes-buttons-chapter-loading').removeClass('is-loading')
    } else {
      throw new TypeError('Course does not exist!', URIParts[1])
    }
  }
  function refreshCoursesList () {
    $('#notes-buttons-repos-refresh').addClass('is-loading')
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
        refreshCourseChaptersList($(this).data('openrevise-repouri'))
      })
      $('#notes-select-repo').val('all')
      $('#notes-buttons-repos-refresh').removeClass('is-loading')
      $('#notes-select-repo').prop('disabled', false)
      console.log(repoDatasCache)
    }).catch(function (err) {
      handleRepoManagerRejection(err)
    })
  }

  function filterCoursesList (filter) {
    $('#notes-select-repo').prop('disabled', true)
    $('#notes-courses-list').empty()
    $('#notes-buttons-repos-refresh').addClass('is-loading')
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
      refreshCourseChaptersList($(this).data('openrevise-repouri'))
    })
    $('#notes-buttons-repos-refresh').removeClass('is-loading')
    $('#notes-select-repo').prop('disabled', false)
    console.log(repoDatasCache)
  }

  repos.initializeInstance().then(function () {
    // Populate the list for the first time.
    refreshCoursesList()
    $('#notes-buttons-repos-refresh').click(function () {
      refreshCoursesList()
    })
    $('#notes-select-repo').change(function () {
      console.log('Selected repo filter:' + this.value)
      filterCoursesList(this.value)
    })
    $('#notes-select-chapter').change(function () {
      console.log('Selected chapter filter: ' + this.value)
      filterCourseChaptersList()
    })
    $('#notes-breadcrumb-notes').click(function () {
      $('#notes-chapters-view').addClass('is-hidden')
      $('#notes-breadcrumb-chapters').remove()
      $(this).addClass('is-active')
      $('#notes-courses-view').removeClass('is-hidden')
    })
    var notesViewerElement = $('#notes-section-notesviewer')
    notesViewerElement.on('NotesViewer:ViewerShown', function () {
      MasterManager.hideNavBar()
    })
    notesViewerElement.on('NotesViewer:ViewerShowing', function () {
      $('#notes-section-coursebrowser').addClass('is-hidden')
      $('#notes-section-coursebrowser').hide()
    })
    notesViewerElement.on('NotesViewer:ViewerHidden', function () {
      MasterManager.showNavBar()
    })
    notesViewerElement.on('NotesViewer:ViewerHiding', function () {
      $('#notes-section-coursebrowser').removeClass('is-hidden')
      $('#notes-section-coursebrowser').show()
    })
    embeddedNotesViewer.initializeNotesViewer()
  }).catch(function (err) {
    handleRepoManagerRejection(err)
  })
})()
