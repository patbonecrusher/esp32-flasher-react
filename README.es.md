# esp32-flasher-react

Una aplicación Electron con React

## Configuración IDE Recomendada

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Configuración del Proyecto

### Instalación

```bash
$ npm install
```

### Desarrollo

```bash
$ npm run dev
```

### Compilación

```bash
# Para Windows
$ npm run build:win

# Para macOS
$ npm run build:mac

# Para Linux
$ npm run build:linux
```

## Estado

- Puede seleccionar un dispositivo utilizando web serial

- Puede seleccionar un archivo zip específico que contenga

  - una lista de archivos bin (bootloader, firmware, ...)
  - un archivo de manifiesto
    con una entrada para cada bin que se programará, donde cada línea contiene
    - filename.bin, suma md5 del archivo, dirección de inicio para flash

  ```
  filename,md5sum,flashaddress
   2   │ bootloader.bin,f79159710623759322cd66dfb1f2b46d,0x1000
   3   │ partition-table.bin,39212d060bade6d243ee03b855af4ebf,0x8000
   4   │ ota_data_initial.bin,84d04c9d6cc8ef35bf825d51a5277699,0xd000
   5   │ firmware.bin,,0x10000
  ```

  El archivo zip se descomprime, y los bits se transmiten de vuelta al espacio de la UI, lo que nos permitirá usar la capa esptool js para flashear el dispositivo.