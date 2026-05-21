// App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  // ✅ FIX: Set initial state to null so the app starts fresh at Onboarding/Login
  const [userRole, setUserRole] = useState<string | null>(null);

  // Handlers to pass down through your AppNavigator
  const handleLoginSuccess = (role: string) => {
    setUserRole(role); // Sets the role dynamically when they submit valid login details
  };

  const handleLogout = () => {
    setUserRole(null); // Instantly clears the role, wiping the dashboards out and bringing back Login
  };

  return (
    <NavigationContainer>
      <AppNavigator
        userRole={userRole}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
    </NavigationContainer>
  );
}