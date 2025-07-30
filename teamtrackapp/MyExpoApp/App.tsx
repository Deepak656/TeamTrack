import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import AddEmployeeScreen from './src/screens/AddEmployeeScreen';
import ListEmployeeScreen from './src/screens/ListEmployeeScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EmployeeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListEmployees" component={ListEmployeeScreen} options={{ title: 'Employees' }} />
      <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} options={{ title: 'Add Member' }} />
    </Stack.Navigator>
  );
}

function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Create Task' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Detail' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Tasks" component={TaskStack} options={{ headerShown: false }} />
        <Tab.Screen name="Employees" component={EmployeeStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
