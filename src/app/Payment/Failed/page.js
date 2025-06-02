import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function PaymentFailed() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Failed Icon */}
      <View style={styles.iconWrapper}>
        {/* <XCircle size={64} color="#EF4444" /> */}
      </View>

      {/* Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>Please try again!</Text>
      </View>

      {/* Retry Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Payment')} // replace 'Payment' with your actual screen name
        style={styles.retryButton}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // Tailwind's gray-800
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280', // Tailwind's gray-600
    marginTop: 4,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
