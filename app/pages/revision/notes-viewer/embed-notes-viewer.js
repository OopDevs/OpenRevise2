class EmbeddableNotesViewer {
  constructor (hostElement, notesViewerBasePath) {
    this.hostElement = $(hostElement)
    this.notesViewerBasePath = notesViewerBasePath
  }

  initializeNotesViewer () {
    var that = this
    this.hostElement.load(this.notesViewerBasePath + '/notes-viewer.html', function () {
      $('#notesviewer-buttons-back').click(function () {
        that.hideNotesViewer()
        that.hostElement.trigger('NotesViewer:Exit')
      })
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
    this.hostElement.show()
    this.hostElement.trigger('NotesViewer:ViewerHidden')
  }
}
