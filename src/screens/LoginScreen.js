import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginRegisterScreen = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const handleSubmit = () => {
    if (isRegistering) {
      if (!name || !email || !password) {
        Alert.alert('Please fill in all fields.');
        return;
      }
      Alert.alert('Registration Successful', `Welcome, ${name}!`);
    } else {
      if (!email || !password) {
        Alert.alert('Please enter email and password.');
        return;
      }
      navigation.navigate('HomePage');
      Alert.alert('Login Successful', 'Welcome back!');
    }

    setName('');
    setEmail('');
    setPassword('');
    setRegistrationNumber('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { maxWidth: width > 600 ? 500 : '100%' }]}>
        <Text style={styles.header}>{isRegistering ? 'Register' : 'Login'}</Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Registration Number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleSubmit} />
        </View>

        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.switchText}>
            {isRegistering
              ? 'Already have an account? Login'
              : 'Forgot Password?'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginRegisterScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
  },
  container: {
    alignSelf: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
    width: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  switchMode: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#007BFF',
  },
});
