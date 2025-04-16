import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

const SerialPortDialog = ({ open, onClose, portList }) => {
  const [selectedPort, setSelectedPort] = useState(null);

  // Reset selected port when dialog opens with new port list
  useEffect(() => {
    if (open && portList.length > 0) {
      setSelectedPort(portList[0]);
    } else {
      setSelectedPort(null);
    }
  }, [open, portList]);

  const handleSelectPort = () => {
    if (selectedPort) {
      window.api.selectSerialPort(selectedPort.portId);
      onClose();
    }
  };

  const getDeviceInfo = (port) => {
    console.log(port)
    const vendorId = port.vendorId ? `0x${port.vendorId.toString(16).padStart(4, '0')}` : 'N/A'
    const productId = port.productId ? `0x${port.productId.toString(16).padStart(4, '0')}` : 'N/A'
    const serialNumber = port.serialNumber ? `Serial: ${port.serialNumber}` : 'N/A'
    const portName = port.portName ? `Port Name: ${port.portName}` : 'N/A'
    return `VID:${vendorId} PID:${productId}, SN:${serialNumber}, Port Name: ${portName}`;
  }

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>Select Serial Device</DialogTitle>
      <DialogContent>
        {portList && portList.length > 0 ? (
          <List>
            {portList.map((port) => (
              <ListItem key={port.portId} disablePadding>
                <ListItemButton onClick={() => setSelectedPort(port)} dense>
                  <Radio
                    checked={selectedPort && selectedPort.portId === port.portId}
                    onChange={() => setSelectedPort(port)}
                  />
                  <ListItemText
                    primary={`Port: ${port.portName || port.portId}`}
                    secondary={getDeviceInfo(port)}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No serial devices found</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleSelectPort} disabled={!selectedPort} variant="contained" color="primary">
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SerialPortDialog;
