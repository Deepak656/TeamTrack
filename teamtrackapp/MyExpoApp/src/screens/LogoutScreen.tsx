import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ navigation }: any) => {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (err) {
        Alert.alert('Error', 'Something went wrong during logout.');
      }
    };

    logout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
});
