(function () {
  function switchPage (selectedPage) {
    MasterManager.openSubpage(selectedPage, 'revision')
  }
  $('#revision-buttons-notes').click(function () {
    switchPage('notes')
  })

  $('#revision-buttons-pastpapers').click(function () {
    switchPage('past-papers')
  })

  $('#revision-buttons-more').click(function () {
    switchPage('more')
  })
})()
