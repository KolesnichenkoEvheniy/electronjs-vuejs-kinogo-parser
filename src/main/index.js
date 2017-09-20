import { app, BrowserWindow, Menu } from 'electron'
import updater from 'electron-simple-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/*updater.init({
  autoDownload: false
});*/

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// Just place this code at the entry point of your application: 

updater.init({
  checkUpdateOnStart: false,
  autoDownload: false
});

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create the Application's main menu
  let template = [];
  if (process.platform === 'darwin') {
    template.push({
        label: "Парсер фильмов",
        submenu: [
            { label: "Выход", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]});
  }

  template.push({
  label: "Правка",
  submenu: [
      { label: "Назад", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Вперед", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Вырезать", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Скопировать", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Вставить", accelerator: "CmdOrCtrl+V", selector: "paste:" }
  ]});

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


/*import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
