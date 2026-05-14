import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';

const roles = [
  { id: 'admin', icon: '⚙️', label: 'Admin' },
  { id: 'guard', icon: '🛡️', label: 'Guard' },
  { id: 'resident', icon: '🏠', label: 'Resident' },
  { id: 'staff', icon: '🔧', label: 'Staff' },
  { id: 'maid', icon: '🧹', label: 'Maid' },
];

const LoginScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState('resident');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to your Mygate account</Text>

      <View style={styles.form}>
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <TextInput style={styles.input} placeholder="you@example.com" />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput style={styles.input} placeholder="Your password" secureTextEntry />

        <Text style={styles.label}>LOGIN AS</Text>
        <View style={styles.roleGrid}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleCard, selectedRole === role.id && styles.selectedCard]}
              onPress={() => setSelectedRole(role.id)}
            >
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <Text style={styles.roleLabel}>{role.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Login to Mygate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.teal, marginTop: 40 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 30 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.gray, marginBottom: 8 },
  input: { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 20 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  roleCard: { width: '30%', padding: 10, borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, alignItems: 'center' },
  selectedCard: { borderColor: COLORS.teal, backgroundColor: '#e0f0f0' },
  roleIcon: { fontSize: 20 },
  roleLabel: { fontSize: 10, fontWeight: '600', marginTop: 5 },
  loginBtn: { backgroundColor: COLORS.teal, padding: 15, borderRadius: 10, alignItems: 'center' },
  loginBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 }
});

export default LoginScreen;