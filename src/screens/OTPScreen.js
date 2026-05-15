// src/screens/OTPScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../constants/theme';

export default function OTPScreen({ route, navigation }) {
  const [otp, setOtp] = useState('');
  const { role } = route.params || {};

  const verify = () => {
    if (otp.length === 6) {
      if (role === 'resident') navigation.replace('ResidentDashboard');
      else if (role === 'guard') navigation.replace('GuardDashboard');
      else if (role === 'admin') navigation.replace('AdminDashboard');
      else if (role === 'maid') navigation.replace('MaidDashboard');
      else if (role === 'staff') navigation.replace('StaffDashboard');
      else Alert.alert('Invalid Role', 'Please select a valid role before login.');
    } else {
      Alert.alert('Invalid OTP', 'Please enter a 6‑digit OTP to continue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        maxLength={6}
        keyboardType="numeric"
        placeholder="6‑digit code"
        placeholderTextColor="#9ca3af"
        onChangeText={setOtp}
        value={otp}
      />
      <TouchableOpacity style={styles.button} onPress={verify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navyDark,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.gray,
    color: COLORS.white,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.success,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
