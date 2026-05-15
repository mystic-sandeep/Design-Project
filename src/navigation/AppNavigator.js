// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/theme';

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

// Sub‑features
import StaffListScreen from '../screens/dashboards/StaffListScreen';
import ResidentListScreen from '../screens/dashboards/ResidentListScreen';
import VisitorListScreen from '../screens/dashboards/VisitorListScreen';
import DemoScreen from '../screens/DemoScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ userRole, onLogout, onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ── CASE 1: NO USER LOGGED IN ── */}
      {!userRole ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />

          {/* ✅ Always register dashboards so OTP can navigate */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
          <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
          <Stack.Screen name="StaffDashboard">
            {(props) => <StaffDashboard {...props} onLogout={onLogout} />}
          </Stack.Screen>
          <Stack.Screen name="MaidDashboard">
            {(props) => <MaidDashboard {...props} onLogout={onLogout} />}
          </Stack.Screen>

          {/* Sub‑features */}
          <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
          <Stack.Screen name="ResidentListScreen" component={ResidentListScreen} />
          <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />
          <Stack.Screen name="DemoScreen" component={DemoScreen} />
        </>
      ) : (
        // ── CASE 2: AUTHENTICATED USERS ──
        <>
          {userRole === 'admin' && (
            <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
              <Stack.Screen name="ResidentListScreen" component={ResidentListScreen} />
              <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />
            </>
          )}

          {userRole === 'guard' && (
            <>
              <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
              <Stack.Screen name="VisitorListScreen" component={VisitorListScreen} />
            </>
          )}

          {userRole === 'resident' && (
            <>
              <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
              <Stack.Screen name="DemoScreen" component={DemoScreen} />
            </>
          )}

          {userRole === 'staff' && (
            <Stack.Screen
              name="StaffDashboard"
              options={{
                headerShown: true,
                title: 'Staff Portal',
                headerStyle: {
                  backgroundColor: COLORS.navyDark,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: { fontWeight: '800', fontSize: 18 },
              }}
            >
              {(props) => <StaffDashboard {...props} onLogout={onLogout} />}
            </Stack.Screen>
          )}

          {userRole === 'maid' && (
            <Stack.Screen name="MaidDashboard">
              {(props) => <MaidDashboard {...props} onLogout={onLogout} />}
            </Stack.Screen>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
