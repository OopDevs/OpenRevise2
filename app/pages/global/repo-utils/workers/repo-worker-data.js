onmessage = function (e) {
  var toReturn = []
  for (var repoURL of e.data.repoURLs) {
    var request = new XMLHttpRequest()
    try {
      var dbPath = e.data.repoMetas[e.data.repoURLs.indexOf(repoURL)].db.path
      if (dbPath) {
        request.open('GET', repoURL + dbPath, false)
      } else {
        request.open('GET', '/notes/', false)
      }
      request.setRequestHeader('Content-Type', 'application/json')
      request.send()
      if (request.status === 200) {
        this.console.log('Notes data for repo: ' + repoURL, request.responseText)
        toReturn.push(JSON.parse(request.responseText))
      } else {
        toReturn.push({})
      }
    } catch (err) {
      this.console.warn('We cannot reach ' + repoURL + ' right now, pushing empty object!')
      toReturn.push({})
    }
  }
  postMessage(toReturn)
}
