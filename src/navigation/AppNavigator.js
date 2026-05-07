import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Core Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';

// Dashboard Screens
import AdminDashboard from '../screens/dashboards/AdminDashboard';
import GuardDashboard from '../screens/dashboards/GuardDashboard';
import ResidentDashboard from '../screens/dashboards/ResidentDashboard';
import StaffDashboard from '../screens/dashboards/StaffDashboard'; // Added
import MaidDashboard from '../screens/dashboards/MaidDashboard';   // Added

// Admin Sub-Sections
import VisitorListScreen from '../screens/dashboards/VisitorListScreen';
import ResidentListScreen from '../screens/dashboards/ResidentListScreen';
import StaffListScreen from '../screens/dashboards/StaffListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding"
    >
      {/* Auth Flow */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />

      {/* Main Portals - Now all 5 roles are mapped */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
      <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
      <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
      <Stack.Screen name="MaidDashboard" component={MaidDashboard} />

      {/* Lists & Logs */}
      <Stack.Screen name="VisitorList" component={VisitorListScreen} />
      <Stack.Screen name="ResidentList" component={ResidentListScreen} />
      <Stack.Screen name="StaffList" component={StaffListScreen} />
    </Stack.Navigator>
  );
}