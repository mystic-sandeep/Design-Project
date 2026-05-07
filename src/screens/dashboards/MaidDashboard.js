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

export default function MaidDashboard({ navigation }) {
  const [onDuty, setOnDuty] = useState(false);

  const handleExit = () => {
    Alert.alert("Logout", "Log out of the Maid portal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  const handleAttendance = (status) => {
    setOnDuty(status === 'in');
    Alert.alert("Success", `Attendance recorded: ${status === 'in' ? 'Started Shift' : 'Ended Shift'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182D" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Maid Portal</Text>
          <Text style={styles.headerSubtitle}>Daily Schedule & Duty</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* Status Section */}
        <View style={styles.dutyCard}>
          <Text style={styles.broomIcon}>🧹</Text>
          <Text style={styles.workerName}>Maid Worker</Text>
          <View style={[styles.statusIndicator, { backgroundColor: onDuty ? '#00C566' : '#FF4D4D' }]} />
          <Text style={styles.statusLabel}>{onDuty ? 'On Duty' : 'Off Duty'}</Text>
        </View>

        {/* Primary Actions */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#635BFF' }]}
            onPress={() => handleAttendance('in')}
          >
            <Text style={styles.btnText}>✅ Check In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#635BFF' }]}
            onPress={() => handleAttendance('out')}
          >
            <Text style={styles.btnText}>🏁 Check Out</Text>
          </TouchableOpacity>
        </View>

        {/* Assigned Apartments / Schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        <View style={styles.scheduleItem}>
          <View style={styles.aptCircle}>
            <Text style={styles.aptText}>A1</Text>
          </View>
          <View style={styles.aptInfo}>
            <Text style={styles.aptName}>Apartment A-101</Text>
            <Text style={styles.aptTime}>09:00 AM - 10:30 AM</Text>
          </View>
          <TouchableOpacity style={styles.doneBtn}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleItem}>
          <View style={styles.aptCircle}>
            <Text style={styles.aptText}>B2</Text>
          </View>
          <View style={styles.aptInfo}>
            <Text style={styles.aptName}>Apartment B-202</Text>
            <Text style={styles.aptTime}>11:00 AM - 12:30 PM</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        </View>

      </ScrollView>

      {/* Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#635BFF' }]}>🏠</Text>
          <Text style={[styles.navLabel, { color: '#635BFF' }]}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleExit}>
          <Text style={styles.navIcon}>🚪</Text>
          <Text style={styles.navLabel}>Exit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1223' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#10182D'
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#AEB8D0', fontSize: 12 },
  exitButton: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8
  },
  exitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  scrollBody: { padding: 15 },
  dutyCard: {
    backgroundColor: '#161F35',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#242F49'
  },
  broomIcon: { fontSize: 40, marginBottom: 10 },
  workerName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginBottom: 5 },
  statusLabel: { color: '#AEB8D0', fontSize: 12, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionBtn: { width: '48%', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161F35',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12
  },
  aptCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#242F49',
    justifyContent: 'center',
    alignItems: 'center'
  },
  aptText: { color: '#635BFF', fontWeight: 'bold' },
  aptInfo: { flex: 1, marginLeft: 15 },
  aptName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  aptTime: { color: '#AEB8D0', fontSize: 12, marginTop: 2 },
  doneBtn: { backgroundColor: '#00C56620', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  doneText: { color: '#00C566', fontSize: 12, fontWeight: 'bold' },
  pendingBadge: { backgroundColor: '#FFB02020', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  pendingText: { color: '#FFB020', fontSize: 12, fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#10182D',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#242F49'
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#717E95' },
  navLabel: { fontSize: 10, color: '#717E95', marginTop: 4 }
});