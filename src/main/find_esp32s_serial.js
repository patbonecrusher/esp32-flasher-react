// import { ipcMain } from 'electron'
// import { SerialPort } from 'serialport'

// export default function find_esp32s_serial(win) {
//   const getDataFromApi = async () => {
//     try {
//       const found_devices = await SerialPort.list()
//       console.log(found_devices)
//       return found_devices
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   ipcMain.on('find-esp32s-serial', async () => {
//     const devices = await getDataFromApi()
//     console.log(devices)
//     win.webContents.send('esp32s-serial-found', devices)
//   })
// }
