interface Navigator {
    bluetooth: {
      requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }
  
  interface BluetoothRequestDeviceOptions {
    acceptAllDevices?: boolean;
    filters?: BluetoothLEScanFilter[];
    optionalServices?: BluetoothServiceUUID[];
  }