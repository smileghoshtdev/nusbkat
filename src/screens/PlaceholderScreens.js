import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// RFID Scanner Screen
export const RFIDScannerScreen = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="rfid" size={64} color="#999" />
    <Text style={styles.title}>RFID Scanner</Text>
    <Text style={styles.subtitle}>Feature coming soon...</Text>
  </View>
);

// Attendance Screen (Admin)
export const AttendanceScreen = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="clipboard-check" size={64} color="#999" />
    <Text style={styles.title}>Mark Attendance</Text>
    <Text style={styles.subtitle}>Feature coming soon...</Text>
  </View>
);

// Student Management Screen
export const StudentManagementScreen = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="account-multiple" size={64} color="#999" />
    <Text style={styles.title}>Student Management</Text>
    <Text style={styles.subtitle}>Feature coming soon...</Text>
  </View>
);

// Attendance Register Screen
export const AttendanceRegisterScreen = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="format-list-bulleted" size={64} color="#999" />
    <Text style={styles.title}>Attendance Register</Text>
    <Text style={styles.subtitle}>Feature coming soon...</Text>
  </View>
);

// Materials Screen
export const MaterialsScreen = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="file-document" size={64} color="#999" />
    <Text style={styles.title}>Study Materials</Text>
    <Text style={styles.subtitle}>Feature coming soon...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
