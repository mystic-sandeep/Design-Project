// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Dashboard Screen Entry Points
import AdminDashboard from '../screens/dashboards/AdminDashboard';
import GuardDashboard from '../screens/dashboards/GuardDashboard';
import MaidDashboard from '../screens/dashboards/MaidDashboard';

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
      ) : (
        <>
          {/* Maid Routing Stack Section */}
          <Stack.Screen name="MaidDashboard">
            {(props) => <MaidDashboard {...props} onLogout={onLogout} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}