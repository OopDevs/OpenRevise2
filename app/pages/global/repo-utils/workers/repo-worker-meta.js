onmessage = function (e) {
  var toReturn = []
  for (var repoURL of e.data) {
    var request = new XMLHttpRequest()
    request.open('GET', repoURL + '/repo/', false)
    request.setRequestHeader('Content-Type', 'application/json')
    try {
      request.send()
      if (request.status === 200) {
        this.console.log('Repo data for repo: ' + repoURL, request.responseText)
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
