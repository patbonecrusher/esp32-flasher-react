# esp32-flasher-react

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Status

- Can pick a device using web serial

- Can select a specific zip file containing

  - a list of bin file (bootloader, firmware, ...)
  - a manifest file
    with a line entry for each bin to be programmed where each line contains
    - filename.bin, md5 sum of the file, start address to flash

  ```
  filename,md5sum,flashaddress
   2   │ bootloader.bin,f79159710623759322cd66dfb1f2b46d,0x1000
   3   │ partition-table.bin,39212d060bade6d243ee03b855af4ebf,0x8000
   4   │ ota_data_initial.bin,84d04c9d6cc8ef35bf825d51a5277699,0xd000
   5   │ firmware.bin,,0x10000
  ```

  The zip file gets unzipped, and the bits streamed are streamed back up to the UI space which will allow us to use the esptool js layer to flash the device.
