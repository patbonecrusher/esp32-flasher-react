// import { useState, useEffect, useRef } from 'react'
// import { useEsp32sScanner } from '../hooks/useEsp32Scanner'

// import Backdrop from '@mui/material/Backdrop'
// import CircularProgress from '@mui/material/CircularProgress'
// import Button from '@mui/material/Button'
// import { Buffer } from 'buffer'

// import Esp32 from './Esp32'

// import { ESPLoader, Transport } from 'esptool-js'

// import { XTerm } from 'oas-xterm-for-react18'

// //const toBlack   = "\x1b[30m"
// const toRed     = "\x1b[31m"
// const toGreen   = "\x1b[32m"
// //const toYellow  = "\x1b[33m"
// const toBlue    = "\x1b[34m"
// //const toMagenta = "\x1b[35m"
// //const toCyan    = "\x1b[36m"
// //const toWhite   = "\x1b[37m"
// //const toDefault = "\x1b[0m"

// // let Terminal // Terminal is imported in HTML script
// // let CryptoJS // CryptoJS is imported in HTML script

// // const term = new Terminal({ cols: 120, rows: 40 });
// // term.open(terminal);

// function Esp32Picker() {
//   // const { esps, scanning, error, api } = useEsp32sScanner()
//   const [files, setFiles] = useState([])
//   const [vidpid, setVidPid] = useState(undefined)
//   const esploaderRef = useRef(null)
//   const xtermRef = useRef(null)
//   const encoder = useRef(new TextEncoder());

//   useEffect(() => {
//     window.api.binFileUnzipped((event, value) => {
//       console.log('binFileUnzipped', value)
//       setFiles(value.partitions)
//       xtermRef.current.terminal.writeln('Hello, World!\n')
//     })
//   }, [])

//   async function testIt() {
//     const filters = [
//       { usbVendorId: 0x2341, usbProductId: 0x0043 },
//       { usbVendorId: 0x0403, usbProductId: 0x6010 },
//       { usbVendorId: 0x10c4, usbProductId: 0xea60 },
//       { usbVendorId: 0x1a86, usbProductId: 0x7523 }
//     ]
//     try {
//       const port = await navigator.serial.requestPort({ filters })
//       const portInfo = port.getInfo()
//       console.log(JSON.stringify(portInfo, null, 2))
//       setVidPid(portInfo)

//       const transport = new Transport(port, true)
//       const flashOptions = {
//         transport,
//         baudrate: parseInt('460800')
//         // terminal: espLoaderTerminal,
//       }

//       //-p /dev/cu.usbserial-144140 -b 460800 --before=default_reset --after=hard_reset write_flash --flash_mode dio --flash_freq 40m --flash_size 8MB 0x1000 bootloader/bootloader.bin 0x10000 stattemp-moscow.bin 0x8000 partition_table/partition-table.bin 0xd000 ota_data_initial.bin

//       const esploader = new ESPLoader(flashOptions)
//       esploaderRef.current = esploader

//       const chip = await esploader.main_fn()
//       console.log(chip)
//     } catch (ex) {
//       console.log(ex)
//     }
//   }

//   const selectFirmware = async () => {
//     setFiles([])
//     xtermRef.current.terminal.writeln('Hello, World!\r\n')
//     xtermRef.current.terminal.writeln('Hello, World!\r\n')
//     xtermRef.current.terminal.writeln('Hello, World!\r\n')
//     xtermRef.current.terminal.writeln('Hello, World!\r\n')
//     xtermRef.current.terminal.writeln('Hello, World!\r\n')
//     //window.api.selectFwPackage()
//   }

//   const eraseFlash = async () => {
//     console.log('erasing flash')
//     const esploader = esploaderRef.current
//     if (esploader) {
//       const chip = await esploader.erase_flash()
//       console.log(chip)
//     }
//   }

//   function convertUint8_to_hexStr(buffer) {
//     Array.from(buffer)
//       .map((i) => i.toString(16).padStart(2, '0'))
//       .join('')
//   }

//   const programFlash = async () => {
//     console.log('programming flash')

//     const fileArray = []
//     const progressBars = []

