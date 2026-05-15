import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { COLORS } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('resident');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Register yourself in your society</Text>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>FIRST NAME</Text>
          <TextInput style={styles.input} placeholder="First name" placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>LAST NAME</Text>
          <TextInput style={styles.input} placeholder="Last name" placeholderTextColor="#9ca3af" />
        </View>
      </View>

      <Text style={styles.label}>EMAIL</Text>
      <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#9ca3af" />

      <Text style={styles.label}>PHONE</Text>
      <TextInput style={styles.input} placeholder="+91 00000 00000" keyboardType="phone-pad" placeholderTextColor="#9ca3af" />

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>FLAT / UNIT NO.</Text>
          <TextInput style={styles.input} placeholder="B-202" placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>SOCIETY</Text>
          <TextInput style={styles.input} placeholder="Society name" placeholderTextColor="#9ca3af" />
        </View>
      </View>

      <Text style={styles.label}>REGISTER AS</Text>
      <View style={styles.roleRow}>
        {['resident', 'staff', 'maid'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleCard, role === r && styles.roleSelected]}
            onPress={() => setRole(r)}
          >
            <Text style={styles.roleIcon}>
              {r === 'resident' ? '🏠' : r === 'staff' ? '🔧' : '🧹'}
            </Text>
            <Text style={styles.roleLabel}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>PASSWORD</Text>
      <TextInput style={styles.input} placeholder="Min. 8 characters" secureTextEntry placeholderTextColor="#9ca3af" />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => navigation.navigate('OTP', { role })}
      >
        <Text style={styles.submitText}>Create My Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signinLink}>
        <Text style={styles.signinText}>Already have an account? Sign in →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: COLORS.white },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.navyDark, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.gray, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  field: { flex: 1, marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.gray, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 14, color: COLORS.dark },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleCard: { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  roleSelected: { borderColor: COLORS.teal, backgroundColor: '#e0f0f0' },
  roleIcon: { fontSize: 20 },
  roleLabel: { fontSize: 11, fontWeight: '600', marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.teal, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  signinLink: { marginTop: 20, alignItems: 'center' },
  signinText: { color: COLORS.teal, fontWeight: '600', textDecorationLine: 'underline' },
});
