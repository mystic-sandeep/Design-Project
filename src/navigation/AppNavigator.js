import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/theme'; // Imports your updated color file

// Dashboard Screen Entry Points
import AdminDashboard from '../screens/dashboards/AdminDashboard';
import GuardDashboard from '../screens/dashboards/GuardDashboard';
import MaidDashboard from '../screens/dashboards/MaidDashboard';
import StaffDashboard from '../screens/dashboards/StaffDashboard'; // Added for web app alignment

// Sub features screen configurations
import StaffListScreen from '../screens/StaffListScreen';
import GuardStaffScreen from '../screens/guard/GuardStaffScreen';
import GuardPatrolScreen from '../screens/guard/GuardPatrolScreen';
import RegisterVisitorForm from '../screens/guard/RegisterVisitorForm';

const Stack = createStackNavigator();

export default function AppNavigator({ userRole, onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === 'admin' ? (
        <>
          {/* Admin Routing Stack Section */}
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="StaffListScreen" component={StaffListScreen} />
        </>
      ) : userRole === 'guard' ? (
        <>
          {/* Guard Routing Stack Section */}
          <Stack.Screen name="GuardDashboard" component={GuardDashboard} />
          <Stack.Screen name="GuardStaffScreen" component={GuardStaffScreen} />
          <Stack.Screen name="GuardPatrolScreen" component={GuardPatrolScreen} />
          <Stack.Screen name="RegisterVisitorForm" component={RegisterVisitorForm} />
        </>
      ) : userRole === 'staff' ? (
        <>
          {/* Staff Routing Stack Section - Configured to replicate the Web Dashboard header styling */}
          <Stack.Screen
            name="StaffDashboard"
            options={{
              headerShown: true,
              title: 'Staff Portal',
              headerStyle: {
                backgroundColor: COLORS.navyDark, // Web dashboard's exact deep blue primary color
                elevation: 0,
                shadowOpacity: 0
              },
              headerTintColor: COLORS.white,
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 18
              },
            }}
          >
            {(props) => <StaffDashboard {...props} onLogout={onLogout} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          {/* Maid Fallback Routing Stack Section */}
          <Stack.Screen name="MaidDashboard">
            {(props) => <MaidDashboard {...props} onLogout={onLogout} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}