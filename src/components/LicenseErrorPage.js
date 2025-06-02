// src/components/LicenseErrorPage.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

// interface LicenseErrorPageProps {
//   errorType: 'expired' | 'userLimit';
//   maxDevices?: string;
//   expiryDate?: string;
// }

export default function LicenseErrorPage({
  errorType,
  maxDevices,
  expiryDate,
}) {
  const isExpired = errorType === 'expired';

  const handleReload = () => {
    // TODO: Add retry logic or re-dispatch license check
  };

  const handleContactSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.card}>
        <Animated.View entering={FadeIn.delay(200)} style={styles.iconContainer}>
          <Icon name="alert-triangle" size={48} color="#DC2626" />
        </Animated.View>

        <Text style={styles.title}>
          {isExpired ? 'License Expired' : 'User Limit Exceeded'}
        </Text>

        <Text style={styles.subtitle}>
          {isExpired
            ? `Your license expired on ${expiryDate ?? 'an unknown date'}. Please renew to continue.`
            : `The maximum number of concurrent users (${maxDevices ?? '?'}) has been reached.`}
        </Text>

        <View style={styles.statusRow}>
          <Icon
            name={isExpired ? 'clock' : 'users'}
            size={20}
            color="#DC2626"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.statusText}>
            {isExpired ? 'License Expired' : 'Maximum Users Reached'}
          </Text>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleReload}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={handleContactSupport}>
            <Icon
              name="phone-call"
              size={16}
              color="#1F2937"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.outlineButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          If this issue persists, please contact your system administrator or Pegasus support.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#E4002B',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
