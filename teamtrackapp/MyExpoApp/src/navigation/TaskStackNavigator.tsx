// src/navigation/TaskStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screens } from '../constants/screens';
import { RootStackParamList } from './types';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const TaskStackNavigator = () => {
    console.log('Rendering TaskStackNavigator - initial route should be Tasks');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Stack.Navigator initialRouteName={Screens.Tasks}>
      <Stack.Screen
        name={Screens.Tasks}
        component={TaskListScreen}
        options={{
          title: 'My Tasks',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(Screens.CreateTask)}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name={Screens.CreateTask}
        component={CreateTaskScreen}
        options={{ title: 'Create Task' }}
      />
    </Stack.Navigator>
  );
};

export default TaskStackNavigator;
