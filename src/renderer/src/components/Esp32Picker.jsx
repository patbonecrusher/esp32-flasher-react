import { useState, useEffect, useRef } from 'react'
import { useEsp32sScanner } from '../hooks/useEsp32Scanner'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

import Esp32 from './Esp32'

import { ESPLoader, Transport } from 'esptool-js'

// let Terminal // Terminal is imported in HTML script
// let CryptoJS // CryptoJS is imported in HTML script

// const term = new Terminal({ cols: 120, rows: 40 });
// term.open(terminal);

function Esp32Picker() {
  // const { esps, scanning, error, api } = useEsp32sScanner()
  const [files, setFiles] = useState([])
  const [vidpid, setVidPid] = useState(undefined)
  const esploaderRef = useRef(null)

  useEffect(() => {
    window.api.binFileUnzipped((event, value) => {
      console.log('binFileUnzipped', value)
      setFiles(value.partitions)
      // TODO FIRE UP THE FLASHING PROCESS
    })
  }, [])


  async function testIt() {
    const filters = [
      { usbVendorId: 0x2341, usbProductId: 0x0043 },
      { usbVendorId: 0x0403, usbProductId: 0x6010 },
      { usbVendorId: 0x10c4, usbProductId: 0xea60 },
      { usbVendorId: 0x1a86, usbProductId: 0x7523 }
    ]
    try {
      const port = await navigator.serial.requestPort({ filters })
      const portInfo = port.getInfo()
      console.log(JSON.stringify(portInfo, null, 2))
      setVidPid(portInfo)

      const transport = new Transport(port, true)
      const flashOptions = {
        transport,
        baudrate: parseInt("115200"),
        // terminal: espLoaderTerminal,
      };

      const esploader = new ESPLoader(flashOptions);
      esploaderRef.current = esploader

      const chip = await esploader.main_fn()
      console.log(chip);

    } catch (ex) {
      console.log(ex)
    }
  }

  const selectFirmware = async () => {
    setFiles([])
    window.api.selectFwPackage()
  }

  const eraseFlash = async () => {
    console.log('erasing flash')
    const esploader = esploaderRef.current
    if (esploader) {
      const chip = await esploader.erase_flash()
      console.log(chip);
    }
  }

  const programFlash = async () => {
    console.log('programming flash')

    const fileArray = []
    const progressBars = []

    files.map((file) => {
      fileArray.push({data: file.data.toString('binary'), address: file.flashaddress})
      progressBars.push(0)
    })
    const esploader = esploaderRef.current

    try {
      const flashOptions = {
        fileArray: fileArray,
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          console.log((written / total) * 100)
        },
        //calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      };
      await esploader.write_flash(flashOptions);
    } catch (e) {
      console.error(e);

    } finally {
      // Hide progress bars and show erase buttons
      // for (let index = 1; index < table.rows.length; index++) {
      //   table.rows[index].cells[2].style.display = "none";
      //   table.rows[index].cells[3].style.display = "initial";
      // }
    }

  }

  // useEffect(() => {
  //   console.log(esps)
  // }, [esps])

  return (
    <div className="esp32-picker">
      <Button onClick={testIt}>Scans for esps</Button>
      <Button onClick={selectFirmware}>Select Firmware</Button>
      <Button onClick={eraseFlash}>Erase Flash</Button>
      <Button onClick={programFlash}>Program Flash</Button>

      <p>ESP32 Picker</p>
      {vidpid && (
        <>
        <div>{vidpid?.usbProductId?.toString(16)}</div>
        <div>{vidpid?.usbVendorId?.toString(16)}</div>
        </>
      )}

      {files.map((file) => (
        <div key={file.filename}>{file.filename}</div>
      ))}

      <div id="terminal"></div>
    </div>
  )
}

export default Esp32Picker
