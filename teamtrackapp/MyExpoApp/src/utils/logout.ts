// src/utils/logout.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (navigation: any) => {
  await AsyncStorage.removeItem('token');
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
};
