import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddEmployeeScreen from '../screens/AddEmployeeScreen';
import ListEmployeeScreen from '../screens/ListEmployeeScreen';
import { Screens } from '../constants/screens';

const Stack = createNativeStackNavigator();

const EmployeeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.ListEmployees}
        component={ListEmployeeScreen}
        options={{ title: 'Employees' }}
      />
      <Stack.Screen
        name={Screens.AddEmployee}
        component={AddEmployeeScreen}
        options={{ title: 'Add Member' }}
      />
    </Stack.Navigator>
  );
};

export default EmployeeStackNavigator;