//     files.map((file) => {
//       console.log(file.data)
//       //const bin_blob = textDecoder.decode(file.data)
//       const bin_blob = file.data.reduce((p, c) => p + String.fromCharCode(c), '')
//       //console.log(bin_blob)
//       console.log(bin_blob[0])
//       console.log(bin_blob[1])
//       console.log(bin_blob[2])
//       console.log(bin_blob[3])
//       console.log(bin_blob[0] === 0xe9)
//       console.log(file.flashaddress)
//       fileArray.push({ data: bin_blob, address: Number(file.flashaddress) })
//       progressBars.push(0)
//     })
//     const esploader = esploaderRef.current

//     try {
//       //-p /dev/cu.usbserial-144140 -b 460800 --before=default_reset --after=hard_reset write_flash --flash_mode dio --flash_freq 40m --flash_size 8MB 0x1000 bootloader/bootloader.bin 0x10000 stattemp-moscow.bin 0x8000 partition_table/partition-table.bin 0xd000 ota_data_initial.bin
//       const flashOptions = {
//         fileArray: fileArray,
//         flashMode: 'dio',
//         after: 'hard_reset',
//         flashFreq: '40m',
//         flashSize: '8MB',
//         eraseAll: false,
//         compress: true,
//         reportProgress: (fileIndex, written, total) => {
//           console.log((written / total) * 100)
//         }
//         //calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
//       }
//       await esploader.write_flash(flashOptions)
//     } catch (e) {
//       console.error(e)
//     } finally {
//       // Hide progress bars and show erase buttons
//       // for (let index = 1; index < table.rows.length; index++) {
//       //   table.rows[index].cells[2].style.display = "none";
//       //   table.rows[index].cells[3].style.display = "initial";
//       // }
//     }
//   }

//   // useEffect(() => {
//   //   console.log(esps)
//   // }, [esps])

//   return (
//     <div className="esp32-picker">
//       <Button onClick={testIt}>Scans for esps</Button>
//       <Button onClick={selectFirmware}>Select Firmware</Button>
//       <Button onClick={eraseFlash}>Erase Flash</Button>
//       <Button onClick={programFlash}>Program Flash</Button>

//       <p>ESP32 Picker</p>
//       {vidpid && (
//         <>
//           <div>{vidpid?.usbProductId?.toString(16)}</div>
//           <div>{vidpid?.usbVendorId?.toString(16)}</div>
//         </>
//       )}

//       {files.map((file) => (
//         <div key={file.filename}>{file.filename}</div>
//       ))}

//       <div width="100px" height="100px">
//       <XTerm width="100px" height="100px"
//         ref={xtermRef}
//         // options={{
//         //   theme: {
//         //     background: '#fdf6e3',
//         //     blue: '#3498db',
//         //     red: '#a40000',
//         //     green: '#19857b'
//         //   }
//         // }}
//         onData={(data) => {
//           // local echo
//           xtermRef.current.terminal.writeUtf8(encoder.current.encode(data))
//           console.log('from terminal:', data)
//         }}
//       />
//       </div>
//     </div>
//   )
// }

// export default Esp32Picker


import { useState, useEffect, useRef } from 'react'
import { useEsp32sScanner } from '../hooks/useEsp32Scanner'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { Buffer } from 'buffer'

import Esp32 from './Esp32'

import { ESPLoader, Transport } from 'esptool-js'

import { XTerm } from 'oas-xterm-for-react18'

//const toBlack   = "\x1b[30m"
const toRed     = "\x1b[31m"
const toGreen   = "\x1b[32m"
//const toYellow  = "\x1b[33m"
const toBlue    = "\x1b[34m"
//const toMagenta = "\x1b[35m"
//const toCyan    = "\x1b[36m"
//const toWhite   = "\x1b[37m"
//const toDefault = "\x1b[0m"

// let Terminal // Terminal is imported in HTML script
// let CryptoJS // CryptoJS is imported in HTML script

// const term = new Terminal({ cols: 120, rows: 40 });
// term.open(terminal);

const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
  { usbVendorId: 0x0403, usbProductId: 0x6010 },
  { usbVendorId: 0x10c4, usbProductId: 0xea60 },
  { usbVendorId: 0x1a86, usbProductId: 0x7523 }
]

