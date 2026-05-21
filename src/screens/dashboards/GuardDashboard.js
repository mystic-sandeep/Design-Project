import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';

// Robust API Helper with error handling
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`https://your-api-base-url.com${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    // Check if response is JSON to avoid crashing on HTML error pages
    const contentType = response.headers.get("content-type");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.warn("API Request Failed:", error);
    return null; // Return null to prevent app crashes
  }
};

export default function GuardDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [shiftTime, setShiftTime] = useState('Shift not started');
  const [counts, setCounts] = useState({ visitors: 0, pending: 0, checkpoints: 0 });
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    initGuardShift();
    loadAllGuardData();
    // Background polling
    const interval = setInterval(loadAllGuardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllGuardData = async () => {
    setLoading(true);
    await Promise.all([loadVisitors(), loadMaintenance(), loadSOS()]);
    setLoading(false);
  };

  const loadVisitors = async () => {
    const d = await apiFetch('/api/v2/admin/visitors');
    if (d?.data?.visitors) {
      const v = d.data.visitors;
      setRecentVisitors(v.slice(0, 5));
      setCounts(prev => ({
        ...prev,
        visitors: v.length,
        pending: v.filter(x => x.status === 'pending').length
      }));
    }
  };

  const loadMaintenance = async () => {
    const d = await apiFetch('/api/v2/maintenance');
    if (d?.data?.alerts) setMaintenanceAlerts(d.data.alerts);
  };

  const loadSOS = async () => {
    const d = await apiFetch('/api/v2/sos');
    if (d?.data?.alerts) setSosAlerts(d.data.alerts.filter(s => s.status === 'active'));
  };

  const initGuardShift = async () => {
    const status = await AsyncStorage.getItem('guard_checkedin');
    if (status === 'true') {
      setCheckedIn(true);
      setShiftTime(`🟢 On Duty`);
    }
  };

  const doCheckIn = async () => {
    setCheckedIn(true);
    await AsyncStorage.setItem('guard_checkedin', 'true');
    setShiftTime(`🟢 On Duty — ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
    Alert.alert("Success", "Checked in successfully ✅");
  };

  const doCheckOut = async () => {
    setCheckedIn(false);
    await AsyncStorage.setItem('guard_checkedin', 'false');
    setShiftTime('⚪ Shift not started');
    Alert.alert("Shift Ended", "You have checked out.");
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#094c4c" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#094c4c" />
      <Header title="Guard Portal" showAvatar={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* SHIFT CARD */}
        <View style={styles.checkinCard}>
          <Text style={styles.checkinStatus}>{shiftTime}</Text>
          <Text style={styles.checkinMain}>🛡️ Guard Shift Management</Text>
          <View style={styles.checkinBtns}>
            <TouchableOpacity style={[styles.btnIn, checkedIn && styles.btnDisabled]} onPress={doCheckIn} disabled={checkedIn}><Text style={styles.btnText}>✓ Check In</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btnOut, !checkedIn && styles.btnDisabled]} onPress={doCheckOut} disabled={!checkedIn}><Text style={styles.btnText}>✗ Check Out</Text></TouchableOpacity>
          </View>
        </View>

        {/* ALERTS */}
        {maintenanceAlerts.slice(0, 2).map((a, i) => (<View key={i} style={[styles.alertBanner, styles.maintenanceBanner]}><Text>🔨 {a.title}</Text></View>))}
        {sosAlerts.map((s, i) => (<View key={i} style={[styles.alertBanner, styles.sosBanner]}><Text>⚠️ SOS — Flat {s.flat}</Text></View>))}

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statIcon}>👥</Text><Text style={styles.statNum}>{counts.visitors}</Text><Text style={styles.statLbl}>Visitors</Text></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>⏳</Text><Text style={styles.statNum}>{counts.pending}</Text><Text style={styles.statLbl}>Pending</Text></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>🗺️</Text><Text style={styles.statNum}>{counts.checkpoints}</Text><Text style={styles.statLbl}>Patrols</Text></View>
        </View>

        {/* FUNCTIONAL NAVIGATION ACTIONS */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardStaffScreen')}><Text style={styles.actionBtnIcon}>🔧</Text><Text style={styles.actionBtnLabel}>Staff Log</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardPatrolScreen')}><Text style={styles.actionBtnIcon}>🗺️</Text><Text style={styles.actionBtnLabel}>Patrol</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardTasksScreen')}><Text style={styles.actionBtnIcon}>✅</Text><Text style={styles.actionBtnLabel}>My Tasks</Text></TouchableOpacity>
        </View>

        {/* RECENT VISITORS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👥 Recent Visitors</Text>
            {/* FUNCTIONAL REGISTRATION BUTTON */}
            <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('RegisterVisitorForm')}>
              <Text style={styles.registerBtnText}>+ Register</Text>
            </TouchableOpacity>
          </View>
          {recentVisitors.length === 0 ? <Text style={styles.emptyText}>No visitors recorded.</Text> : recentVisitors.map((v, i) => (
            <View key={i} style={styles.visitorRow}>
              <View><Text style={styles.visitorName}>{v.visitor_name || v.name}</Text><Text style={styles.visitorSub}>{v.reason_of_visit}</Text></View>
              <Text style={[styles.badge, v.status === 'approved' ? styles.bgGreen : styles.bgRed]}>{v.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 16 },
  checkinCard: { backgroundColor: '#0d1b3e', borderRadius: 14, padding: 18, marginBottom: 16 },
  checkinStatus: { color: 'rgba(255,255,255,.6)', fontSize: 11 },
  checkinMain: { color: '#fff', fontSize: 16, fontWeight: '800' },
  checkinBtns: { flexDirection: 'row', gap: 12, marginTop: 10 },
  btnIn: { backgroundColor: '#22c55e', flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  btnOut: { backgroundColor: '#ef4444', flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontWeight: '700' },
  alertBanner: { padding: 12, borderRadius: 10, margianBottom: 12, borderWidth: 1 },
  maintenanceBanner: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  sosBanner: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: '#fff', flex: 1, marginHorizontal: 4, padding: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  statIcon: { fontSize: 20 },
  statNum: { fontSize: 15, fontWeight: '800' },
  statLbl: { fontSize: 10, color: '#6b7280' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: { backgroundColor: '#fff', width: '31%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  actionBtnIcon: { fontSize: 18 },
  actionBtnLabel: { fontSize: 11, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700' },
  registerBtn: { backgroundColor: '#6366f1', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  registerBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  visitorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  visitorName: { fontSize: 13, fontWeight: '700' },
  visitorSub: { fontSize: 11, color: '#6b7280' },
  badge: { fontSize: 10, fontWeight: '700', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  bgGreen: { backgroundColor: '#dcfce7' },
  bgRed: { backgroundColor: '#fef2f2' },
  emptyText: { color: '#9ca3af', textAlign: 'center', padding: 10 }
});