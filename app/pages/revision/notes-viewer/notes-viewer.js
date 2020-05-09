(function () {
  var content = $('#notesviewer-content')
  var defaultSettings = {
    fontFamily: 'Charter',
    fontSize: '18px'
  }
  SettingsManager.get('NotesViewer-FontFamily').then(function (fontFamily) {
    if (fontFamily === null) {
      SettingsManager.set('NotesViewer-FontFamily', defaultSettings.fontFamily)
    } else {
      content.css('font-family', fontFamily)
      $('#notesviewer-modals-settings-font-select').val(fontFamily)
    }
  })
  SettingsManager.get('NotesViewer-FontSize').then(function (fontSize) {
    if (fontSize === null) {
      SettingsManager.set('NotesViewer-FontSize', defaultSettings.fontSize)
    } else {
      content.css('font-size', fontSize + 'px')
      $('#notesviewer-modals-settings-font-size').val(fontSize)
    }
  })
  var modals = {
    font_settings: new BulmaModal('#notesviewer-modals-settings-font')
  }
  $('#notesviewer-navbar-burger').click(function () {
    $('#notesviewer-navbar-burger').toggleClass('is-active')
    $('#notesviewer-navbar-menu').toggleClass('is-active')
  })

  $('#notesviewer-buttons-font').click(function () {
    modals.font_settings.show()
  })

  $('#notesviewer-modals-settings-font-button-save').click(function () {
    $(this).addClass('is-loading')
    var fontSettings = {
      fontFamily: $('#notesviewer-modals-settings-font-select').val(),
      fontSize: $('#notesviewer-modals-settings-font-size').val()
    }
    var that = this
    SettingsManager.set('NotesViewer-FontFamily', fontSettings.fontFamily).then(function () {
      if (fontSettings['font-family'] !== 'default') {
        content.css('font-family', fontSettings.fontFamily)
      } else {
        content.css('font-family', 'initial')
      }
    }).then(function () {
      SettingsManager.set('NotesViewer-FontSize', fontSettings.fontSize).then(function () {
        content.css('font-size', fontSettings.fontSize + 'px')
        $(that).removeClass('is-loading')
        $('#notesviewer-navbar-burger').click()
        modals.font_settings.close()
      })
    })
  })
})()

var NotesViewerController = {
  currentURL: '',
  lastLoadFailed: false,
  markdownConverter: new showdown.Converter()
}

NotesViewerController.markdownConverter.setFlavor('github')
NotesViewerController.markdownConverter.setOption('strikethrough', true)
NotesViewerController.markdownConverter.setOption('tables', true)
NotesViewerController.markdownConverter.setOption('ghCodeBlocks', true)
NotesViewerController.markdownConverter.setOption('ghCompatibleHeaderId', true)
NotesViewerController.markdownConverter.setOption('simplifiedAutoLink', true)
NotesViewerController.markdownConverter.setOption('emoji', true)

NotesViewerController.loadMarkdownFromURL = function (url) {
  if (url !== NotesViewerController.currentURL || NotesViewerController.lastLoadFailed) {
    $('#notesviewer-buttons-loading').removeClass('is-hidden')
    var content = $('#notesviewer-content')
    jQuery.get(url, function (data) {
      content.empty()
      content.html(NotesViewerController.markdownConverter.makeHtml(data))
      NotesViewerController.lastLoadFailed = false
    }).fail(function () {
      NotesViewerController.lastLoadFailed = true
      jQuery.get('revision/notes-viewer/404.md', function (data) {
        content.html(NotesViewerController.markdownConverter.makeHtml(data))
      }).fail(function () {
        content.html('<h1 class="title is-3">Whoops</h1><br><p>We could not even get the 404 error page. Check your internet connection.</p>')
      })
    }).always(function () {
      NotesViewerController.currentURL = url
      $('#notesviewer-buttons-loading').addClass('is-hidden')
    })
  }
}

// var NotesViewerController = {
//   currentURL: '',
//   lastLoadFailed: false,
//   markedOptions: {
//     gfm: true
//   }
// }

// NotesViewerController.loadMarkdownFromURL = function (url) {
//   if (url !== NotesViewerController.currentURL || NotesViewerController.lastLoadFailed) {
//     $('#notesviewer-buttons-loading').removeClass('is-hidden')
//     var content = $('#notesviewer-content')
//     jQuery.get(url, function (data) {
//       content.empty()
//       content.html(marked(data, NotesViewerController.markedOptions))
//       NotesViewerController.lastLoadFailed = false
//     }).fail(function () {
//       NotesViewerController.lastLoadFailed = true
//       jQuery.get('revision/notes-viewer/404.md', function (data) {
//         content.html(marked(data, NotesViewerController.markedOptions))
//       }).fail(function () {
//         content.html('<h1 class="title is-3">Whoops</h1><br><p>We could not even get the 404 error page. Check your internet connection.</p>')
//       })
//     }).always(function () {
//       NotesViewerController.currentURL = url
//       $('#notesviewer-buttons-loading').addClass('is-hidden')
//     })
//   }
// }
