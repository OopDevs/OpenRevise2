onmessage = function (e) {
  var toReturn = []
  for (var repoURL of e.data) {
    var request = new XMLHttpRequest()
    request.open('GET', repoURL + '/repo/index.json', false)
    request.setRequestHeader('Content-Type', 'application/json')
    request.send()
    if (request.status === 200) {
      try {
        this.console.log(repoURL + '\n\n' + request.responseText)
        toReturn.push(JSON.parse(request.responseText))
      } catch (err) {
        postMessage('error')
      }
    }
  }
  postMessage(toReturn)
}
