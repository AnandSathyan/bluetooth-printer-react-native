import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const LoginRegisterScreen = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
   const handleSubmit = () => {
    if (isRegistering) {
      // Registration logic
      if (!name || !email || !password) {
        Alert.alert('Please fill in all fields.');
        return;
      }
      Alert.alert('Registration Successful', `Welcome, ${name}!`);
    } else {
      // Login logic
      if (!email || !password) {
        Alert.alert('Please enter email and password.');
        return;
      }
      navigation.navigate('HomePage');

      Alert.alert('Login Successful',' Welcome back!');
    }

    // Reset fields
    setName('');
    setEmail('');
    setPassword('');
  };
  return (
    <View style={styles.container}>
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
      <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleSubmit} />
   
      <TouchableOpacity
        style={styles.switchMode}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={styles.switchText}>
          {isRegistering
            ? 'Already have an account? Login'
            : "Forgot Passsword?"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
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
  switchMode: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#007BFF',
  },
});
