import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

type Props = {
  children: ReactNode;
};

const WithDrawerButtonLayout = ({ children }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {children}

      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.drawerButton}
      >
        <Ionicons name="menu" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default WithDrawerButtonLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    zIndex: 1000,
  },
});
