import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import processCompressedFile from './unzip_image'
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
// import find_esp32s_serial from './find_esp32s_serial'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.session.on(
    'select-serial-port',
    (event, portList, webContents, callback) => {
      // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
      // is called.
      mainWindow.webContents.session.on('serial-port-added', (event, port) => {
        console.log('serial-port-added FIRED WITH', port)
        // Optionally update portList to add the new port
      })

      mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
        console.log('serial-port-removed FIRED WITH', port)
        // Optionally update portList to remove the port
      })

      console.log('select-serial-port FIRED WITH', portList)
      event.preventDefault()
      if (portList && portList.length > 0) {
        console.log('select-serial-port FIRED WITH', portList[0].portId)
        callback(portList[0].portId)
      } else {
        callback('') // Could not find any matching devices
      }
    }
  )

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      return true
      // if (permission === 'serial' && details.securityOrigin === 'file:///') {
      //   return true
      // }

      // return false
    }
  )

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    return true
    // if (details.deviceType === 'serial' && details.origin === 'file://') {
    //   return true
    // }
    // return false
  })

  ipcMain.on('select-fw-package', () => {
    // Define the options.
    let options = {
      title: 'My title',
      properties: ['openFile']
      //defaultPath: "/absolute/path/to/open/at"   // Optional.
    }

    // Show the open (folder) dialog.
    dialog.showOpenDialog(mainWindow, options).then((result) => {
      // Bail early if user cancelled dialog.
      if (result.canceled) {
        return
      }

      // Get the selected path.
      let path = result.filePaths[0]
      console.log(path)
      processCompressedFile(mainWindow, {
        filePath: path,
        options: { lazyEntries: false },
        index: 0,
        offset: 0,
        target: 'manifest'
      })
      // More processing...
    })
  })

  // seems to be broken atm
  // https://github.com/electron/electron/issues/36545
  // app.whenReady().then(() => {
  //   installExtension(REACT_DEVELOPER_TOOLS)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err))
  // })

  // find_esp32s_serial(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
