// src/screens/dashboards/ResidentDashboard.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform
} from 'react-native';

export default function ResidentDashboard({ navigation, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [user] = useState({ name: 'Resident User', apartment: 'B-202' });
  const [visitors, setVisitors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);

  // Form Inputs
  const [rtTitle, setRtTitle] = useState('');
  const [rtDesc, setRtDesc] = useState('');
  const [rtTo, setRtTo] = useState('maid');
  const [rtName, setRtName] = useState('');
  const [rtPriority, setRtPriority] = useState('medium');
  const [rtDue, setRtDue] = useState('');
  const [bmName, setBmName] = useState('');
  const [bmPhone, setBmPhone] = useState('');
  const [bmScheduled, setBmScheduled] = useState('');
  const [cSubject, setCSubject] = useState('');
  const [cDesc, setCDesc] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setLoading(true);
    setVisitors([
      { id: 1, name: 'Rahul Kumar', reason_of_visit: 'Delivery', registered_at: '10:30 AM', status: 'pending', apartment_number: 'B-202' },
      { id: 2, name: 'Amit Sharma', reason_of_visit: 'Guest', registered_at: 'Yesterday', status: 'approved', apartment_number: 'B-202' }
    ]);
    setTasks([
      { id: 1, title: 'Clean Balcony', assignedName: 'Sunita', description: 'Deep clean', dueDate: '2026-05-15', priority: 'medium', status: 'pending' }
    ]);
    setStaff([
      { id: 1, name: 'Sunita Devi', type: 'Maid', entry_time: '08:15 AM', exit_time: null }
    ]);
    setLoading(false);
  };

  const handleVisitorStatus = (id, status) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    Alert.alert('Success', `Visitor ${status} successfully.`);
  };

  const handleAssignTask = () => {
    if (!rtTitle.trim()) { Alert.alert('Validation', 'Task Title is mandatory.'); return; }
    const body = { title: rtTitle, description: rtDesc, assignTo: rtTo, assignedName: rtName, priority: rtPriority, dueDate: rtDue, status: 'pending' };
    setTasks(prev => [...prev, { id: Date.now(), ...body }]);
    setTaskModalVisible(false);
    setRtTitle(''); setRtDesc(''); setRtName(''); setRtDue('');
  };

  const handleBookMaid = () => {
    if (!bmName.trim()) { Alert.alert('Validation', 'Maid name is required.'); return; }
    setStaff(prev => [...prev, { id: Date.now(), name: bmName, type: 'Maid', entry_time: 'Scheduled: ' + bmScheduled, exit_time: null }]);
    setBmName(''); setBmPhone(''); setBmScheduled('');
    Alert.alert('Booking Confirmed', 'Maid appointment created.');
  };

  const handleSendSOS = () => {
    setSosModalVisible(false);
    Alert.alert('🚨 SOS SENT', 'Emergency broadcasted to Gate Security.');
  };

  const handleFileComplaint = () => {
    if (!cSubject.trim()) { Alert.alert('Validation', 'Subject heading missing.'); return; }
    setComplaints(prev => [{ id: Date.now(), subject: cSubject, description: cDesc, createdAt: 'Today' }, ...prev]);
    setCSubject(''); setCDesc('');
    Alert.alert('Filed Successfully', 'Ticket raised.');
  };

  const renderHomeTab = () => {
    const pendingVisitors = visitors.filter(v => v.status === 'pending');
    return (
      <View>
        <View style={styles.sosPanel}>
          <Text style={styles.sosTitle}>🆘 Emergency SOS</Text>
          <Text style={styles.sosDesc}>Press below for instant emergency help. Alerts Admin & Guards.</Text>
          <TouchableOpacity style={styles.sosButton} onPress={() => setSosModalVisible(true)}>
            <Text style={styles.sosBtnText}>🆘 SEND SOS EMERGENCY ALERT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNum}>{visitors.length}</Text><Text style={styles.statLbl}>Visitors</Text></View>
          <View style={styles.statCard}><Text style={styles.statNum}>{tasks.length}</Text><Text style={styles.statLbl}>Active Tasks</Text></View>
          <View style={styles.statCard}><Text style={styles.statNum}>{staff.length}</Text><Text style={styles.statLbl}>Staff Inside</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Pending Visitor Approvals</Text>
          {pendingVisitors.length === 0 ? (
            <Text style={styles.emptyText}>No pending requests.</Text>
          ) : (
            pendingVisitors.map(v => (
              <View key={v.id} style={styles.approvalItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowBoldText}>{v.name}</Text>
                  <Text style={styles.rowSubText}>{v.reason_of_visit} • {v.registered_at}</Text>
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

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      <View style={styles.statusBarSpacer} />

      {/* HEADER TOPBAR */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topbarAppName}>MyGate</Text>
          <Text style={styles.topbarSub}>Flat {user.apartment} • Resident Hub</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => navigation.navigate('ProfileScreen')}
          activeOpacity={0.7}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.avatarText}>U</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#094c4c" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={styles.contentBody} showsVerticalScrollIndicator={false}>
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'visitors' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>👥 Visitor Log Book</Text>
              {visitors.map(v => (
                <View key={v.id} style={styles.tableRowSim}>
                  <View><Text style={styles.rowBoldText}>{v.name}</Text><Text style={styles.rowSubText}>{v.reason_of_visit}</Text></View>
                  <Text style={styles.rowBoldText}>{v.status.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === 'tasks' && (
            <View style={styles.card}>
              <View style={styles.cardHeaderFlex}>
                <Text style={styles.cardTitle}>✅ Household Tasks</Text>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setTaskModalVisible(true)}>
                  <Text style={styles.btnText}>+ Assign</Text>
                </TouchableOpacity>
              </View>
              {tasks.map(t => (
                <View key={t.id} style={styles.tableRowSim}>
                  <View><Text style={styles.rowBoldText}>{t.title}</Text><Text style={styles.rowSubText}>{t.assignedName}</Text></View>
                </View>
              ))}
            </View>
          )}
          {activeTab === 'bookmaid' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧹 Book Utility Maid</Text>
              <TextInput style={styles.input} placeholder="Maid Name" value={bmName} onChangeText={setBmName} placeholderTextColor="#999" />
              <TextInput style={styles.input} placeholder="Phone" value={bmPhone} onChangeText={setBmPhone} keyboardType="phone-pad" placeholderTextColor="#999" />
              <TouchableOpacity style={styles.btnPrimaryLong} onPress={handleBookMaid}>
                <Text style={styles.btnTextLong}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeTab === 'complaints' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📝 Raise Management Complaint</Text>
              <TextInput style={styles.input} placeholder="Subject Heading" value={cSubject} onChangeText={setCSubject} placeholderTextColor="#999" />
              <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Describe details..." value={cDesc} onChangeText={setCDesc} placeholderTextColor="#999" />
              <TouchableOpacity style={styles.btnPrimaryLong} onPress={handleFileComplaint}>
                <Text style={styles.btnTextLong}>Submit Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* BOTTOM TAB DOCK NAVIGATION */}
      <View style={styles.tabDockBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'home' && styles.dockItemActive]} onPress={() => setActiveTab('home')}>
            <Text style={styles.dockText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'visitors' && styles.dockItemActive]} onPress={() => setActiveTab('visitors')}>
            <Text style={styles.dockText}>👥 Visitors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'tasks' && styles.dockItemActive]} onPress={() => setActiveTab('tasks')}>
            <Text style={styles.dockText}>✅ Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'bookmaid' && styles.dockItemActive]} onPress={() => setActiveTab('bookmaid')}>
            <Text style={styles.dockText}>🧹 Maid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dockItem, activeTab === 'complaints' && styles.dockItemActive]} onPress={() => setActiveTab('complaints')}>
            <Text style={styles.dockText}>📝 Issues</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* TASK DELEGATION MODAL */}
      <Modal visible={taskModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalHeaderTitle}>Assign Task</Text>
            <TextInput style={styles.input} placeholder="Task Title" value={rtTitle} onChangeText={setRtTitle} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Instructions" value={rtDesc} onChangeText={setRtDesc} placeholderTextColor="#999" />
            <View style={styles.actionRowGap}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#6b7280' }]} onPress={() => setTaskModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#094c4c' }]} onPress={handleAssignTask}>
                <Text style={styles.btnText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SOS MODAL */}
      <Modal visible={sosModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { alignItems: 'center' }]}>
            <Text style={styles.cardTitle}>Confirm Emergency SOS</Text>
            <View style={styles.actionRowGap}>
              <TouchableOpacity style={[styles.inlineBtn, { backgroundColor: '#9ca3af' }]} onPress={() => setSosModalVisible(false)}>
                <Text style={styles.btnText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.inlineBtn, { backgroundColor: '#dc2626' }]} onPress={handleSendSOS}>
                <Text style={styles.btnText}>Trigger SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: { flex: 1, backgroundColor: '#f3f4f6' },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  topbar: {
    height: 65,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    zIndex: 99,
    elevation: 5
  },
  topbarAppName: { fontSize: 22, fontWeight: '800', color: '#094c4c' },
  topbarSub: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#094c4c',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  contentBody: { flex: 1, padding: 14 },
  sosPanel: { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 2, borderRadius: 14, padding: 16, marginBottom: 16 },
  sosTitle: { fontSize: 18, fontWeight: '800', color: '#991b1b' },
  sosDesc: { fontSize: 13, color: '#b91c1c', marginVertical: 6 },
  sosButton: { backgroundColor: '#dc2626', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  sosBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeaderFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1f2937' },
  emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 10, padding: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#111827' },
  statLbl: { fontSize: 11, color: '#6b7280' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginBottom: 10, color: '#111827' },
  textArea: { height: 70, textAlignVertical: 'top' },
  btnPrimary: { backgroundColor: '#094c4c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnPrimaryLong: { backgroundColor: '#094c4c', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
  btnTextLong: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  tabDockBar: { height: 60, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 8 },
  dockItem: { paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', height: 40, marginHorizontal: 4, borderRadius: 8 },
  dockItemActive: { backgroundColor: '#eef6f6' },
  dockText: { fontSize: 13, fontWeight: '600', color: '#094c4c' },
  approvalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  actionRowGap: { flexDirection: 'row', gap: 6 },
  inlineBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnSuccess: { backgroundColor: '#16a34a' },
  btnDanger: { backgroundColor: '#dc2626' },
  inlineBtnText: { color: '#ffffff', fontWeight: '600' },
  tableRowSim: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowBoldText: { fontSize: 14, fontWeight: '600' },
  rowSubText: { fontSize: 12, color: '#6b7280' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContentCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 20 },
  modalHeaderTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  modalButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' }
});