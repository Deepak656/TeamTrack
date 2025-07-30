import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../constants/screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import FloatingDrawerIcon from '../components/FloatingDrawerIcon';


const TaskListScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/task/my-tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate(Screens.TaskDetail, { task: item })}
    >
      <Text style={styles.description}>{item.description}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created: {new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>🎉 No tasks assigned to you yet.</Text>
      <Text style={styles.emptySubText}>Pull down to refresh if you're expecting any.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <FloatingDrawerIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  taskItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  description: { fontWeight: 'bold', fontSize: 16 },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666'
  },
  emptySubText: {
    fontSize: 14,
    color: '#999'
  }
});

export default TaskListScreen;
