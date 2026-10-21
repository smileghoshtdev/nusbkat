import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment';

const StudentDashboardScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    percentage: 0,
  });

  const { signOut, state } = React.useContext(AuthContext);
  const studentId = state.userData?.id;

  const loadAttendance = async (forceRefresh = false) => {
    try {
      const data = await api.getAttendance(forceRefresh);
      
      // Filter attendance for current student
      const studentAttendance = data.filter(a => a.student_id === studentId);
      setAttendance(studentAttendance.slice(0, 10)); // Last 10 records

      // Calculate stats
      const totalDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(a => a.status === 'present').length;
      const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

      setStats({ totalDays, presentDays, percentage });
    } catch (error) {
      Alert.alert('Error', 'Failed to load attendance data');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendance(true);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: () => signOut(), style: 'destructive' },
    ]);
  };

  const AttendanceItem = ({ date, status }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{moment(date).format('DD MMM')}</Text>
        <Text style={styles.dayText}>{moment(date).format('ddd')}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: status === 'present' ? '#E8F5E9' : '#FFEBEE',
          },
        ]}
      >
        <MaterialCommunityIcons
          name={status === 'present' ? 'check-circle' : 'close-circle'}
          size={20}
          color={status === 'present' ? '#4CAF50' : '#F44336'}
        />
        <Text style={[styles.statusText, { color: status === 'present' ? '#4CAF50' : '#F44336' }]}>
          {status === 'present' ? 'Present' : 'Absent'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Attendance</Text>
          <Text style={styles.headerSubtitle}>{state.userData?.name || 'Student'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalDays}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.presentDays}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
        </View>

        {/* Attendance History */}
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {attendance.length > 0 ? (
          attendance.map((record, index) => (
            <AttendanceItem key={index} date={record.date} status={record.status} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No attendance records yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dayText: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});

export default StudentDashboardScreen;
