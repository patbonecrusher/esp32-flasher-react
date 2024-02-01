import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  findEsp32sSerial: () => ipcRenderer.send('find-esp32s-serial'),
  esp32sFound: (callback) => ipcRenderer.on('esp32s-serial-found', callback),
  removeEspsFoundListener: () => ipcRenderer.removeAllListeners('esps-found'),
  selectFwPackage: () => ipcRenderer.send('select-fw-package'),
  binFileUnzipped: (callback) => ipcRenderer.on('bin-file-unzipped', callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
