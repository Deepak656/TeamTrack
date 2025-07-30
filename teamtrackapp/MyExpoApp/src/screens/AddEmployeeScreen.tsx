import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

const AddEmployeeScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<string[]>(['ROLE_USER']); // ✅ default role
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/roles/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableRoles(res.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleSubmit = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      roles.length === 0
    ) {
      Alert.alert('Validation Error', 'All fields and at least one role are required.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      // Check if employee exists
      try {
        const check = await axios.get(
          `http://localhost:8080/api/employees/by-email/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (check?.data) {
          Alert.alert(
            'Employee Already Exists',
            `An employee with this email already exists.`,
            [
              {
                text: 'View Profile',
                onPress: () => {
                  console.log('Existing employee:', check.data);
                  // Optionally navigate
                },
              },
              { text: 'OK', style: 'cancel' },
            ]
          );
          return;
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          Alert.alert('Error', 'Failed to verify email uniqueness.');
          return;
        }
      }

      await axios.post(
        'http://localhost:8080/api/employees',
        {
          firstName,
          lastName,
          email,
          username,
          password,
          employeeRoles: roles,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Success', 'Employee added successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRoles(['ROLE_USER']);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Employee</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Assign Role(s)</Text>

      {availableRoles.length > 0 ? (
        <RNPickerSelect
          onValueChange={(value) => {
            if (value && !roles.includes(value)) {
              setRoles([...roles, value]);
            }
          }}
          items={availableRoles.map((role) => ({
            label: role.replace('ROLE_', ''),
            value: role,
          }))}
          placeholder={{ label: 'Select Role', value: null }}
          value={null}
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles}
          Icon={() => <Ionicons name="checkmark-circle" size={20} color="green" />}
        />
      ) : (
        <Text>Loading roles...</Text>
      )}

      {roles.length > 0 && (
        <View style={styles.selectedRoles}>
          <Text style={styles.rolesText}>Selected Roles:</Text>
          {roles.map((role) => (
            <Text key={role} style={styles.roleItem}>
              ✅ {role.replace('ROLE_', '')}
            </Text>
          ))}
        </View>
      )}

      <Button
        title={loading ? 'Submitting...' : 'Add Employee'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  selectedRoles: {
    marginVertical: 10,
    backgroundColor: '#f2fdf2',
    padding: 10,
    borderRadius: 8,
  },
  rolesText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  roleItem: {
    paddingVertical: 2,
    fontSize: 14,
    color: '#2b6e2f',
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
    paddingRight: 30,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  placeholder: {
    color: '#999',
  },
  iconContainer: {
    top: Platform.OS === 'android' ? 18 : 12,
    right: 12,
  },
});

export default AddEmployeeScreen;
