import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Button, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import FloatingDrawerIcon from '../components/FloatingDrawerIcon';

type Task = {
  id: string;
  description: string;
  status: string;
  selfieRequired: boolean;
  locationRequired: boolean;
};

const TaskDetailScreen = () => {
  const route = useRoute<RouteProp<{ params: { task: Task } }, 'params'>>();
  const task = route.params.task;

  const [image, setImage] = useState<string | null>(null);
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: false });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location access required.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const locText = `Lat: ${loc.coords.latitude}, Lng: ${loc.coords.longitude}`;
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);
    setLocationText(locText);
  };

  const markTaskDone = async () => {
    if (task.selfieRequired && !image) {
      Alert.alert('Selfie required', 'Please capture a selfie.');
      return;
    }
    if (task.locationRequired && (latitude === null || longitude === null)) {
      Alert.alert('Location required', 'Please fetch your location.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      if (latitude != null) formData.append('latitude', String(latitude));
      if (longitude != null) formData.append('longitude', String(longitude));
      formData.append('locationText', locationText);

      if (image) {
        formData.append('selfie', {
          uri: image,
          name: 'selfie.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await axios.post(
        `http://localhost:8080/api/task/mark-done/${task.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Task marked as done.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.description}</Text>
      <Text>Status: {task.status}</Text>

      {task.selfieRequired && (
        <View style={styles.section}>
          <Button title="Capture Selfie" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
      )}

      {task.locationRequired && (
        <View style={styles.section}>
          <Button title="Get Location" onPress={getLocation} />
          {locationText ? <Text style={styles.locationText}>{locationText}</Text> : null}
        </View>
      )}

      <View style={styles.section}>
        <Button
          title={loading ? 'Submitting...' : 'Mark Task as Done'}
          onPress={markTaskDone}
          disabled={loading}
        />
      </View>
            <FloatingDrawerIcon />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  section: { marginVertical: 12 },
  image: { width: 200, height: 200, marginTop: 10 },
  locationText: { marginTop: 10, color: '#555' },
});

export default TaskDetailScreen;
