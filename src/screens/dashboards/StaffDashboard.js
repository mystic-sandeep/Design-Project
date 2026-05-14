import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Requires react-native-linear-gradient
import { COLORS } from '../../constants/theme';

export default function StaffDashboard({ navigation }) {
  // --- Core States matching staff.html ---
  const [checkedIn, setCheckedIn] = useState(false);
  const [buildingAccess, setBuildingAccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, accepted: 0, done: 0 });
  const [gpsConfig, setGpsConfig] = useState({ lat: 12.9716, radius: 100 }); // Mocked fallback configuration

  useEffect(() => {
    // Initial data fetch mirroring loadAll()
    fetchTasks();
  }, []);

  // --- API / Logic Subsystems ---
  const checkInsideBuilding = async () => {
    // Mimics the async geo-fencing calculation logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ allowed: true, distance: 12, lat: 12.9717, lng: 77.5946 });
      }, 1500);
    });
  };

  const handleCheckIn = async () => {
    setIsLocating(true);
    try {
      const gps = await checkInsideBuilding();
      if (!gps.allowed) {
        Alert.alert('GPS Restriction', '❌ Check-in requires proximity to building.');
        setIsLocating(false);
        return;
      }

      // Perform mock API execution mimicking /api/v2/staff/check-in
      setCheckedIn(true);
      Alert.alert('Success', `Checked in ✅ — ${gps.distance}m from building`);
    } catch (error) {
      Alert.alert('Error', 'Failed to record check-in.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleAccessBuilding = () => {
    setBuildingAccess(true);
    Alert.alert('Access Granted', 'Building access granted 🏢');
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setBuildingAccess(false);
    Alert.alert('Shift Ended', 'Checkout recorded.');
  };

  const fetchTasks = () => {
    // Mocked task payload data matching staff.html structure
    const mockTasks = [
      { id: 1, title: 'Fix Clubhouse AC', status: 'pending', priority: 'high', location: 'Block B', createdBy: 'Admin' },
      { id: 2, title: 'Check Water Pump Meter', status: 'accepted', priority: 'medium', location: 'Basement 2', createdBy: 'Security Sub' }
    ];
    setTasks(mockTasks);

    const pending = mockTasks.filter(t => t.status === 'pending').length;
    const accepted = mockTasks.filter(t => t.status === 'accepted').length;
    const done = mockTasks.filter(t => t.status === 'done').length;
    setCounts({ pending, accepted, done });
  };

  const updateTaskStatus = (id, nextStatus) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        return { ...task, status: nextStatus };
      }
      return task;
    });
    setTasks(updated);
    // Recalculate quick numbers
    setCounts({
      pending: updated.filter(t => t.status === 'pending').length,
      accepted: updated.filter(t => t.status === 'accepted').length,
      done: updated.filter(t => t.status === 'done').length,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

      {/* 💳 HERO SHIFT CARD (Linear Gradient styling matching Web) */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.shiftCard}
      >
        <Text style={styles.cardHeaderTitle}>👷 My Shift</Text>

        {/* Horizontal Mobile Stepper Row */}
        <View style={styles.stepperContainer}>
          <Text style={[styles.stepText, checkedIn && styles.stepDone]}>1️⃣ In</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={[styles.stepText, buildingAccess && styles.stepDone, !buildingAccess && checkedIn && styles.stepActive]}>2️⃣ Access</Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={[styles.stepText, buildingAccess && styles.stepActive]}>3️⃣ Tasks</Text>
        </View>

        {/* Dynamic Interactive Shift Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnSuccess, checkedIn && styles.btnDisabled]}
            onPress={handleCheckIn}
            disabled={checkedIn || isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>✓ Check In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline, (!checkedIn || buildingAccess) && styles.btnDisabled]}
            onPress={handleAccessBuilding}
            disabled={!checkedIn || buildingAccess}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>🏢 Access Bldg</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnWarning, !checkedIn && styles.btnDisabled]}
            onPress={handleCheckOut}
            disabled={!checkedIn}
          >
            <Text style={styles.btnText}>Exit Shift</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Status Copy String */}
        <Text style={styles.shiftInfo}>
          {checkedIn
            ? (buildingAccess ? '🟢 Inside building — view tasks' : '🟡 Checked in — tap "Access Building"')
            : '⚪ Not checked in'}
        </Text>

        <Text style={styles.gpsConfigText}>
          📍 Geofence: {gpsConfig.radius}m radius restriction enabled.
        </Text>
      </LinearGradient>

      {/* 📊 METRICS GRID ROW */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏳</Text>
          <Text style={styles.statNum}>{counts.pending}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔄</Text>
          <Text style={styles.statNum}>{counts.accepted}</Text>
          <Text style={styles.statLbl}>Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statNum}>{counts.done}</Text>
          <Text style={styles.statLbl}>Completed</Text>
        </View>
      </View>

      {/* 📋 ASSIGNED TASKS CONTAINER SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✅ Assigned Tasks ({tasks.length})</Text>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={[styles.priorityIndicator, { backgroundColor: task.priority === 'high' ? COLORS.danger : COLORS.warning }]} />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskMeta}>{task.location} • By: {task.createdBy}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: task.status === 'accepted' ? COLORS.info : COLORS.warning }]}>
                  <Text style={styles.badgeText}>{task.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons with Feature Guard Logic matching Web */}
            <View style={styles.taskActions}>
              {task.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnPrimary]}
                  onPress={() => {
                    if (!checkedIn || !buildingAccess) {
                      Alert.alert('Access Denied', '🔒 You must Check In and Access Building before handling tasks.');
                      return;
                    }
                    updateTaskStatus(task.id, 'accepted');
                  }}
                >
                  <Text style={styles.actionBtnText}>Accept</Text>
                </TouchableOpacity>
              )}
              {task.status === 'accepted' && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnSuccess]}
                  onPress={() => updateTaskStatus(task.id, 'done')}
                >
                  <Text style={styles.actionBtnText}>Done ✓</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

// --- Stylesheet reflecting CSS constraints ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 14 },
  shiftCard: { borderRadius: 12, padding: 16, marginBottom: 16 },
  cardHeaderTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  stepText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '600' },
  stepActive: { color: COLORS.warning, fontWeight: '800' },
  stepDone: { color: COLORS.success, textDecorationLine: 'line-through' },
  arrow: { color: 'rgba(255,255,255,0.3)' },
  btnRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, minWidth: 90, alignItems: 'center', justifyContent: 'center' },
  btnSuccess: { backgroundColor: COLORS.success },
  btnWarning: { backgroundColor: COLORS.warning },
  btnOutline: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  shiftInfo: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginVertical: 4 },
  gpsConfigText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statNum: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  statLbl: { fontSize: 11, color: COLORS.textMuted },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginBottom: 12 },
  taskCard: { flexDirection: 'row', backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 10, position: 'relative', overflow: 'hidden' },
  priorityIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  taskInfo: { flex: 2, paddingLeft: 6 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
  taskMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  taskActions: { flex: 1, justifyContent: 'center', alignItems: 'flex-end' },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  btnPrimary: { backgroundColor: COLORS.info }
});