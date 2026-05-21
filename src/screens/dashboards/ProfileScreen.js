// src/screens/dashboards/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';

export default function ProfileScreen(props) {
  // Explicitly extract navigation and callback handler properties
  const navigation = props.navigation;
  const onLogout = props.onLogout;

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to exit your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          if (onLogout) {
            onLogout(); // Clears userRole parent state to instantly swap back to Onboarding/Login Stack
          } else {
            // Safety backup fallback
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#094c4c" translucent={false} />

      {/* SOLID PHYSICAL SPACER UNIT */}
      <View style={styles.statusBarSpacer} />

      {/* TITLE APP BAR HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.profileBody}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>U</Text>
        </View>
        <Text style={styles.userName}>Account Profile</Text>
        <Text style={styles.userSub}>MyGate Dashboard Access</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
    backgroundColor: '#094c4c',
    width: '100%',
  },
  header: {
    height: 60,
    backgroundColor: '#094c4c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6
  },
  backText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  profileBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eef6f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#094c4c'
  },
  avatarTextLarge: { fontSize: 36, fontWeight: '800', color: '#094c4c' },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827' },
  userSub: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  logoutBtn: {
    backgroundColor: '#dc2626',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  logoutBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});