import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, StatusBar, Platform, Alert
} from 'react-native';

const roles = [
  { id: 'admin', label: 'Admin', icon: '⚙️', screen: 'AdminDashboard' },
  { id: 'guard', label: 'Guard', icon: '🛡️', screen: 'GuardDashboard' },
  { id: 'resident', label: 'Resident', icon: '🏠', screen: 'ResidentDashboard' },
  { id: 'staff', label: 'Staff', icon: '🔧', screen: 'StaffDashboard' },
  { id: 'maid', label: 'Maid', icon: '🧹', screen: 'MaidDashboard' },
];

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleLogin = () => {
    // Find the object for the selected role
    const roleData = roles.find(r => r.id === selectedRole);

    if (mode === 'login') {
      // Check if the screen exists in your navigator
      if (roleData && roleData.screen) {
        navigation.navigate(roleData.screen);
      } else {
        Alert.alert("Coming Soon", `The ${roleData.label} dashboard is being built.`);
      }
    } else {
      // Registration logic
      navigation.navigate('OTPScreen');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Tab Selection */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && styles.activeTab]}>
            <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('register')} style={[styles.tab, mode === 'register' && styles.activeTab]}>
            <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>New Registration</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeTitle}>{mode === 'login' ? 'Welcome back' : 'Create Account'}</Text>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
          <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#AAA" />

          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput style={styles.input} placeholder="Enter password" secureTextEntry placeholderTextColor="#AAA" />

          <Text style={styles.inputLabel}>CONTINUE AS</Text>
          <View style={styles.roleGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, selectedRole === role.id && styles.activeRoleCard]}
                onPress={() => setSelectedRole(role.id)}
              >
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <Text style={[styles.roleText, selectedRole === role.id && styles.activeRoleText]}>{role.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>
              {mode === 'login' ? 'Login to MyGate' : 'Register Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 50 : 10, paddingBottom: 40 },
  tabsContainer: { flexDirection: 'row', marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { marginRight: 25, paddingBottom: 10 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#635BFF' },
  tabText: { fontSize: 16, fontWeight: '700', color: '#999' },
  activeTabText: { color: '#635BFF' },
  welcomeTitle: { fontSize: 32, fontWeight: '800', color: '#000', marginBottom: 25 },
  inputLabel: { fontSize: 12, fontWeight: '800', color: '#999', marginBottom: 8, marginTop: 15 },
  input: { height: 55, backgroundColor: '#F9F9FB', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  roleCard: { width: '31%', height: 95, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  activeRoleCard: { borderColor: '#635BFF', backgroundColor: '#F4F2FF' },
  roleIcon: { fontSize: 24, marginBottom: 4 },
  roleText: { fontSize: 13, fontWeight: '600', color: '#555' },
  activeRoleText: { color: '#635BFF' },
  primaryBtn: { backgroundColor: '#635BFF', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});