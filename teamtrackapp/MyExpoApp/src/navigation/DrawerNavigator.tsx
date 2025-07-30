import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskStackNavigator from './TaskStackNavigator';
import EmployeeStackNavigator from './EmployeeStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import LogoutScreen from '../screens/LogoutScreen';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'slide', // this gives modern slide drawer
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="Tasks"
        component={TaskStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Employees"
        component={EmployeeStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
