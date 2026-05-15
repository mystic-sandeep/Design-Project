// src/screens/dashboards/MaidDashboard.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importing Custom UI Elements
import Header from '../../components/Header';
import MaidTaskCard from '../../components/maid/MaidTaskCard';

// Safely evaluate if imports were passed as named objects instead of defaults
const SafeHeader = (props) => {
  if (Header && typeof Header === 'function') return <Header {...props} />;
  if (Header && Header.Header) { const Component = Header.Header; return <Component {...props} />; }
  return <View style={{ padding: 16, backgroundColor: '#4f46e5' }}><Text style={{ color: '#fff' }}>Header Component (Check Export Syntax)</Text></View>;
};

const SafeTaskCard = (props) => {
  if (MaidTaskCard && typeof MaidTaskCard === 'function') return <MaidTaskCard {...props} />;
  if (MaidTaskCard && MaidTaskCard.MaidTaskCard) { const Component = MaidTaskCard.MaidTaskCard; return <Component {...props} />; }
  return (
    <View style={{ padding: 12, borderWith: 1, borderColor: '#e5e7eb', marginBottom: 8 }}>
      <Text style={{ fontWeight: 'bold' }}>{props.task?.title || 'Task Details'}</Text>
      <Text style={{ fontSize: 11, color: '#6b7280' }}>Export configuration mismatch in MaidTaskCard.js</Text>
    </View>
  );
};

