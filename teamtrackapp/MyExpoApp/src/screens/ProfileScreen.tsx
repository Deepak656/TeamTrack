// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingDrawerIcon from '../components/FloatingDrawerIcon';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
            <FloatingDrawerIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
});

export default ProfileScreen;
