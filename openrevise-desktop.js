const { app, BrowserWindow } = require('electron')

function createWindow () {
  var win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false
    }
  })

  if (process.platform !== 'darwin') {
    //win.removeMenu()
  }

  win.loadFile('app/master.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