// Local Isolation: Graceful mock handling when server is disconnected
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`http://10.0.2.2:5000${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log("Backend disconnected. Using safe dashboard layout client-side defaults.", error.message);
    return null; // Return null so fallback states (|| []) handle it seamlessly
  }
};

export default function MaidDashboard({ navigation, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // Status hooks
  const [checkedIn, setCheckedIn] = useState(false);
  const [buildingAccess, setBuildingAccess] = useState(false);
  const [shiftTime, setShiftTime] = useState('Shift not started');

  // Data lists
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    initMaidState();
    loadMaidData();

    const polling = setInterval(() => {
      loadMaintenance();
      loadTasks();
    }, 30000);

    return () => clearInterval(polling);
  }, []);

  const initMaidState = async () => {
    const isChecked = await AsyncStorage.getItem('maid_checkedin');
    const hasAccess = await AsyncStorage.getItem('maid_building_access');
    if (isChecked === 'true') {
      setCheckedIn(true);
      setShiftTime('🟢 Checked In');
    }
    if (hasAccess === 'true') setBuildingAccess(true);
  };

  const loadMaidData = async () => {
    setLoading(true);
    await Promise.all([loadMaintenance(), loadTasks()]);
    setLoading(false);
  };

  const loadMaintenance = async () => {
    const d = await apiFetch('/api/v2/maintenance');
    setMaintenanceAlerts(d?.data?.alerts || []);
  };

  const loadTasks = async () => {
    const d = await apiFetch('/api/v2/tasks?assignTo=maid');
    setTasks(d?.data?.tasks || []);
  };

  const handleCheckIn = async () => {
    setCheckedIn(true);
    await AsyncStorage.setItem('maid_checkedin', 'true');
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setShiftTime(`🟢 Checked In — ${timeStr}`);
    Alert.alert("Success", "Attendance logged successfully.");
  };

  const toggleBuildingAccess = async () => {
    if (!checkedIn) {
      Alert.alert("Access Denied", "Please complete your shift Check In first.");
      return;
    }
    const nextState = !buildingAccess;
    setBuildingAccess(nextState);
    await AsyncStorage.setItem('maid_building_access', nextState ? 'true' : 'false');
  };

  const acceptTask = async (id) => {
    if (!checkedIn || !buildingAccess) {
      Alert.alert("Action Prevented", "Ensure you are Checked In and inside the Building first.");
      return;
    }
    await apiFetch(`/api/v2/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'accepted' })
    });
    loadTasks();
  };

  const completeTask = async (id) => {
    await apiFetch(`/api/v2/tasks/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'done' })
    });
    loadTasks();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeHeader title="Maid Dashboard" showAvatar={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {activeTab === 'home' && (
          <>
            {/* Attendance & Gate Access */}
            <View style={styles.attendanceCard}>
              <Text style={styles.attendanceStatus}>{shiftTime}</Text>
              <Text style={styles.attendanceTitle}>🧹 Attendance & Gate Access</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionBtn, checkedIn && styles.btnActiveGreen]} onPress={handleCheckIn} disabled={checkedIn}>
                  <Text style={styles.actionBtnText}>{checkedIn ? "✓ Present" : "✓ Check In"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, buildingAccess ? styles.btnActiveBlue : styles.btnInactiveBorder]} onPress={toggleBuildingAccess}>
                  <Text style={[styles.actionBtnText, !buildingAccess && { color: '#4b5563' }]}>
                    {buildingAccess ? "🔓 Inside Building" : "🔒 Access Building"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Live Preview Banners */}
            {maintenanceAlerts.slice(0, 1).map((alert, idx) => (
              <View key={idx} style={styles.alertBanner}>
                <Text style={styles.bannerIcon}>🔨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>{alert.title}</Text>
                  <Text style={styles.bannerBody}>{alert.description || ''}</Text>
                </View>
              </View>
            ))}

            {/* Main Duties Section */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 Today's Assigned Duties</Text>
              {tasks.length === 0 ? (
                <Text style={styles.emptyText}>No duties scheduled for today.</Text>
              ) : (
                tasks.slice(0, 3).map((task) => (
                  <SafeTaskCard key={task.id} task={task} onAccept={acceptTask} onComplete={completeTask} />
                ))
              )}
            </View>
          </>
        )}

        {activeTab === 'tasks' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ All Tasks Registry</Text>
            {tasks.length === 0 ? (
              <Text style={styles.emptyText}>No duties linked to your profile.</Text>
            ) : (
              tasks.map((task) => (
                <SafeTaskCard key={task.id} task={task} onAccept={acceptTask} onComplete={completeTask} />
              ))
            )}
          </View>
        )}

        {activeTab === 'alerts' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔔 Maintenance Notifications</Text>
            {maintenanceAlerts.length === 0 ? (
              <Text style={styles.emptyText}>No notices running today.</Text>
            ) : (
              maintenanceAlerts.map((alert, idx) => (
                <View key={idx} style={[styles.alertBanner, { marginBottom: 10 }]}>
                  <Text style={styles.bannerIcon}>🔨</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bannerTitle}>{alert.title}</Text>
                    <Text style={styles.bannerBody}>{alert.description || ''}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>

      {/* ── TAB BAR OVERLAY ── */}
      <View style={styles.tabbar}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]} onPress={() => setActiveTab('home')}>
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItem, activeTab === 'tasks' && styles.tabItemActive]} onPress={() => setActiveTab('tasks')}>
          <Text style={styles.tabIcon}>✅</Text>
          <Text style={[styles.tabLabel, activeTab === 'tasks' && styles.tabLabelActive]}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItem, activeTab === 'alerts' && styles.tabItemActive]} onPress={() => setActiveTab('alerts')}>
          <Text style={styles.tabIcon}>🔔</Text>
          <Text style={[styles.tabLabel, activeTab === 'alerts' && styles.tabLabelActive]}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  attendanceCard: { backgroundColor: '#1e1b4b', borderRadius: 14, padding: 16, marginBottom: 16 },
  attendanceStatus: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  attendanceTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnActiveGreen: { backgroundColor: '#22c55e' },
  btnActiveBlue: { backgroundColor: '#3b82f6' },
  btnInactiveBorder: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db' },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  alertBanner: { flexDirection: 'row', backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
  bannerIcon: { fontSize: 18, marginRight: 10 },
  bannerTitle: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  bannerBody: { fontSize: 11, color: '#1e3a8a', marginTop: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 14 },
  emptyText: { color: '#9ca3af', fontSize: 12, textAlign: 'center', paddingVertical: 16 },
  tabbar: { flexDirection: 'row', height: 60, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%' },
  tabItemActive: { borderTopWidth: 2, borderTopColor: '#4f46e5' },
  tabIcon: { fontSize: 18 },
  tabLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500', marginTop: 2 },
  tabLabelActive: { color: '#4f46e5', fontWeight: '700' }
});