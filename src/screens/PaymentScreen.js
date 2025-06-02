import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
} from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ItemList from '../../ItemList';
import SamplePrint from '../../SamplePrint';
import { styles } from '../../styles';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const navigation = useNavigation();

  const deviceAlreadPaired = useCallback((rsp) => {
    let devices = [];
    try {
      devices = typeof rsp.devices === 'string' ? JSON.parse(rsp.devices) : rsp.devices;
    } catch (e) {
      return;
    }

    if (devices?.length) {
      setPairedDevices(prev => {
        const existingAddresses = prev.map(d => d.address);
        const newDevices = devices.filter(d => !existingAddresses.includes(d.address));
        return [...prev, ...newDevices];
      });
    }
  }, []);

  const deviceFoundEvent = useCallback((rsp) => {
    let device = null;
    try {
      device = typeof rsp.device === 'string' ? JSON.parse(rsp.device) : rsp.device;
    } catch (e) {
      return;
    }

    if (device) {
      setFoundDs(prev => {
        if (prev.find(d => d.address === device.address)) return prev;
        return [...prev, device];
      });
    }
  }, []);

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      res => {
        let found = [];
        try {
          found = typeof res.found === 'string' ? JSON.parse(res.found) : res.found;
        } catch (e) {}

        if (found?.length) {
          setFoundDs(found);
        }
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, []);

  const scan = useCallback(() => {
    const requestBluetoothPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED)) {
          scanDevices();
        } else {
          ToastAndroid.show('Bluetooth permissions denied', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    requestBluetoothPermissions();
  }, [scanDevices]);

  const connect = (device) => {
    setLoading(true);
    BluetoothManager.connect(device.address).then(
      () => {
        setBoundAddress(device.address);
        setName(device.name || 'UNKNOWN');
        setLoading(false);
        navigation.navigate('Payment')
      },
      (e) => {
        alert(e);
        setLoading(false);
      },
    );
  };

  const unPair = (address) => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      () => {
        setBoundAddress('');
        setName('');
        setLoading(false);
      },
      (e) => {
        alert(e);
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => setBleOpend(Boolean(enabled)),
      () => setBleOpend(false),
    ).finally(() => setLoading(false));

    const emitter = Platform.OS === 'ios' ? new NativeEventEmitter(BluetoothManager) : DeviceEventEmitter;

    const pairedListener = emitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, deviceAlreadPaired);
    const foundListener = emitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, deviceFoundEvent);
    const lostListener = emitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
      setName('');
      setBoundAddress('');
    });

    let notSupportListener;
    if (Platform.OS === 'android') {
      notSupportListener = emitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
        ToastAndroid.show('Device does not support Bluetooth!', ToastAndroid.LONG);
      });
    }

    scan();

    return () => {
      pairedListener.remove();
      foundListener.remove();
      lostListener.remove();
      notSupportListener?.remove();
    };
  }, [deviceAlreadPaired, deviceFoundEvent, scan]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bluetoothStatusContainer}>
        <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
          Bluetooth {bleOpend ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {!bleOpend && (
        <Text style={styles.bluetoothInfo}>Please enable your Bluetooth</Text>
      )}

      <Text style={styles.sectionTitle}>Printer connected to the app:</Text>
      {boundAddress ? (
        <ItemList
          label={name}
          value={boundAddress}
          onPress={() => unPair(boundAddress)}
          actionText="Disconnect"
          color="#E9493F"
        />
      ) : (
        <Text style={styles.printerInfo}>No printer connected</Text>
      )}

      <Text style={styles.sectionTitle}>Bluetooth devices paired with this phone:</Text>
      {loading && <ActivityIndicator animating={true} />}
      <View style={styles.containerList}>
        {pairedDevices.map((item, index) => (
          <ItemList
            key={index}
            onPress={() => connect(item)}
            label={item.name}
            value={item.address}
            connected={item.address === boundAddress}
            actionText="Connect"
            color="#00BCD4"
          />
        ))}
      </View>

      <Button onPress={scan} title="Scan Bluetooth" />
      <View style={{ height: 100 }} />
      {/* <SamplePrint /> */}
    </ScrollView>
  );
};

export default PaymentScreen;
