import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { auth } from '../firebase'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validate login credentials
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // Sign in the user with email and password
      const user = await auth.signInWithEmailAndPassword(email, password);

      // Redirect to the home screen
      navigation.navigate('SetHome');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again later.');
    }
  };

  const handleSignup = async () => {
    // Validate signup credentials
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      // Create a new user with email and password
      const user = await auth.createUserWithEmailAndPassword(email, password);
      console.log(user)
      // Redirect to the home screen
      navigation.navigate('SetHome');

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred during signup. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={email === '' || password === ''}
      >
        Login
      </Button>
      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '80%',
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default LoginScreen;