import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
      await AsyncStorage.setItem('token', res.data.token);
      Alert.alert('Login successful!');
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Login failed', 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await promptAsync();
    if (result?.type === 'success') {
      // After Google OAuth, backend must accept token in /oauth-success
      Alert.alert('Google login success!');
    } else {
      Alert.alert('Google login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TeamTrack Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleButton}>
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 6,
  },
  button: {
    backgroundColor: '#2e86de', padding: 14, borderRadius: 6, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  googleButton: {
    marginTop: 20, padding: 14, borderRadius: 6, backgroundColor: '#fff', borderWidth: 1,
    borderColor: '#ccc', alignItems: 'center'
  },
  googleText: { color: '#333' },
});

export default LoginScreen;

