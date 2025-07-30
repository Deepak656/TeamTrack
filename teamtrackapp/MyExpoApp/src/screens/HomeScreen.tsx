// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screens } from '../constants/screens';

const HomeScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TeamTrack 👋</Text>
      <Button title="My Tasks" onPress={() => navigation.navigate(Screens.Tasks)}/>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default HomeScreen;
