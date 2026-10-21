import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    holidays: 0,
  });

  const { signOut, state } = React.useContext(AuthContext);

  const loadDashboard = async (forceRefresh = false) => {
    try {
      const [students, attendance, holidays] = await Promise.all([
        api.getStudents(forceRefresh),
        api.getAttendance(forceRefresh),
        api.getHolidays(forceRefresh),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendance.filter(a => a.date === today);
      const presentCount = todayAttendance.filter(a => a.status === 'present').length;
      const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

      setStats({
        totalStudents: students.length || 0,
        presentToday: presentCount,
        absentToday: absentCount,
        holidays: holidays.length || 0,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard(true);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: () => signOut(), style: 'destructive' },
    ]);
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const ActionButton = ({ icon, label, onPress, color = '#2196F3' }) => (
    <TouchableOpacity
      style={[styles.actionButton, { borderColor: color }]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {state.userData?.username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionTitle}>Today's Statistics</Text>
        <StatCard icon="account-multiple" label="Total Students" value={stats.totalStudents} color="#2196F3" />
        <StatCard icon="check-circle" label="Present" value={stats.presentToday} color="#4CAF50" />
        <StatCard icon="close-circle" label="Absent" value={stats.absentToday} color="#F44336" />
        <StatCard icon="calendar-blank" label="Holidays" value={stats.holidays} color="#FF9800" />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <ActionButton
            icon="qrcode-scan"
            label="QR Scan"
            onPress={() => navigation.navigate('QRScanner')}
            color="#2196F3"
          />
          <ActionButton
            icon="rfid"
            label="RFID Scan"
            onPress={() => navigation.navigate('RFIDScanner')}
            color="#4CAF50"
          />
        </View>

        <View style={styles.actionGrid}>
          <ActionButton
            icon="file-document"
            label="Reports"
            onPress={() => navigation.navigate('AttendanceRegister')}
            color="#FF9800"
          />
          <ActionButton
            icon="account-plus"
            label="Add Student"
            onPress={() => Alert.alert('Coming Soon', 'Add student feature')}
            color="#9C27B0"
          />
        </View>
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
    backgroundColor: '#2196F3',
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
    color: '#E3F2FD',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 12,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 0.48,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default AdminDashboardScreen;
