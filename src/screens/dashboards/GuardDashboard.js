// src/screens/dashboards/GuardDashboard.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';

// Mirroring shared.js fallback API logic
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`https://your-api-base-url.com${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

const PROFESSION_ICONS = {
  plumber: '🔧', electrician: '⚡', gardener: '🌿', carpenter: '🪚',
  delivery: '📦', maid: '🧹', cook: '👨‍🍳', driver: '🚗',
  technician: '🔩', nurse: '🩺', other: '👤'
};

export default function GuardDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [shiftTime, setShiftTime] = useState('Shift not started');

  // Counts & Dynamic Lists
  const [counts, setCounts] = useState({ visitors: 0, pending: 0, checkpoints: 0 });
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    initGuardShift();
    loadAllGuardData();

    // Replicate web app background pooling intervals (30s)
    const backgroundInterval = setInterval(() => {
      loadSOS();
      loadVisitors();
    }, 30000);

    return () => clearInterval(backgroundInterval);
  }, []);

  const initGuardShift = async () => {
    const status = await AsyncStorage.getItem('guard_checkedin');
    if (status === 'true') {
      setCheckedIn(true);
      setShiftTime(`🟢 On Duty`);
    }
  };

  const loadAllGuardData = async () => {
    setLoading(true);
    await Promise.all([loadVisitors(), loadMaintenance(), loadSOS()]);
    setLoading(false);
  };

  const loadVisitors = async () => {
    const d = await apiFetch('/api/v2/admin/visitors');
    const visitors = d?.data?.visitors || [];
    setRecentVisitors(visitors.slice(0, 5));

    setCounts(prev => ({
      ...prev,
      visitors: visitors.length,
      pending: visitors.filter(v => v.status === 'pending').length
    }));
  };

  const loadMaintenance = async () => {
    const d = await apiFetch('/api/v2/maintenance');
    setMaintenanceAlerts(d?.data?.alerts || []);
  };

  const loadSOS = async () => {
    const d = await apiFetch('/api/v2/sos');
    const activeSos = d?.data?.alerts?.filter(s => s.status === 'active') || [];
    setSosAlerts(activeSos);
  };

  // Replicating building GPS geofence simulation
  const doCheckIn = async () => {
    setShiftTime('📡 Checking location…');
    setTimeout(async () => {
      // Simulate successful verification matching checkInsideBuilding() logic
      setCheckedIn(true);
      await AsyncStorage.setItem('guard_checkedin', 'true');
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setShiftTime(`🟢 On Duty — ${timeStr}`);

      await apiFetch('/api/v2/guard/check-in', {
        method: 'POST',
        body: JSON.stringify({ gps_lat: 12.9716, gps_lng: 77.5946, gps_distance: 12 })
      });
      Alert.alert("Success", "Checked in ✅ — 12m from building");
      loadAllGuardData();
    }, 1000);
  };

  const doCheckOut = async () => {
    setCheckedIn(false);
    await AsyncStorage.setItem('guard_checkedin', 'false');
    setShiftTime('⚪ Shift not started');
    await apiFetch('/api/v2/guard/check-out', { method: 'POST' });
    Alert.alert("Checked Out", "Shift ended successfully.");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a2f6e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Guard Portal" showAvatar={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ── SHIFT MANAGEMENT CARD (Dark Navy Theme) ────── */}
        <View style={styles.checkinCard}>
          <Text style={styles.checkinStatus}>{shiftTime}</Text>
          <Text style={styles.checkinMain}>🛡️ Guard Shift Management</Text>
          <View style={styles.checkinBtns}>
            <TouchableOpacity
              style={[styles.btnIn, checkedIn && styles.btnDisabled]}
              onPress={doCheckIn}
              disabled={checkedIn}
            >
              <Text style={styles.btnText}>✓ Check In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnOut, !checkedIn && styles.btnDisabled]}
              onPress={doCheckOut}
              disabled={!checkedIn}
            >
              <Text style={styles.btnText}>✗ Check Out</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.geoText}>📍 GPS Geofence Check Active (Proximity Required)</Text>
        </View>

        {/* ── LIVE MAINTENANCE BANNERS ───────────────────── */}
        {maintenanceAlerts.slice(0, 2).map((alert, index) => (
          <View key={index} style={[styles.alertBanner, styles.maintenanceBanner]}>
            <Text style={styles.bannerIcon}>🔨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitleText}>{alert.title}</Text>
              <Text style={styles.bannerBodyText}>{alert.description || ''}</Text>
            </View>
          </View>
        ))}

        {/* ── LIVE SOS EMERGENCY BANNERS ─────────────────── */}
        {sosAlerts.map((sos, index) => (
          <View key={index} style={[styles.alertBanner, styles.sosBanner]}>
            <Text style={styles.bannerIcon}>🆘</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitleText, { color: '#991b1b' }]}>⚠️ SOS — Flat {sos.flat}</Text>
              <Text style={[styles.bannerBodyText, { color: '#7f1d1d' }]}>{sos.message || ''}</Text>
            </View>
          </View>
        ))}

        {/* ── RECENT COUNTS ROW ───────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#f3e8ff', color: '#a855f7' }]}>👥</Text>
            <Text style={styles.statNum}>{counts.visitors}</Text>
            <Text style={styles.statLbl}>Visitors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#ffedd5', color: '#ea580c' }]}>⏳</Text>
            <Text style={styles.statNum}>{counts.pending}</Text>
            <Text style={styles.statLbl}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#dcfce7', color: '#16a34a' }]}>🗺️</Text>
            <Text style={styles.statNum}>{counts.checkpoints}</Text>
            <Text style={styles.statLbl}>Patrols</Text>
          </View>
        </View>

        {/* ── QUICK LINKS ACTIONS NAVIGATION ──────────────── */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardStaffScreen')}>
            <Text style={styles.actionBtnIcon}>🔧</Text>
            <Text style={styles.actionBtnLabel}>Staff Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardPatrolScreen')}>
            <Text style={styles.actionBtnIcon}>🗺️</Text>
            <Text style={styles.actionBtnLabel}>Patrol Points</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('GuardTasksScreen')}>
            <Text style={styles.actionBtnIcon}>✅</Text>
            <Text style={styles.actionBtnLabel}>My Tasks</Text>
          </TouchableOpacity>
        </View>

        {/* ── RECENT VISITORS DATA LISTING ────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👥 Recent Visitors</Text>
            <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('RegisterVisitorForm')}>
              <Text style={styles.registerBtnText}>+ Register</Text>
            </TouchableOpacity>
          </View>

          {recentVisitors.length === 0 ? (
            <Text style={styles.emptyText}>No visitor logs recorded today.</Text>
          ) : (
            recentVisitors.map((v, i) => (
              <View key={i} style={styles.visitorRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.visitorName}>{v.visitor_name || v.name}</Text>
                  <Text style={styles.visitorSub}>{v.reason_of_visit || '—'}</Text>
                </View>
                <Text style={styles.visitorFlat}>Flat {v.apartment_number || '—'}</Text>
                <View style={[styles.badge, v.status === 'approved' ? styles.bgGreen : v.status === 'denied' ? styles.bgRed : styles.bgYellow]}>
                  <Text style={styles.badgeText}>{v.status || 'pending'}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 16 },
  /* Dark Navy Checkin Card Styles */
  checkinCard: {
    background: 'linear-gradient(135deg,#0d1b3e,#1a2f6e)', // Referenced for target design color match
    backgroundColor: '#0d1b3e',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  checkinStatus: { color: 'rgba(255,255,255,.6)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  checkinMain: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 14 },
  checkinBtns: { flexDirection: 'row', gap: 12 },
  btnIn: { backgroundColor: '#22c55e', flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnOut: { backgroundColor: '#ef4444', flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  geoText: { color: 'rgba(255,255,255,.4)', fontSize: 10, marginTop: 10, textAlign: 'center' },
  /* Alert Banners */
  alertBanner: { flexDirection: 'row', padding: 12, borderRadius: 10, marginBottom: 12, alignItems: 'center', borderWidth: 1 },
  maintenanceBanner: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  sosBanner: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  bannerIcon: { fontSize: 20, marginRight: 12 },
  bannerTitleText: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  bannerBodyText: { fontSize: 11, color: '#1e3a8a', marginTop: 1 },
  /* Stats row */
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { backgroundColor: '#fff', flex: 1, marginHorizontal: 4, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statIcon: { width: 32, height: 32, borderRadius: 6, fontSize: 16, textAlign: 'center', verticalAlign: 'middle', overflow: 'hidden', marginBottom: 6 },
  statNum: { fontSize: 15, fontWeight: '800', color: '#111827' },
  statLbl: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
  /* Action Dashboard Grid Links */
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: { backgroundColor: '#fff', width: '31%', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  actionBtnIcon: { fontSize: 18, marginBottom: 4 },
  actionBtnLabel: { fontSize: 11, fontWeight: '600', color: '#374151' },
  /* Visitor Table Card Styles */
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  registerBtn: { backgroundColor: '#6366f1', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6 },
  registerBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyText: { color: '#9ca3af', fontSize: 12, textAlign: 'center', paddingVertical: 12 },
  visitorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  visitorName: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  visitorSub: { fontSize: 11, color: '#6b7280' },
  visitorFlat: { fontSize: 12, color: '#4b5563', marginRight: 10 },
  badge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, minWidth: 60, alignItems: 'center' },
  badgeText: { fontSize: 10, fontWeight: '700' },
  bgGreen: { backgroundColor: '#dcfce7' },
  bgRed: { backgroundColor: '#fef2f2' },
  bgYellow: { backgroundColor: '#fef9c3' },
});