import { useState, useEffect } from 'react'
import { useEsp32sScanner } from '../hooks/useEsp32Scanner'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

import Esp32 from './Esp32'

function Esp32Picker() {
  const { esps, scanning, error, api } = useEsp32sScanner()

  useEffect(() => {
    window.api.binFileUnzipped((event, value) => {
      console.log('binFileUnzipped', JSON.stringify(value, null, 2))
      // TODO FIRE UP THE FLASHING PROCESS
    })
  }, [])

  async function testIt() {
    const filters = [
      { usbVendorId: 0x2341, usbProductId: 0x0043 },
      { usbVendorId: 0x0403, usbProductId: 0x6010 },
      { usbVendorId: 0x10c4, usbProductId: 0xea60 }
    ]
    try {
      const port = await navigator.serial.requestPort({ filters })
      const portInfo = port.getInfo()
      console.log(JSON.stringify(portInfo, null, 2))
      document.getElementById('device-name').innerHTML =
        `vendorId: ${portInfo.usbVendorId} | productId: ${portInfo.usbProductId}`
    } catch (ex) {
      if (ex.name === 'NotFoundError') {
        document.getElementById('device-name').innerHTML = 'Device NOT found'
      } else {
        document.getElementById('device-name').innerHTML = ex
      }
    }
  }

  const selectFirmware = async () => {
    window.api.selectFwPackage()
  }

  useEffect(() => {
    console.log(esps)
  }, [esps])

  return (
    <div className="esp32-picker">
      <Button onClick={testIt}>Scans for esps</Button>
      <Button onClick={selectFirmware}>Select Firmware</Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={scanning}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <p>ESP32 Picker</p>
      {esps && esps.map((entry) => <Esp32 esp={entry} key={entry.port} api={api} />)}
    </div>
  )
}

export default Esp32Picker
