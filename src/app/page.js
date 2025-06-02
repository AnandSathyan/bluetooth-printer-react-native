// src/app/Home.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks/hooks';
import { submitLicense } from '../store/license/licenseThunk';
import LicenseErrorPage from '../components/LicenseErrorPage';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [isUserLimitExceeded, setIsUserLimitExceeded] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [maxDevices, setMaxDevices] = useState('');

  const getLicense = useSelector((state) => state.licence); // Use appropriate types if available
  // const deviceInfo = useSelector((state) => state.deviceInfo); // optional use
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(submitLicense());
  }, []);

  useEffect(() => {
    if (getLicense.license && getLicense.license.length > 0) {
      const licenseData = getLicense.license[0]?.Result[0];

      if (licenseData) {
        const currentDate = new Date();
        const licenseExpiryDate = new Date(licenseData?.expiry_date);

        const valid = licenseExpiryDate > currentDate;
        const maxAllowedDevices = parseInt(licenseData?.att_device_count || '0', 10);
        const currentDeviceCount = parseInt(licenseData?.current_device_count || '0', 10);

        setIsLicenseValid(valid);
        setExpiryDate(licenseData?.expiry_date);
        setMaxDevices(licenseData?.att_device_count);

        const limitExceeded = currentDeviceCount > maxAllowedDevices;
        setIsUserLimitExceeded(limitExceeded);

        if (valid && !limitExceeded) {
          setTimeout(() => {
            navigation.replace("Login"); // Replace with your next screen
          }, 500);
        }
      }
    }
  }, [getLicense]);

  if (!getLicense.license) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isLicenseValid) {
    return <LicenseErrorPage errorType="expired" expiryDate={expiryDate} />;
  }

  if (isUserLimitExceeded) {
    return <LicenseErrorPage errorType="userLimit" maxDevices={maxDevices} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Home;
