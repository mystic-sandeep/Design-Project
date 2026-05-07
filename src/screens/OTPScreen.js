import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export default function OTPScreen({ route, navigation }) {
  const [otp, setOtp] = useState('');
  const { role } = route.params;

  const verify = () => {
    if (otp.length === 6) {
      if (role === 'resident') navigation.replace('Resident');
      else navigation.replace('Guard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <TextInput style={styles.input} maxLength={6} keyboardType="numeric" onChangeText={setOtp} />

      <TouchableOpacity style={styles.button} onPress={verify}>
        <Text style={{ color: '#fff' }}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.navy, justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 24 },
  input: { backgroundColor: THEME.slate, color: '#fff', padding: 15, marginVertical: 20 },
  button: { backgroundColor: THEME.emerald, padding: 15 }
});