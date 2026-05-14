// src/screens/dashboards/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import Header from '../../components/Header'; // Using your existing Header component

// Mocking the apiFetch and toast logic from your web dashboard's shared.js
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`https://your-api-base-url.com${url}`, options);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export default function AdminDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    visitors: 0,
    staffOnDuty: 0,
    maintenanceAlerts: 0,
    activeSOS: 0,
    residents: 0,
    pendingTasks: 0,
    patrolLogs: 0,
    devicesOnline: 0,
  });

  const [sosAlerts, setSosAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staffLog, setStaffLog] = useState([]);

  useEffect(() => {
    loadDashboardData();

    // Polling intervals matching your web dashboard configuration
    const sosInterval = setInterval(() => loadSOSAndOverview(), 30000);
    const staffInterval = setInterval(() => loadStaffData(), 20000);

    return () => {
      clearInterval(sosInterval);
      clearInterval(staffInterval);
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([loadSOSAndOverview(), loadStaffData(), loadTasks()]);
    setLoading(false);
  };

  const loadSOSAndOverview = async () => {
    const d = await apiFetch('/api/v2/sos');
    const alerts = d?.data?.alerts || [];
    setSosAlerts(alerts);

    // Fallback to calculate stats from lists locally if needed, or update via a general overview endpoint
    const activeSosCount = alerts.filter(s => s.status === 'active').length;
    setStats(prev => ({ ...prev, activeSOS: activeSosCount }));
  };

  const loadStaffData = async () => {
    let d = await apiFetch('/api/v2/admin/staff');
    if (!d || !d.data || !d.data.staff) {
      d = await apiFetch('/api/v2/staff/today');
    }
    const staff = d?.data?.staff || [];
    setStaffLog(staff);

    const onDutyCount = staff.filter(s => !(s.exit_time || s.check_out)).length;
    setStats(prev => ({ ...prev, staffOnDuty: onDutyCount }));
  };

  const loadTasks = async () => {
    const d = await apiFetch('/api/v2/tasks');
    const taskList = d?.data?.tasks || [];
    setTasks(taskList);

    const pendingCount = taskList.filter(t => t.status === 'pending').length;
    setStats(prev => ({ ...prev, pendingTasks: pendingCount }));
  };

  const resolveSOS = async (id) => {
    await apiFetch(`/api/v2/sos/${id}/resolve`, { method: 'PUT' });
    Alert.alert("Success", "SOS resolved ✅");
    loadSOSAndOverview();
  };

  // Helper formatting to replicate India locale time strings from web layout
  const fmtStaffTime = (t) => {
    if (!t) return '—';
    try {
      const d = new Date(t);
      if (isNaN(d)) return t;
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return t;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showAvatar={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ── EMERGENCY BANNER REGION ─────────────────────────── */}
        {sosAlerts.filter(s => s.status === 'active').slice(0, 1).map(s => (
          <View key={s.id} style={styles.sosBanner}>
            <View style={styles.bannerRow}>
              <Text style={styles.bannerIcon}>🆘</Text>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Emergency SOS — {s.resident}, Flat {s.flat || '—'}</Text>
                <Text style={styles.bannerBody}>{s.message || ''}</Text>
              </View>
              <TouchableOpacity style={styles.bannerBtn} onPress={() => resolveSOS(s.id)}>
                <Text style={styles.bannerBtnText}>Resolve</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ── METRICS GRID (2 Columns Adaptive Row) ───────────── */}
        <View style={styles.grid}>
          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#f3e8ff', color: '#a855f7' }]}>👥</Text>
            <View>
              <Text style={styles.statNum}>{stats.visitors}</Text>
              <Text style={styles.statLabel}>Today's Visitors</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#dcfce7', color: '#16a34a' }]}>👷</Text>
            <View>
              <Text style={styles.statNum}>{stats.staffOnDuty}</Text>
              <Text style={styles.statLabel}>Staff On Duty</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#ffedd5', color: '#ea580c' }]}>🔨</Text>
            <View>
              <Text style={styles.statNum}>{stats.maintenanceAlerts}</Text>
              <Text style={styles.statLabel}>Maint. Alerts</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statIcon, { backgroundColor: '#ffeeec', color: '#ef4444' }]}>🆘</Text>
            <View>
              <Text style={styles.statNum}>{stats.activeSOS}</Text>
              <Text style={styles.statLabel}>Active SOS</Text>
            </View>
          </View>
        </View>

        {/* ── RECENT TASKS PANEL ──────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📋 Recent Tasks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('StaffListScreen')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks yet.</Text>
          ) : (
            tasks.slice(0, 3).map(item => (
              <View key={item.id} style={styles.taskItem}>
                <View style={[styles.priorityIndicator, { backgroundColor: item.priority === 'high' ? '#ef4444' : '#eab308' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitleText}>{item.title}</Text>
                  <Text style={styles.taskMetaText}>→ {item.assignedName || item.assignTo} • {item.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── MAID & STAFF ENTRY LOG TABLE ───────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🧹👷 Staff Entry Log – Today</Text>
          </View>

          {/* Table Header Row */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Name</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Flat</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>In</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Out</Text>
          </View>

          {/* Table Body Rows */}
          {staffLog.length === 0 ? (
            <Text style={styles.emptyText}>No staff entries today.</Text>
          ) : (
            staffLog.map(item => {
              const checkedOut = !!(item.exit_time || item.check_out);
              return (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellBold, { flex: 2 }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {item.resident_id || item.flat || '—'}
                  </Text>
                  <Text style={[styles.tableCellTime, { flex: 1.5, color: '#16a34a' }]}>
                    {fmtStaffTime(item.entry_time || item.check_in)}
                  </Text>
                  <Text style={[styles.tableCellTime, { flex: 1.5, color: checkedOut ? '#ef4444' : '#9ca3af' }]}>
                    {checkedOut ? fmtStaffTime(item.exit_time || item.check_out) : 'Inside'}
                  </Text>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  /* SOS Banner Alert */
  sosBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991b1b',
  },
  bannerBody: {
    fontSize: 12,
    color: '#7f1d1d',
    marginTop: 2,
  },
  bannerBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  /* Grid Layouts */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: 18,
    marginRight: 10,
    overflow: 'hidden',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  /* Standard Container Card Layouts */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8,
  },
  /* Tasks Row List Items */
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 10,
  },
  taskTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  taskMetaText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  /* Adaptive Layout Flex Table Elements */
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  tableCellBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  tableCell: {
    fontSize: 13,
    color: '#4b5563',
  },
  tableCellTime: {
    fontSize: 12,
    fontWeight: '600',
  },
});