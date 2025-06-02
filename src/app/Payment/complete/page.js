import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle } from 'lucide-react-native'; // Make sure to install this

export default function OrderCompleted() {
  const navigation = useNavigation();
  const checkoutResponse = useSelector((state) => state.checkout.response);

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconWrapper}>
        <CheckCircle size={64} color="#16A34A" />
      </View>

      {/* Success Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.title}>Order Completed!</Text>
        <Text style={styles.subtitle}>
          You can pick up your order from the cash register
        </Text>
      </View>

      {/* Order Number Display */}
      <View style={styles.orderCard}>
        <Text style={styles.orderLabel}>Your Order Number</Text>
        <Text style={styles.orderNumber}>{checkoutResponse?.InvoiceNo || 'N/A'}</Text>
      </View>

      {/* New Order Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')} // Update 'Home' to your actual screen name
        style={styles.button}
      >
        <Text style={styles.buttonText}>New Order</Text>
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
    backgroundColor: '#D1FAE5',
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
    color: '#065F46',
  },
  subtitle: {
    fontSize: 14,
    color: '#16A34A',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#6EE7B7',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    maxWidth: 320,
  },
  orderLabel: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065F46',
  },
  button: {
    backgroundColor: '#047857',
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
