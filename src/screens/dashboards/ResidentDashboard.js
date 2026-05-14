import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
// Assuming theme.js exports primary, secondary, danger, success, and background colors
import theme from '../../constants/theme';

export default function ResidentDashboard({ navigation }) {
  // Page Navigation Tab State
  const [activeTab, setActiveTab] = useState('home');

  // Core Data States
  const [user, setUser] = useState({ name: 'Resident User', apartment: 'B-202', email: 'resident@mygate.com' });
  const [visitors, setVisitors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);

  // New Task Form Fields
  const [rtTitle, setRtTitle] = useState('');
  const [rtDesc, setRtDesc] = useState('');
  const [rtTo, setRtTo] = useState('maid');
  const [rtName, setRtName] = useState('');
  const [rtPriority, setRtPriority] = useState('medium');
  const [rtDue, setRtDue] = useState('');

  // New Maid Booking Form Fields
  const [bmName, setBmName] = useState('');
  const [bmPhone, setBmPhone] = useState('');
  const [bmScheduled, setBmScheduled] = useState('');

  // New Complaint Form Fields
  const [cSubject, setCSubject] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cCategory, setCCategory] = useState('Noise Complaint');

  // SOS Message Field
  const [sosMessage, setSosMessage] = useState('');

  // Mock API Fetch wrapper mirroring your web `apiFetch`
  const apiFetch = async (url, options = {}) => {
    // Replace this logic with your actual project Axios/Fetch base utility instance
    console.log(`Fetching: ${url}`, options);
    return { success: true, data: {} };
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Mirroring your web backend endpoint architectures
      // await Promise.all([loadVisitors(), loadTasks(), loadMaintenance(), loadStaff()]);

      // Seed Mock Data matching web markup schemas for standalone operation:
      setVisitors([
        { id: 1, name: 'Rahul Kumar', reason_of_visit: 'Delivery', registered_at: '10:30 AM', status: 'pending', apartment_number: 'B-202' },
        { id: 2, name: 'Amit Sharma', reason_of_visit: 'Guest', registered_at: 'Yesterday', status: 'approved', apartment_number: 'B-202' }
      ]);
      setTasks([
        { id: 1, title: 'Clean Balcony', assignedName: 'Sunita', description: 'Deep clean', dueDate: '2026-05-15', priority: 'medium', status: 'pending' }
      ]);
      setMaintenance([
        { id: 1, title: 'Lift Maintenance', area: 'Tower B', description: 'Passenger lift closed 2 PM to 5 PM', severity: 'high', createdAt: 'Today' }
      ]);
      setStaff([
        { id: 1, name: 'Sunita Devi', type: 'Maid', entry_time: '08:15 AM', exit_time: null }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to synchronize dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  // ── CORE ACTION HANDLERS ──────────────────────────────────────────

  const handleVisitorStatus = async (id, status) => {
    await apiFetch(`/api/v2/admin/visitors/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    Alert.alert('Success', `Visitor ${status} successfully.`);
  };

  const handleAssignTask = async () => {
    if (!rtTitle.trim()) { Alert.alert('Validation', 'Task Title is mandatory.'); return; }
    const body = { title: rtTitle, description: rtDesc, assignTo: rtTo, assignedName: rtName, priority: rtPriority, dueDate: rtDue, location: user.apartment, createdBy: 'resident' };

    await apiFetch('/api/v2/tasks', { method: 'POST', body: JSON.stringify(body) });
    setTasks(prev => [...prev, { id: Date.now(), ...body, status: 'pending' }]);

    // Clear & close
    setRtTitle(''); setRtDesc(''); setRtName(''); setRtDue('');
    setTaskModalVisible(false);
    Alert.alert('Success', 'Task delegated to staff pipeline.');
  };

  const handleBookMaid = async () => {
    if (!bmName.trim()) { Alert.alert('Validation', 'Maid name is required.'); return; }
    const bookingBody = { name: bmName, phone: bmPhone, flat: user.apartment, apartment: user.apartment, scheduledAt: bmScheduled };

    await apiFetch('/api/v2/resident/hire-maid', { method: 'POST', body: JSON.stringify(bookingBody) });

    // Auto-generate underlying staff notification task card as done on web
    const taskBody = { title: `Maid visit — Flat ${user.apartment}`, description: `Booked Resident Maid. Ph: ${bmPhone}`, assignTo: 'maid', assignedName: bmName, priority: 'medium', dueDate: bmScheduled, location: user.apartment, createdBy: 'resident' };
    await apiFetch('/api/v2/tasks', { method: 'POST', body: JSON.stringify(taskBody) });

    setStaff(prev => [...prev, { id: Date.now(), name: bmName, type: 'Maid', entry_time: 'Scheduled: ' + bmScheduled, exit_time: null }]);
    setBmName(''); setBmPhone(''); setBmScheduled('');
    Alert.alert('Booking Confirmed', 'Maid appointment created successfully.');
  };

  const handleSendSOS = async () => {
    await apiFetch('/api/v2/sos', { method: 'POST', body: JSON.stringify({ resident: user.name, flat: user.apartment, message: sosMessage || 'Emergency! Please send help.' }) });
    setSosModalVisible(false);
    setSosMessage('');
    Alert.alert('🚨 CRITICAL ALERT SENT', 'Emergency dispatch broadcasted directly to Security Desk and Admin Command.');
  };

  const handleFileComplaint = () => {
    if (!cSubject.trim()) { Alert.alert('Validation', 'Subject heading missing.'); return; }
    const newComplaint = { id: Date.now(), subject: cSubject, description: cDesc, category: cCategory, createdAt: new Date().toLocaleDateString() };
    setComplaints(prev => [newComplaint, ...prev]);
    setCSubject(''); setCDesc('');
    Alert.alert('Filed Successfully', 'Ticket raised with Community Management.');
  };

  // ── RENDER SUB-PAGES ──────────────────────────────────────────────

  const renderHomeTab = () => {
    const pendingVisitors = visitors.filter(v => v.status === 'pending');
    return (
      <View>
        {/* SOS BANNER */}
        <View style={styles.sosPanel}>
          <Text style={styles.sosTitle}>🆘 Emergency SOS</Text>
          <Text style={styles.sosDesc}>Press below for instant emergency help. Alerts Admin & all Station Guards.</Text>
          <TouchableOpacity style={styles.sosButton} onPress={() => setSosModalVisible(true)}>
            <Text style={styles.sosBtnText}>🆘 SEND SOS EMERGENCY ALERT</Text>
          </TouchableOpacity>
        </View>

        {/* QUICK STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNum}>{visitors.length}</Text>
            <Text style={styles.statLbl}>Visitors Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNum}>{tasks.filter(t => t.status !== 'done').length}</Text>
            <Text style={styles.statLbl}>Active Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔧</Text>
            <Text style={styles.statNum}>{staff.filter(s => !s.exit_time).length}</Text>
            <Text style={styles.statLbl}>Staff Inside</Text>
          </View>
        </View>

        {/* PENDING APPROVALS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Pending Visitor Approvals</Text>
          {pendingVisitors.length === 0 ? (
            <Text style={styles.emptyText}>No pending visitor requests.</Text>
          ) : (
            pendingVisitors.map(v => (
              <View key={v.id} style={styles.approvalItem}>
                <View>
                  <Text style={styles.approvalName}>{v.name}</Text>
                  <Text style={styles.approvalMeta}>{v.reason_of_visit} • {v.registered_at}</Text>
                </View>
                <View style={styles.actionRowGap}>
                  <TouchableOpacity style={[styles.inlineBtn, styles.btnSuccess]} onPress={() => handleVisitorStatus(v.id, 'approved')}>
                    <Text style={styles.inlineBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.inlineBtn, styles.btnDanger]} onPress={() => handleVisitorStatus(v.id, 'denied')}>
                    <Text style={styles.inlineBtnText}>Deny</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  const renderVisitorsTab = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>👥 Visitor Log Book</Text>
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>Guards pre-authenticate and clock arriving vehicles here. Authorize access instantly.</Text>
      </View>
      {visitors.map(v => (
        <View key={v.id} style={styles.tableRowSim}>
          <View>
            <Text style={styles.rowBoldText}>{v.name}</Text>
            <Text style={styles.rowSubText}>{v.reason_of_visit} • {v.registered_at}</Text>
          </View>
          <View style={[styles.badge, styles[`badge_${v.status}`]]}>
            <Text style={styles.badgeText}>{v.status.toUpperCase()}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTasksTab = () => (
    <View style={styles.card}>
      <View style={styles.cardHeaderFlex}>
        <Text style={styles.cardTitle}>✅ Domestic Task Delegation</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => setTaskModalVisible(true)}>
          <Text style={styles.btnText}>+ Assign Task</Text>
        </TouchableOpacity>
      </View>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>No active house tasks assigned.</Text>
      ) : (
        tasks.map(t => (
          <View key={t.id} style={styles.taskCardItem}>
            <View style={[styles.priorityTag, styles[`priority_${t.priority}`]]} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text style={styles.rowBoldText}>{t.title}</Text>
              <Text style={styles.rowSubText}>Assigned to: {t.assignedName} ({t.assignTo})</Text>
              <Text style={styles.rowSubText}>{t.description} • Due: {t.dueDate}</Text>
            </View>
            <View style={[styles.badge, styles.badge_pending]}>
              <Text style={styles.badgeText}>{t.status}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderMaidTab = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🧹 Book Premium Utility Maid</Text>
      <View style={styles.successBanner}>
        <Text style={styles.successBannerText}>Input explicit scheduling constraints. Bookings feed automatically to Gate Security logs.</Text>
      </View>

      <Text style={styles.fieldLabel}>Maid Full Name</Text>
      <TextInput style={styles.input} placeholder="e.g. Sunita Devi" value={bmName} onChangeText={setBmName} />

      <Text style={styles.fieldLabel}>Contact Phone Number</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" placeholder="e.g. 9876543210" value={bmPhone} onChangeText={setBmPhone} />

      <Text style={styles.fieldLabel}>Target Date & Time Slot</Text>
      <TextInput style={styles.input} placeholder="e.g. 2026-05-16 09:00 AM" value={bmScheduled} onChangeText={setBmScheduled} />

      <TouchableOpacity style={styles.btnPrimaryLong} onPress={handleBookMaid}>
        <Text style={styles.btnTextLong}>🧹 Confirm Household Booking</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBillsTab = () => (
    <View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: '#ef4444', borderLeftWidth: 4 }]}>
          <Text style={styles.statNum}>₹2,800</Text>
          <Text style={styles.statLbl}>Maintenance Due</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#f97316', borderLeftWidth: 4 }]}>
          <Text style={styles.statNum}>₹1,450</Text>
          <Text style={styles.statLbl}>Electricity</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#3b82f6', borderLeftWidth: 4 }]}>
          <Text style={styles.statNum}>₹380</Text>
          <Text style={styles.statLbl}>Water Bill</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Invoice Ledger Balance</Text>

        <View style={styles.tableRowSim}>
          <View>
            <Text style={styles.rowBoldText}>Society Maintenance (May)</Text>
            <Text style={styles.rowSubText}>Due: 01 Jun 2026</Text>
          </View>
          <TouchableOpacity style={[styles.inlineBtn, styles.btnPrimary]} onPress={() => Alert.alert('Gateway Integration', 'Redirecting to payment gateway standard processing...')}>
            <Text style={styles.inlineBtnText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableRowSim}>
          <View>
            <Text style={styles.rowBoldText}>Grid Electricity Bill</Text>
            <Text style={styles.rowSubText}>Due: 15 May 2026</Text>
          </View>
          <Text style={[styles.badgeText, { color: '#b45309' }]}>Due Soon</Text>
        </View>
      </View>
    </View>
  );

  const renderComplaintsTab = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📝 Lodge Management Escalation</Text>

      <Text style={styles.fieldLabel}>Subject / Topic Heading</Text>
      <TextInput style={styles.input} placeholder="e.g. Low water pressure / Parking blockage" value={cSubject} onChangeText={setCSubject} />

      <Text style={styles.fieldLabel}>Core Details / Description</Text>
      <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={3} placeholder="Provide descriptive context..." value={cDesc} onChangeText={setCDesc} />

      <TouchableOpacity style={styles.btnPrimaryLong} onPress={handleFileComplaint}>
        <Text style={styles.btnTextLong}>Submit Ticket</Text>
      </TouchableOpacity>

      {complaints.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subHeading}>Past Logged Grievances</Text>
          {complaints.map(item => (
            <View key={item.id} style={styles.complaintTicket}>
              <Text style={styles.rowBoldText}>{item.subject}</Text>
              <Text style={styles.rowSubText}>{item.description}</Text>
              <Text style={styles.ticketDate}>{item.createdAt} • <Text style={{ color: '#b45309' }}>Status: Open</Text></Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* GLOBAL TOPBAR PROFILE HEADER */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topbarAppName}>MyGate</Text>
          <Text style={styles.topbarSub}>Flat {user.apartment} • Resident Hub</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
      </View>

      {/* CORE DISPLAY SCROLL CONTROLLER */}
      {loading ? (
        <ActivityIndicator size="large" color="#1d4ed8" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.contentBody} showsVerticalScrollIndicator={false}>
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'visitors' && renderVisitorsTab()}
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'bookmaid' && renderMaidTab()}
          {activeTab === 'bills' && renderBillsTab()}
          {activeTab === 'complaints' && renderComplaintsTab()}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* HORIZONTAL TAB NAVIGATION DOCK BAR */}
      <View style={styles.tabDockBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'home' && styles.dockItemActive]} onPress={() => setActiveTab('home')}>
            <Text style={styles.dockIcon}>🏠</Text><Text style={styles.dockText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'visitors' && styles.dockItemActive]} onPress={() => setActiveTab('visitors')}>
            <Text style={styles.dockIcon}>👥</Text><Text style={styles.dockText}>Visitors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'tasks' && styles.dockItemActive]} onPress={() => setActiveTab('tasks')}>
            <Text style={styles.dockIcon}>✅</Text><Text style={styles.dockText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'bookmaid' && styles.dockItemActive]} onPress={() => setActiveTab('bookmaid')}>
            <Text style={styles.dockIcon}>🧹</Text><Text style={styles.dockText}>Maid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'bills' && styles.dockItemActive]} onPress={() => setActiveTab('bills')}>
            <Text style={styles.dockIcon}>💰</Text><Text style={styles.dockText}>Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'complaints' && styles.dockItemActive]} onPress={() => setActiveTab('complaints')}>
            <Text style={styles.dockIcon}>📝</Text><Text style={styles.dockText}>Issues</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* TASK DELEGATION MODAL SHEET */}
      <Modal visible={taskModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalHeaderTitle}>Assign Domestic Task</Text>

            <TextInput style={styles.input} placeholder="Task Headline (e.g. Clean Bathrooms)" value={rtTitle} onChangeText={setRtTitle} />
            <TextInput style={styles.input} placeholder="Detailed Requirements/Instructions" value={rtDesc} onChangeText={setRtDesc} />
            <TextInput style={styles.input} placeholder="Staff Executive Name" value={rtName} onChangeText={setRtName} />
            <TextInput style={styles.input} placeholder="Due Date (YYYY-MM-DD)" value={rtDue} onChangeText={setRtDue} />

            <View style={styles.actionRowGap}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#6b7280' }]} onPress={() => setTaskModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#1d4ed8' }]} onPress={handleAssignTask}>
                <Text style={styles.btnText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SOS EMERGENCY CONFIRMATION MODAL */}
      <Modal visible={sosModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 44 }}>🆘</Text>
            <Text style={styles.sosTitle}>Confirm Emergency SOS</Text>
            <Text style={[styles.sosDesc, { textAlign: 'center' }]}>This instantly issues notifications to all Community Guards on patrol duty. Use strictly for legitimate emergencies.</Text>

            <TextInput style={[styles.input, { width: '100%' }]} placeholder="Optional emergency message note..." value={sosMessage} onChangeText={setSosMessage} />

            <View style={styles.actionRowGap}>
              <TouchableOpacity style={[styles.inlineBtn, { backgroundColor: '#9ca3af', paddingHorizontal: 20 }]} onPress={() => setSosModalVisible(false)}>
                <Text style={styles.btnText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.inlineBtn, { backgroundColor: '#dc2626', paddingHorizontal: 20 }]} onPress={handleSendSOS}>
                <Text style={styles.btnText}>🚨 Trigger SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── COMPREHENSIVE STYLE DECK ───────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  topbar: { height: 75, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingTop: 10 },
  topbarAppName: { fontSize: 20, fontWeight: '800', color: '#111827' },
  topbarSub: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  contentBody: { flex: 1, padding: 14 },

  // SOS Panel
  sosPanel: { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 2, borderRadius: 14, padding: 16, marginBottom: 16 },
  sosTitle: { fontSize: 18, fontWeight: '800', color: '#991b1b', marginBottom: 4 },
  sosDesc: { fontSize: 13, color: '#b91c1c', marginBottom: 12, lineHeight: 18 },
  sosButton: { backgroundColor: '#dc2626', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  sosBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  // Cards layout
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeaderFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 10 },
  subHeading: { fontSize: 14, fontWeight: '700', color: '#374151', marginTop: 10, marginBottom: 8 },
  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', paddingVertical: 12 },

  // Stats Row
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 10, padding: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statIcon: { fontSize: 20, marginBottom: 2 },
  statNum: { fontSize: 18, fontWeight: '800', color: '#111827' },
  statLbl: { fontSize: 11, color: '#6b7280', fontWeight: '500', marginTop: 1 },

  // Forms & Inputs
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#4b5563', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginBottom: 10, color: '#111827' },
  textArea: { height: 70, textAlignVertical: 'top' },
  btnPrimary: { backgroundColor: '#1d4ed8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnPrimaryLong: { backgroundColor: '#1d4ed8', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
  btnTextLong: { color: '#ffffff', fontWeight: '700', fontSize: 14 },

  // Tab Dock
  tabDockBar: { height: 65, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 6 },
  dockItem: { paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginHorizontal: 4 },
  dockItemActive: { backgroundColor: '#eff6ff' },
  dockIcon: { fontSize: 18 },
  dockText: { fontSize: 11, fontWeight: '600', color: '#4b5563', marginTop: 2 },

  // Interactive Row Components
  approvalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  approvalName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  approvalMeta: { fontSize: 12, color: '#6b7280' },
  actionRowGap: { flexDirection: 'row', gap: 6 },
  inlineBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, justifyContent: 'center' },
  btnSuccess: { backgroundColor: '#16a34a' },
  btnDanger: { backgroundColor: '#dc2626' },
  inlineBtnText: { color: '#ffffff', fontWeight: '#600', fontSize: 12 },

  // Simulated Table Elements
  tableRowSim: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowBoldText: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  rowSubText: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  // Banners
  infoBanner: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 },
  infoBannerText: { color: '#1d4ed8', fontSize: 12, lineHeight: 16 },
  successBanner: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 },
  successBannerText: { color: '#166534', fontSize: 12, lineHeight: 16 },

  // Badges
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badge_pending: { backgroundColor: '#fef3c7' },
  badge_approved: { backgroundColor: '#dcfce7' },
  badge_denied: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#374151' },

  // Tasks elements
  taskCardItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  priorityTag: { width: 5, height: '100%', borderRadius: 2 },
  priority_high: { backgroundColor: '#dc2626' },
  priority_medium: { backgroundColor: '#eab308' },
  priority_low: { backgroundColor: '#16a34a' },

  // Complaints elements
  complaintTicket: { backgroundColor: '#f9fafb', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  ticketDate: { fontSize: 11, color: '#9ca3af', marginTop: 4 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContentCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 14 },
  modalButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' }
});