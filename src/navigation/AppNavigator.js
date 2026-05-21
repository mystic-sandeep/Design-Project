// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth / Entry Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPScreen from '../screens/OTPScreen';

// Dashboards
import AdminDashboard from '../screens/dashboards/AdminDashboard';
import GuardDashboard from '../screens/dashboards/GuardDashboard';
import MaidDashboard from '../screens/dashboards/MaidDashboard';
import StaffDashboard from '../screens/dashboards/StaffDashboard';
import ResidentDashboard from '../screens/dashboards/ResidentDashboard';

// --- ADDED: Admin Feature Imports ---
import AdminPatrolScreen from '../screens/dashboards/AdminPatrolScreen';
import AdminTasksScreen from '../screens/dashboards/AdminTasksScreen';
import MaintenanceScreen from '../screens/dashboards/MaintenanceScreen';
import RegistrationsScreen from '../screens/dashboards/RegistrationsScreen';

// Sub‑features
import StaffListScreen from '../screens/dashboards/StaffListScreen';
import ResidentListScreen from '../screens/dashboards/ResidentListScreen';
import VisitorListScreen from '../screens/dashboards/VisitorListScreen';
import DemoScreen from '../screens/DemoScreen';

// Profile Screen Import
import ProfileScreen from '../screens/dashboards/ProfileScreen';

// --- ADDED: Guard Feature Imports ---
import GuardStaffScreen from '../screens/dashboards/GuardStaffScreen';
import GuardPatrolScreen from '../screens/dashboards/GuardPatrolScreen';
import GuardTasksScreen from '../screens/dashboards/GuardTasksScreen';
import RegisterVisitorForm from '../screens/dashboards/RegisterVisitorForm';

const Stack = createStackNavigator();

export let globalLogout = null;

export default function AppNavigator({ userRole, onLogout, onLoginSuccess }) {
  globalLogout = onLogout;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userRole ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="GuardDashboard" component={GuardDashboard} />

          {/* --- FIX: Added here so they work when testing without logging in --- */}
          <Stack.Screen name="GuardStaffScreen" component={GuardStaffScreen} />
          <Stack.Screen name="GuardPatrolScreen" component={GuardPatrolScreen} />
          <Stack.Screen name="GuardTasksScreen" component={GuardTasksScreen} />
          <Stack.Screen name="RegisterVisitorForm" component={RegisterVisitorForm} />

          {/* --- FIX: ADDED MISSING ADMIN SCREENS FOR UN-AUTHENTICATED GUEST TESTING --- */}
          <Stack.Screen name="AdminPatrolScreen" component={AdminPatrolScreen} />
          <Stack.Screen name="AdminTasksScreen" component={AdminTasksScreen} />
          <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
          <Stack.Screen name="RegistrationsScreen" component={RegistrationsScreen} />

          <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
          <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
          <Stack.Screen name="MaidDashboard" component={MaidDashboard} />
          <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
          <Stack.Screen name="ResidentListScreen" component={ResidentListScreen} />
          <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />
          <Stack.Screen name="DemoScreen" component={DemoScreen} />
        </>
      ) : (
        <>
          {userRole === 'admin' && (
            <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
              <Stack.Screen name="ResidentListScreen" component={ResidentListScreen} />
              <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />

              {/* --- ADDED FOR ADMIN FEATURE TRANSITION --- */}
              <Stack.Screen name="RegisterVisitorForm" component={RegisterVisitorForm} />
              <Stack.Screen name="AdminPatrolScreen" component={AdminPatrolScreen} />
              <Stack.Screen name="AdminTasksScreen" component={AdminTasksScreen} />
              <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
              <Stack.Screen name="RegistrationsScreen" component={RegistrationsScreen} />
            </>
          )}

          {userRole === 'guard' && (
            <>
              <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
              <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />

              {/* --- FIX: Added here for when a Guard is officially logged in --- */}
              <Stack.Screen name="GuardStaffScreen" component={GuardStaffScreen} />
              <Stack.Screen name="GuardPatrolScreen" component={GuardPatrolScreen} />
              <Stack.Screen name="GuardTasksScreen" component={GuardTasksScreen} />
              <Stack.Screen name="RegisterVisitorForm" component={RegisterVisitorForm} />
            </>
          )}

          {userRole === 'resident' && (
            <>
              <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
              <Stack.Screen name="DemoScreen" component={DemoScreen} />
            </>
          )}

          {userRole === 'staff' && (
            <>
              <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
              <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
            </>
          )}

          {userRole === 'maid' && (
            <Stack.Screen name="MaidDashboard" component={MaidDashboard} />
          )}
        </>
      )}

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}