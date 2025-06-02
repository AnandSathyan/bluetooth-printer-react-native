import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from './src/hooks/hooks';
import { submitCheckout } from './src/store/checkout/checkoutSlice';
// import { Wallet, CreditCard, BadgeCheck } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

export default function SamplePrintScreen() {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const getUserDetails = useAppSelector((state) => state.getUserDetails);
  const customer = getUserDetails?.userData?.Result?.[0];
  const checkoutResponse = useAppSelector((state) => state.checkout.response);

  const calculateItemTotal = (item) => {
    const basePrice = parseFloat(item.Price?.toString() || '0') * 1;
    if (isNaN(basePrice)) return 0;

    const crustOptionsTotal =
      item.crustOptions?.reduce((total, option) => {
        const optionPrice = parseFloat(option.price);
        return isNaN(optionPrice) ? total : total;
      }, 0) || 0;

    return basePrice + crustOptionsTotal;
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const bluetoothPrintReceipt = async () => {
    try {
      const columnWidths = [8, 24, 16];
      const packagingFee = 0.0;
      const deliveryFee = 0.0;
  
      // ✅ Print logo from URL, base64, center aligned
      // const getBase64FromUrl = async (imageUrl) => {
      //   const response = await fetch(imageUrl);
      //   const blob = await response.blob();
      //   return new Promise((resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       const base64 = reader.result.split(',')[1]; // Remove `data:image/...;base64,`
      //       resolve(base64);
      //     };
      //     reader.onerror = reject;
      //     reader.readAsDataURL(blob);
      //   });
      // };
  
      // ✅ Print logo
      // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      // const logoUrl = 'https://www.pegasustech.net/image/catalog/pegasus-logob.png';
      // try {
      //   const base64Logo = await getBase64FromUrl(logoUrl);
      //   await BluetoothEscposPrinter.printPic(base64Logo, {
      //     width: 575,
      //     left: 0,
      //   });
      // } catch (err) {
      //   console.error('Logo print failed:', err);
      // }
  
      // ✅ Business name
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText("Pegasus Restaurant\n\r", {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 2,
        heigthtimes: 2,
        fonttype: 1,
      });
  
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Fresh & Healthy Food'],
        {}
      );
  
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [new Date().toLocaleString()],
        {}
      );
  
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [`Order #: ${checkoutResponse?.InvoiceNo || 'N/A'}`],
        {}
      );
  
      await BluetoothEscposPrinter.printText('================================================', {});
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Customer', customer?.CustomerName || 'Walk-in'],
        {}
      );
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Mobile', customer?.mobileno || '-'],
        {}
      );
  
      await BluetoothEscposPrinter.printText('================================================', {});
  
      await BluetoothEscposPrinter.printText('Products\r\n', {});
      await BluetoothEscposPrinter.printText('------------------------------------------------\n\r', {});
  
      for (const item of cartItems) {
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${item.quantity}x`,
            item.ItemName || item.name,
            `${calculateItemTotal(item).toFixed(3)} KWD`,
          ],
          {}
        );
  
        if (item.crustOptions?.length > 0) {
          for (const option of item.crustOptions) {
            await BluetoothEscposPrinter.printColumn(
              [8, 32, 8],
              [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT,
              ],
              [
                '',
                `+ ${option.name}`,
                `${parseFloat(option.price).toFixed(3)} KWD`,
              ],
              {}
            );
          }
        }
      }
  
      await BluetoothEscposPrinter.printText('================================================', {});
  
      const subtotal = totalPrice.toFixed(3);
      const total = (totalPrice + packagingFee + deliveryFee).toFixed(3);
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Subtotal', `${subtotal} KWD`],
        {}
      );
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Packaging', `${packagingFee.toFixed(3)} KWD`],
        {}
      );
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Delivery', `${deliveryFee.toFixed(3)} KWD`],
        {}
      );
  
      await BluetoothEscposPrinter.printText('================================================', {});
  
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Total', `${total} KWD`],
        { widthtimes: 2 }
      );
  
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
  
      // ✅ QR Code
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      const qrData = checkoutResponse?.InvoiceNo || 'PEGASUS-ORDER';
      await BluetoothEscposPrinter.printQRCode(
        qrData,
        280,
        BluetoothEscposPrinter.ERROR_CORRECTION.L
      );
  
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [qrData],
        { widthtimes: 1 }
      );
  
      await BluetoothEscposPrinter.printText('================================================', {});
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [new Date().toLocaleString()],
        {}
      );
      await BluetoothEscposPrinter.printText('================================================', {});
  
      // ✅ Add some space at bottom and cut
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', {});
      await BluetoothEscposPrinter.printText('\x1D\x56\x00', {}); // Paper cut command
  
    } catch (error) {
      console.error('Bluetooth Print Error:', error);
      Alert.alert(
        'Printing failed',
        'Please check the printer connection.',
        [
          {
            text: 'Go to Printer Settings',
            onPress: () => navigation.navigate('PrinterSettings'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };
  
  

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
        console.log(detailData,"detailData");
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
                Date: new Date(Date.now()).toISOString().split("T")[0],
                TableNo: 0,
                TableName: '',
                TableLocationID: 0,
                ActiveStatus: "1",
              },
            },
          ])
        );
        await bluetoothPrintReceipt();
        navigation.navigate('/Payment/complete');
      } catch (error) {
        console.error('Checkout failed:', error);
        navigation.navigate('/Payment/Failed');
      }
    } else {
      navigation.navigate('/Payment/Failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Please select a payment type</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.paymentButton, selectedPayment === 'cash' && styles.selected]}
          onPress={() => handlePaymentMethod('cash')}
        >
          {/* <Wallet size={36} color="#4B5563" /> */}
          <Text style={styles.label}>Cash</Text>
          {/* {selectedPayment === 'cash' && <BadgeCheck size={20} color="#4B5563" style={styles.badge} />} */}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, selectedPayment === 'card' && styles.selected]}
          onPress={() => handlePaymentMethod('card')}
        >
          {/* <CreditCard size={36} color="#4B5563" /> */}
          <Text style={styles.label}>Card</Text>
          {/* {selectedPayment === 'card' && <BadgeCheck size={20} color="#4B5563" style={styles.badge} />} */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  paymentButton: {
    width: 130,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  selected: {
    backgroundColor: '#F3F4F6',
    borderColor: '#4B5563',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});