import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import StudentDashboardScreen from '../screens/student/DashboardScreen';
import AttendanceScreen from '../screens/admin/AttendanceScreen';
import QRScannerScreen from '../screens/attendance/QRScannerScreen';
import RFIDScannerScreen from '../screens/attendance/RFIDScannerScreen';
import MaterialsScreen from '../screens/student/MaterialsScreen';
import AttendanceRegisterScreen from '../screens/admin/AttendanceRegisterScreen';
import StudentManagementScreen from '../screens/admin/StudentManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Admin Tabs
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'AdminDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'account-multiple' : 'account-multiple-outline';
          } else if (route.name === 'AttendanceRegister') {
            iconName = focused ? 'format-list-bulleted-square' : 'format-list-bulleted';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: 'Mark Attendance' }}
      />
      <Tab.Screen
        name="Students"
        component={StudentManagementScreen}
        options={{ title: 'Students' }}
      />
      <Tab.Screen
        name="AttendanceRegister"
        component={AttendanceRegisterScreen}
        options={{ title: 'Register' }}
      />
    </Tab.Navigator>
  );
};

// Admin Stack with nested tabs
const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{ title: 'QR Scanner' }}
      />
      <Stack.Screen
        name="RFIDScanner"
        component={RFIDScannerScreen}
        options={{ title: 'RFID Scanner' }}
      />
    </Stack.Navigator>
  );
};

// Student Tabs
const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'StudentDashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Materials') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen
        name="StudentDashboard"
        component={StudentDashboardScreen}
        options={{ title: 'My Dashboard' }}
      />
      <Tab.Screen
        name="Materials"
        component={MaterialsScreen}
        options={{ title: 'Materials' }}
      />
    </Tab.Navigator>
  );
};

// Student Stack with nested tabs
const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StudentTabs" component={StudentTabs} />
    </Stack.Navigator>
  );
};

// Root Navigator
export const RootNavigator = ({ state, userData }) => {
  return (
    <NavigationContainer>
      {state.isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : state.userToken == null ? (
        <AuthStack />
      ) : userData?.role === 'admin' ? (
        <AdminStack />
      ) : (
        <StudentStack />
      )}
    </NavigationContainer>
  );
};
