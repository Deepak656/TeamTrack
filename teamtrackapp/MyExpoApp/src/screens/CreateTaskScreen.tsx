import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../constants/screens';
import FloatingDrawerIcon from '../components/FloatingDrawerIcon';

const CreateTaskScreen = ({ navigation }: any) => {
  const [description, setDescription] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [employeeList, setEmployeeList] = useState<{ label: string; value: string }[]>([]);
  const [locationRequired, setLocationRequired] = useState(false);
  const [selfieRequired, setSelfieRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/employees/active-dropdown', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const options = res.data.map((emp: any) => ({
        label: `${emp.firstName} ${emp.lastName} (${emp.email})`,
        value: emp.email,
      }));
      setEmployeeList(options);
    } catch (err) {
      console.error('Failed to load employees', err);
      Alert.alert('Error', 'Failed to load employee list');
    }
  };

  const handleCreateTask = async () => {
    if (!assigneeEmail) {
      Alert.alert('Validation Error', 'Please select an assignee.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const employeeRes = await axios.get(`http://localhost:8080/api/employees/by-email/${assigneeEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const assigneeId = employeeRes.data.id;

      await axios.post(
        'http://localhost:8080/api/task/create',
        null,
        {
          params: {
            description,
            assigneeId,
            locationRequired,
            selfieRequired,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Task Created', `Task assigned to ${assigneeEmail}`);
      setDescription('');
      setAssigneeEmail('');
      setLocationRequired(false);
      setSelfieRequired(false);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Task</Text>      

      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={description}
        onChangeText={setDescription}
      />

      <RNPickerSelect
        onValueChange={(value) => setAssigneeEmail(value)}
        items={employeeList}
        value={assigneeEmail}
        placeholder={{ label: 'Select Assignee', value: null }}
        useNativeAndroidPickerStyle={false}
        style={pickerSelectStyles}
        Icon={() => {
          return <Ionicons name="chevron-down" size={20} color="gray" />;
        }}
      />

      <View style={styles.toggleContainer}>
        <Text>Location Required</Text>
        <Switch value={locationRequired} onValueChange={setLocationRequired} />
      </View>

      <View style={styles.toggleContainer}>
        <Text>Selfie Required</Text>
        <Switch value={selfieRequired} onValueChange={setSelfieRequired} />
      </View>

      <Button
        title={loading ? 'Creating...' : 'Create Task'}
        onPress={handleCreateTask}
        disabled={loading}
      />
      <FloatingDrawerIcon />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 6,
  },
  toggleContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: 'black',
    marginBottom: 16,
    paddingRight: 30, // to ensure icon doesn't overlap text
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  iconContainer: {
    top: Platform.OS === 'android' ? 18 : 12,
    right: 12,
  },
});

export default CreateTaskScreen;


