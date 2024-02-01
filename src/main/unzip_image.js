import { app } from 'electron'
import fs from 'fs'
import path from 'path'
const yauzl = require('yauzl')
const csv = require('csv-parser')

function processPartitionsFile (mainWindow, zipParams, path) {
  // Process partitions
  fs.createReadStream(path)
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row)
      processCompressedFile(mainWindow, {
        filePath: zipParams.filePath,
        options: { lazyEntries: false },
        index: row.id,
        offset: row.flashaddress,
        target: row.filename
      })
    })
    .on('end', () => {
      console.log('Partitions CSV file successfully processed.')
    })
}

function saveFile (mainWindow, zipParams, fileName, readStream) {
  const uploadDir = path.join(app.getPath('userData'), '/firmware/')
  console.log(uploadDir)
  // create folder if not existed!
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const dest = path.join(uploadDir, fileName)
  const file = fs.createWriteStream(dest)

  readStream.pipe(file)
  readStream.on('end', async () => {
    if (fileName === 'manifest') {
      processPartitionsFile(mainWindow, zipParams, dest)
      console.log('manifest file successfully processed.')
    } else {
      console.log('File saved.')
      const buf = await fs.readFileSync(dest)
      mainWindow.webContents.send('bin-file-unzipped', {
        idx: parseInt(zipParams.index),
        offset: zipParams.offset,
        filename: fileName,
        dest,
        buf
      })
    }
  })
}

export default function processCompressedFile(mainWindow, zipParams) {
  yauzl.open(zipParams.filePath, zipParams.options, (err, zipFile) => {
    if (err) throw err

    zipFile.on('error', (err) => {
      throw err
    })

    zipFile.on('entry', (entry) => {
      // console.log('File:', entry.fileName)
      zipFile.openReadStream(entry, (err, readStream) => {
        if (err) throw err

        if (zipParams.target === entry.fileName) {
          saveFile(mainWindow, zipParams, entry.fileName, readStream)
        }
      })
    })
  })
}
