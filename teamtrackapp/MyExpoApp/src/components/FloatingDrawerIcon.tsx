// components/FloatingDrawerIcon.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const FloatingDrawerIcon = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.iconContainer}
    >
      <Ionicons name="menu-outline" size={28} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 24,
    elevation: 5,
  },
});

export default FloatingDrawerIcon;
