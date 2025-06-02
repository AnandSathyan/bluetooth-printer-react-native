import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {submitCheckout} from '../../store/checkout/checkoutSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PaymentScreen() {
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card'>('card');
  const cartItems = useAppSelector(state => state.cart.items);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const getUserDetails = useAppSelector(state => state.getUserDetails);
  const customer = getUserDetails?.userData?.Result?.[0];
  const checkoutResponse = useAppSelector(state => state.checkout.response);

  const calculateItemTotal = (item) => {
    const basePrice = parseFloat(item.Price?.toString() || '0') * (item.quantity || 1);
    if (isNaN(basePrice)) return 0;
    const crustOptionsTotal =
      item.crustOptions?.reduce((total, option) => {
        const optionPrice = parseFloat(option.price);
        return isNaN(optionPrice) ? total : total + optionPrice;
      }, 0) || 0;
    return basePrice + crustOptionsTotal;
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0,
  );

  const handlePaymentMethod = async (value) => {
    setSelectedPayment(value);

    if (value === 'cash') {
      const detailData = cartItems.map((item) => ({
        ID: item.id,
        InvNo: '',
        ItemID: item.id,
        UnitID: item.id,
        Qty: item.quantity.toString(),
        ReturnQty: '0',
        UnitPrice: item.unitPrice,
        UnitCost: item.unitPrice,
        RefundAmt: '0.00',
        DiscountPercentage: item.discount?.toString() || '0',
        DiscountAmt: item.discount?.toString() || '0',
        TaxAmount: '0',
      }));

      try {
        await dispatch(
          submitCheckout([
            {
              Param: 'Insert',
              SalesDetail: {
                RegistrationNo: 3118,
                ID: '1',
                CompanyID: '1',
                BrandID: '1',
                BranchID: '1',
                InvNo: '',
                CostInv: 1.0,
                Tender: '1.00',
                PaidAmount: totalPrice.toFixed(2),
                DiscountID: '1',
                Discount: '0.00',
                Gtotal: totalPrice.toFixed(2),
                TotalTax: '0.00',
                NetAmount: totalPrice.toFixed(2),
                RefundAmt: '0.00',
                Address: customer?.Address,
                Mobile: customer?.mobileno,
                WaiterCommission: '0.00',
                WaiterCommiPersent: '0.00',
                TItemTax: '0.00',
                DetailData: detailData,
                Date: '',
                TableNo: 0,
                TableName: '',
                TableLocationID: 0,
              },
            },
          ]),
        );
        Alert.alert('Success', 'Order Placed Successfully!');
        navigation.navigate('PaymentComplete');
      } catch (error) {
        Alert.alert('Error', 'Checkout failed');
        navigation.navigate('PaymentFailed');
      }
    } else {
      navigation.navigate('PaymentFailed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Please select a payment type</Text>

      {/* Payment Options */}
      <View style={styles.paymentOptions}>
        {['cash', 'card'].map(method => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentBox,
              selectedPayment === method && styles.selectedBox,
            ]}
            onPress={() => handlePaymentMethod(method)}>
            <Icon
              name={method === 'cash' ? 'cash' : 'credit-card-outline'}
              size={36}
              color="#333"
              style={{marginBottom: 10}}
            />
            <Text style={styles.paymentText}>
              {method === 'cash' ? 'Cash' : 'Credit Card'}
            </Text>
            {selectedPayment === method && (
              <Icon
                name="check-decagram"
                size={20}
                color="#4B5563"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedPayment === 'card' && (
        <Text style={styles.instruction}>Please tap, insert or swipe your card</Text>
      )}

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        {cartItems.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <View>
              <Text style={styles.itemName}>
                {item.quantity}x {item.ItemName || item.name}
              </Text>
              {item.crustOptions?.length > 0 && (
                <View style={{marginLeft: 10}}>
                  {item.crustOptions.map((option, idx) => (
                    <Text key={idx} style={styles.crustOption}>
                      + {option.name} - {parseFloat(option.price).toFixed(3)} KWD
                    </Text>
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.itemPrice}>
              {calculateItemTotal(item).toFixed(3)} KWD
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>KWD {totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentBox: {
    width: '45%',
    height: 140,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  selectedBox: {
    borderColor: '#333',
    backgroundColor: '#F3F4F6',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    color: '#444',
  },
  crustOption: {
    fontSize: 13,
    color: '#777',
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
});
