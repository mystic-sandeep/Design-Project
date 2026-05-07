import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

export default function StaffDashboard({ navigation }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleExit = () => {
    Alert.alert("Logout", "Do you want to log out of your staff account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  const toggleAttendance = (type) => {
    const status = type === 'in' ? 'Checked In' : 'Checked Out';
    setIsCheckedIn(type === 'in');
    Alert.alert("Attendance Updated", `You have successfully ${status}.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182D" />

      {/* Header with Exit */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Staff Dashboard</Text>
          <Text style={styles.headerSubtitle}>Your attendance & tasks</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* Profile / Status Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.staffName}>Staff Member</Text>
          <View style={[styles.statusBadge, { backgroundColor: isCheckedIn ? '#00C56620' : '#FF4D4D20' }]}>
            <Text style={[styles.statusText, { color: isCheckedIn ? '#00C566' : '#FF4D4D' }]}>
              {isCheckedIn ? '● Active Now' : '● Currently Offline'}
            </Text>
          </View>
        </View>

        {/* Attendance Actions (From Web Ref) */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.mainActionBtn, { backgroundColor: '#635BFF' }]}
            onPress={() => toggleAttendance('in')}
          >
            <Text style={styles.actionBtnText}>✅ Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainActionBtn, { backgroundColor: '#635BFF' }]}
            onPress={() => toggleAttendance('out')}
          >
            <Text style={styles.actionBtnText}>🏁 Check Out</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Stats for Mobile (Insights) */}
        <View style={styles.statsRow}>
          <View style={styles.smallCard}>
            <Text style={styles.cardVal}>08:30</Text>
            <Text style={styles.cardLabel}>Avg Start</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardVal}>22</Text>
            <Text style={styles.cardLabel}>Days This Month</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#635BFF' }]}>📊</Text>
          <Text style={[styles.navLabel, { color: '#635BFF' }]}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleExit}>
          <Text style={styles.navIcon}>🚪</Text>
          <Text style={styles.navLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1223' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#10182D' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#AEB8D0', fontSize: 12 },
  exitButton: { backgroundColor: '#FF4D4D', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  exitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  scrollBody: { padding: 15 },
  profileCard: { backgroundColor: '#161F35', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#242F49' },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#635BFF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  staffName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  actionContainer: { marginBottom: 25 },
  mainActionBtn: { padding: 18, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 5 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  smallCard: { width: '48%', backgroundColor: '#161F35', padding: 15, borderRadius: 12, alignItems: 'center' },
  cardVal: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardLabel: { color: '#AEB8D0', fontSize: 11, marginTop: 4 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#10182D', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#242F49' },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#717E95' },
  navLabel: { fontSize: 10, color: '#717E95', marginTop: 4 }
});