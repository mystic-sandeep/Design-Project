import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, Alert
} from 'react-native';

export default function GuardDashboard({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Real-time clock to match the web version dashboard
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExit = () => {
    Alert.alert("Logout", "Confirm exit to Login page?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182D" />

      {/* Header with Exit Button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Guard Dashboard</Text>
          <Text style={styles.headerSubtitle}>Your shift overview</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* Status & Time Cards */}
        <View style={styles.topGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusIcon}>🛡️</Text>
            <Text style={styles.statusText}>On Duty</Text>
          </View>
          <View style={styles.timeCard}>
            <Text style={styles.timeLabel}>Current Time</Text>
            <Text style={styles.timeValue}>{currentTime}</Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#635BFF' }]}
            onPress={() => navigation.navigate('VisitorList')} // Or create a dedicated RegisterVisitor screen
          >
            <Text style={styles.actionBtnText}>➕ Register Visitor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#00C566' }]}
            onPress={() => {}} // Navigate to Vehicle Log screen
          >
            <Text style={styles.actionBtnText}>🚗 Log Vehicle</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.checkBtn}>
              <Text style={styles.checkBtnText}>✅ Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkBtn}>
              <Text style={styles.checkBtnText}>🏁 Check Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Approvals Section */}
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>⏳ Pending Approvals</Text>
          <View style={styles.pendingCard}>
            <Text style={styles.pendingText}>Apt: | Waiting for resident approval...</Text>
          </View>
        </View>

      </ScrollView>

      {/* Consistent Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, {color: '#635BFF'}]}>🏠</Text>
          <Text style={[styles.navLabel, {color: '#635BFF'}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VisitorList')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Visitors</Text>
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
  topGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statusCard: { width: '40%', backgroundColor: '#161F35', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#635BFF30' },
  statusIcon: { fontSize: 24, marginBottom: 5 },
  statusText: { color: '#fff', fontWeight: 'bold' },
  timeCard: { width: '55%', backgroundColor: '#161F35', padding: 15, borderRadius: 12, justifyContent: 'center' },
  timeLabel: { color: '#AEB8D0', fontSize: 12 },
  timeValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  actionContainer: { marginBottom: 25 },
  actionBtn: { padding: 18, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryActions: { flexDirection: 'row', justifyContent: 'space-between' },
  checkBtn: { width: '48%', backgroundColor: '#161F35', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#242F49' },
  checkBtnText: { color: '#AEB8D0', fontWeight: '600' },
  pendingSection: { marginTop: 10 },
  pendingCard: { backgroundColor: '#161F35', padding: 20, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#AEB8D050' },
  pendingText: { color: '#FFB800', fontSize: 14, textAlign: 'center' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#10182D', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#242F49' },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#717E95' },
  navLabel: { fontSize: 10, color: '#717E95', marginTop: 4 }
});