function Esp32Picker() {
  // const { esps, scanning, error, api } = useEsp32sScanner()
  const [files, setFiles] = useState([])
  const [vidpid, setVidPid] = useState(undefined)
  const esploaderRef = useRef(null)
  const xtermRef = useRef(null)
  const encoder = useRef(new TextEncoder());
  const terminal = useRef(null)

  useEffect(() => {
    window.api.binFileUnzipped((event, value) => {
      console.log('binFileUnzipped', value)
      setFiles(value.partitions)
      //xtermRef.current.terminal.writeln('Hello, World!\n')
    })
    if (terminal.current === null) {
      terminal.current = new Terminal()
      terminal.current.open(document.getElementById('terminal'))
    }
}, [])

  async function testIt() {
    try {
      const port = await navigator.serial.requestPort({ filters })
      const portInfo = port.getInfo()
      console.log(JSON.stringify(portInfo, null, 2))
      setVidPid(portInfo)

      const transport = new Transport(port, true)
      const flashOptions = {
        transport,
        baudrate: parseInt('460800'),
        terminal: espLoaderTerminal(terminal.current),
        // terminal: espLoaderTerminal,
      }

      //-p /dev/cu.usbserial-144140 -b 460800 --before=default_reset --after=hard_reset write_flash --flash_mode dio --flash_freq 40m --flash_size 8MB 0x1000 bootloader/bootloader.bin 0x10000 stattemp-moscow.bin 0x8000 partition_table/partition-table.bin 0xd000 ota_data_initial.bin

      const esploader = new ESPLoader(flashOptions)
      esploaderRef.current = esploader

      const chip = await esploader.main_fn()
      console.log(chip)
    } catch (ex) {
      console.log(ex)
    }
  }

  const selectFirmware = async () => {
    setFiles([])
    terminal.current.write('Hello, World!\r\n')
    window.api.selectFwPackage()
  }

  const eraseFlash = async () => {
    console.log('erasing flash')
    const esploader = esploaderRef.current
    if (esploader) {
      const chip = await esploader.erase_flash()
      console.log(chip)
    }
  }

  const espLoaderTerminal = (term) => {
    return {
    clean() {
      console.log('clean')
      term.clear();
    },
    writeLine(data) {
      console.log(`writeline ${data}`)
      term.writeln(data);
    },
    write(data) {
      console.log(`write ${data}`)
      term.write(data);
    },
  }
};

  const showTerminal = async () => {
    const term = terminal.current
    const port = await navigator.serial.requestPort({ filters })
    const portInfo = port.getInfo()
    console.log(JSON.stringify(portInfo, null, 2))
    setVidPid(portInfo)

    const transport = new Transport(port)

    await transport.connect();

    while (true) {
      const val = await transport.rawRead();
      if (typeof val !== "undefined") {
        term.writeln(val);
      } else {
        break;
      }
    }
  }


  function convertUint8_to_hexStr(buffer) {
    Array.from(buffer)
      .map((i) => i.toString(16).padStart(2, '0'))
      .join('')
  }

  const programFlash = async () => {
    console.log('programming flash')

    const fileArray = []
    const progressBars = []

    files.map((file) => {
      console.log(file.data)
      //const bin_blob = textDecoder.decode(file.data)
      const bin_blob = file.data.reduce((p, c) => p + String.fromCharCode(c), '')
      //console.log(bin_blob)
      console.log(bin_blob[0])
      console.log(bin_blob[1])
      console.log(bin_blob[2])
      console.log(bin_blob[3])
      console.log(bin_blob[0] === 0xe9)
      console.log(file.flashaddress)
      fileArray.push({ data: bin_blob, address: Number(file.flashaddress) })
      progressBars.push(0)
    })
    const esploader = esploaderRef.current

    try {
      //-p /dev/cu.usbserial-144140 -b 460800 --before=default_reset --after=hard_reset write_flash --flash_mode dio --flash_freq 40m --flash_size 8MB 0x1000 bootloader/bootloader.bin 0x10000 stattemp-moscow.bin 0x8000 partition_table/partition-table.bin 0xd000 ota_data_initial.bin
      const flashOptions = {
        fileArray: fileArray,
        flashMode: 'dio',
        after: 'hard_reset',
        flashFreq: '40m',
        flashSize: '8MB',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          console.log((written / total) * 100)
        }
        //calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
      }
      await esploader.write_flash(flashOptions)



    } catch (e) {
      console.error(e)
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
      <Button onClick={showTerminal}>Show device terminal</Button>

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

    </div>
  )
}

export default Esp32Picker
