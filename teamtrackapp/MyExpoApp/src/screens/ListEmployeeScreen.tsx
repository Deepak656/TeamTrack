import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FloatingDrawerIcon from '../components/FloatingDrawerIcon';

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const ListEmployeeScreen = () => {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchEmployees = async (pageNo = 0, isRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/employees`, {
        params: { page: pageNo, size: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });

      const newEmployees: Employee[] = res.data.content;
      setHasMore(!res.data.last);

      if (isRefresh) {
        setEmployees(newEmployees);
      } else {
        setEmployees((prev) => [...prev, ...newEmployees]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchEmployees(0, true);
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEmployees(nextPage);
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
        <Button title="Add Member" onPress={() => navigation.navigate('AddEmployee' as never)} />
      </View>

      {loading && employees.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : employees.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No employees found.</Text>
          <Text style={styles.emptyText}>Start adding team members!</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
            <FloatingDrawerIcon />
    </View>
  );
};

export default ListEmployeeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '500' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
