import { useState, useEffect } from 'react'

export const useEsp32sScanner = () => {
  const [error, setError] = useState(undefined)
  const [scanning, setScanning] = useState(false)
  const [esps, setEsps] = useState([])

  useEffect(() => {
    console.log('useEffect')

    window.api.esp32sFound((event, value) => {
      console.log('fooa', value)
      setEsps(value)
      setScanning(false)
    })
    return function cleanup() {
      window.api.removeEspsFoundListener()
    }
  }, [])

  const scanForEsps = () => {
    console.log('scanForEsps')
    setScanning(true)
    window.api.findEsp32sSerial()
  }

  return {
    error,
    scanning,
    esps,
    clearError: () => setError(undefined),
    api: {
      scanForEsps
    }
  }
}
