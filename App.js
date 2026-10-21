import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/Navigation';

// Import all screens to fix navigation references
import {
  RFIDScannerScreen,
  AttendanceScreen,
  StudentManagementScreen,
  AttendanceRegisterScreen,
  MaterialsScreen,
} from './src/screens/PlaceholderScreens';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootAppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootAppNavigator() {
  const { state } = React.useContext(AuthContext);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <RootNavigator state={state} userData={state.userData} />
    </>
  );
}
