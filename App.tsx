import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // This container is the "brain" that solves your error
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}