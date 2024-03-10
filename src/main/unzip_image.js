// import { app } from 'electron'
const yauzl = require('yauzl')
const csv = require('csv-parser')
import { buffer } from 'node:stream/consumers'
const { Readable } = require('stream') // Native Node Module

function bufferToStream(myBuffer) {
  let tmp = new Readable()
  tmp.push(myBuffer)
  tmp.push(null)
  return tmp
}

const unzip_file_in_memory = async (zip_file, zip_entry) => {
  return new Promise((resolve) => {
    zip_file.openReadStream(zip_entry, async (err, readStream) => {
      const data = {
        name: zip_entry.fileName,
        buffer: await buffer(readStream)
      }
      resolve(data)
    })
  })
}

const unzip_in_memory = async (filepath) => {
  return new Promise((resolve) => {
    yauzl.open(filepath, { lazyEntries: true, autoClose: false }, (err, zipfile) => {
      if (err) throw err

      const unzipped_files = []

      zipfile.readEntry()
      zipfile.on('entry', async (entry) => {
        unzipped_files.push(await unzip_file_in_memory(zipfile, entry))
        zipfile.readEntry()
      })

      zipfile.once('end', () => {
        zipfile.close()
        resolve(unzipped_files)
      })
    })
  })
}

const process_unzipped_content = async (unzipped_files) => {
  return new Promise((resolve) => {
    const manifest = unzipped_files.find((file) => file.name === 'manifest')
    if (!manifest) {
      console.log('No manifest file found')
      return undefined
    }

    const bin_images_info = []
    bufferToStream(manifest.buffer).pipe(csv())
      .on('data', (row) => {
        const bin_entry = unzipped_files.find((file) => file.name === row.filename)
        bin_images_info.push({
          ...row,
          data: bin_entry.buffer
        })
      })
      .on('end', () => {
        resolve(bin_images_info)
      })
  })
}

const extract_bin_partitions = async (zip_file_path) => {
  const unzipped_files = await unzip_in_memory(zip_file_path)
  return process_unzipped_content(unzipped_files)
}

export default extract_bin_partitions
// ;(async function () {
//   const bin_partitions = await extract_bin_partitions(
//     '/Users/pat/Projects/appliedlogix/hcl/repos/moscow-firmware/StatTemp-Moscow-2.7.1-LOCAL.zip'
//   )
//   console.log(bin_partitions)
//   console.log('Unzip image loaded')
//   return bin_partitions
// })()
