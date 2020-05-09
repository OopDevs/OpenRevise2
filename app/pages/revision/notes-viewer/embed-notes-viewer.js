class EmbeddableNotesViewer {
  constructor (hostElement) {
    this.hostElement = $(hostElement)
    this.notesViewerBasePath = 'revision/notes-viewer'
  }

  initializeNotesViewer () {
    var that = this
    this.hostElement.load(this.notesViewerBasePath + '/notes-viewer.html', function () {
      $('#notesviewer-buttons-back').click(function () {
        that.hideNotesViewer()
        that.hostElement.trigger('NotesViewer:Exit')
      })
      if (typeof (MASTER_POPUP) !== 'undefined') {
        $('#notesviewer-buttons-back').remove()
        $('#notesviewer-buttons-popup').remove()
      }
      that.hostElement.trigger('NotesViewer:InitComplete')
    })
  }

  showNotesViewer () {
    this.hostElement.trigger('NotesViewer:ViewerShowing')
    this.hostElement.removeClass('is-hidden')
    this.hostElement.show()
    this.hostElement.trigger('NotesViewer:ViewerShown')
  }

  hideNotesViewer () {
    this.hostElement.trigger('NotesViewer:ViewerHiding')
    this.hostElement.addClass('is-hidden')
    this.hostElement.hide()
    this.hostElement.trigger('NotesViewer:ViewerHidden')
  }
}
