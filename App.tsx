import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
  Platform
} from 'react-native';

import { sendOtp, verifyOtp } from "./services/api"; // ✅ Backend API Bridge[cite: 2]

const { width } = Dimensions.get('window');

const THEME = {
  navy: '#0F172A',
  slate: '#1E293B',
  emerald: '#10B981',
  amber: '#F59E0B',
  white: '#FFFFFF',
  muted: '#94A3B8',
  red: '#EF4444',
  border: '#334155'
};

export default function MyGateApp() {
  // --- CORE STATE (Original Source 3) ---
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  // Dashboard & Sub-view States
  const [activeTab, setActiveTab] = useState('home'); // home, service_request
  const [guardSubView, setGuardSubView] = useState('home'); // home, register, scan
  const [serviceLogs, setServiceLogs] = useState([
    { id: '1', issue: 'Plumbing', status: 'Resolved', date: '2026-04-28' },
    { id: '2', issue: 'Electrical', status: 'In Progress', date: '2026-04-30' }
  ]);

  // NEW: Approval Flow State
  const [pendingVisitors, setPendingVisitors] = useState([
    { id: '101', name: 'Zomato Delivery', flat: 'B-202', time: 'Just now' }
  ]);

  // --- BACKEND HANDLERS[cite: 1, 2] ---

  const handleSendOtp = async () => {
    if (!userRole || phoneNumber.length !== 10 || !userName.trim()) {
      Alert.alert("Error", "Required: Name, 10-digit Phone, & Role");
      return;
    }
    try {
      const res = await sendOtp(phoneNumber); // Targeted at /api/auth/send-otp
      if (res && res.success) {
        setCurrentStep('otp');
      } else {
        Alert.alert("Error", res.error || "Failed to send OTP");
      }
    } catch (err) {
      Alert.alert("Error", "Backend not reachable at 10.0.2.2:8080");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Enter 6-digit OTP from backend console");
      return;
    }
    try {
      const res = await verifyOtp(phoneNumber, otp); // Targeted at /api/auth/verify-otp[cite: 1]
      if (res && (res.token || res.success)) {
        setCurrentStep('dashboard');
      } else {
        Alert.alert("Error", "Invalid OTP. Check backend logs.");
      }
    } catch (err) {
      Alert.alert("Error", "Verification connection failed");
    }
  };

  const handleExit = () => {
    setCurrentStep('onboarding');
    setUserRole('');
    setUserName('');
    setPhoneNumber('');
    setOtp('');
    setActiveTab('home');
    setGuardSubView('home');
  };

  const submitServiceRequest = (issue: string) => {
    const newRequest = {
      id: Date.now().toString(),
      issue: issue,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setServiceLogs([newRequest, ...serviceLogs]);
    Alert.alert("Request Raised", `Your ${issue} request has been logged.`);
    setActiveTab('home');
  };

  const sharePreApproval = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    Share.share({
      message: `MyGate Secure: Use Passcode ${code} or scan the QR for entry to Flat ${userName}'s residence.`,
    });
  };

  const approveVisitor = (id: string) => {
    setPendingVisitors(pendingVisitors.filter(v => v.id !== id));
    Alert.alert("Visitor Approved", "Access granted to the main gate.");
  };

  // --- UI SCREENS (Restored Layout from Source 3) ---

  if (currentStep === 'onboarding') {
    return (
      <View style={styles.centerBox}>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200' }} style={styles.heroImg} />
      <Text style={styles.brandName}>MyGate Secure</Text>
      <TouchableOpacity style={styles.bigButton} onPress={() => setCurrentStep('login')}>
      <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      </View>
    );
  }

  if (currentStep === 'login') {
    return (
      <View style={styles.authLayout}>
      <Text style={styles.titleLg}>Sign In</Text>
      <View style={styles.cardDark}>
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={THEME.muted} value={userName} onChangeText={setUserName} />
      <TextInput style={styles.input} placeholder="10 Digit Mobile" placeholderTextColor={THEME.muted} keyboardType="numeric" maxLength={10} value={phoneNumber} onChangeText={(val) => setPhoneNumber(val.replace(/[^0-9]/g, ''))} />
      <Text style={styles.labelSmall}>Select Role</Text>
      <View style={styles.roleRow}>
      {['resident', 'guard', 'admin', 'maid', 'staff'].map(role => (
        <TouchableOpacity key={role} style={[styles.tag, userRole === role && styles.tagActive]} onPress={() => setUserRole(role)}>
        <Text style={[styles.tagText, userRole === role && {color: '#fff'}]}>{role.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
      </View>
      <TouchableOpacity style={styles.bigButton} onPress={handleSendOtp}>
      <Text style={styles.buttonText}>Send 6-Digit OTP</Text>
      </TouchableOpacity>
      </View>
      </View>
    );
  }

  if (currentStep === 'otp') {
    return (
      <View style={styles.authLayout}>
      <Text style={styles.titleLg}>Verify OTP</Text>
      <View style={styles.cardDark}>
      <TextInput style={[styles.input, {textAlign: 'center', letterSpacing: 8}]} placeholder="000000" keyboardType="numeric" maxLength={6} value={otp} onChangeText={setOtp} />
      <TouchableOpacity style={styles.bigButton} onPress={handleVerifyOtp}>
      <Text style={styles.buttonText}>Verify & Enter</Text>
      </TouchableOpacity>
      </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
    <StatusBar barStyle="light-content" />
    <View style={styles.navBar}>
    <View><Text style={styles.dashHead}>MyGate</Text><Text style={styles.roleBadge}>{userRole.toUpperCase()}</Text></View>
    <TouchableOpacity onPress={handleExit} style={styles.exitBtn}><Text style={{ color: THEME.red, fontWeight: 'bold' }}>LOGOUT</Text></TouchableOpacity>
    </View>

    <ScrollView style={{ paddingHorizontal: 20 }}>

    {/* RESIDENT DASHBOARD */}
    {userRole === 'resident' && (
      <View>
      {activeTab === 'home' ? (
        <>
        <View style={styles.announcementCard}>
        <Text style={{color: THEME.amber, fontWeight: 'bold'}}>📢 Society Announcement</Text>
        <Text style={{color: '#fff', marginTop: 5}}>Elevator B maintenance scheduled for today.</Text>
        </View>

        {/* NEW: DASHBOARD APPROVAL LIST[cite: 3] */}
        <Text style={styles.subTitle}>Pending Visitor Approvals</Text>
        {pendingVisitors.length > 0 ? (
          pendingVisitors.map(visitor => (
            <View key={visitor.id} style={styles.cardDark}>
            <Text style={styles.cardHeader}>{visitor.name}</Text>
            <Text style={{color: THEME.muted, fontSize: 12, marginBottom: 15}}>Requested Entry to {visitor.flat}</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity style={[styles.bigButton, {flex: 1, backgroundColor: THEME.red}]} onPress={() => setPendingVisitors([])}>
            <Text style={styles.buttonText}>DENY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bigButton, {flex: 1}]} onPress={() => approveVisitor(visitor.id)}>
            <Text style={styles.buttonText}>APPROVE</Text>
            </TouchableOpacity>
            </View>
            </View>
          ))
        ) : (
          <View style={styles.listItem}><Text style={{color: THEME.muted}}>No pending requests.</Text></View>
        )}

        <Text style={styles.subTitle}>Quick Actions</Text>
        <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTab('service_request')}>
        <Text style={{fontSize: 20}}>🛠️</Text>
        <Text style={{color: '#fff', fontSize: 12, marginTop: 5}}>Service Req</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onLongPress={() => Alert.alert("SOS Sent", "Security Alerted")}>
        <Text style={{fontSize: 20}}>🚨</Text>
        <Text style={{color: '#fff', fontSize: 12, marginTop: 5}}>Emergency</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>Pre-Approve Guest</Text>
        <View style={styles.cardDark}>
        <View style={{alignItems: 'center', marginBottom: 15}}>
        <View style={styles.qrPlaceholder}><Text style={{color: '#000', fontWeight: 'bold'}}>QR CODE</Text></View>
        <Text style={[styles.titleLg, {marginTop: 10, letterSpacing: 4}]}>449 201</Text>
        </View>
        <TouchableOpacity style={styles.bigButton} onPress={sharePreApproval}><Text style={styles.buttonText}>Share Invite & QR</Text></TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>Recent Service Logs</Text>
        {serviceLogs.map(log => (
          <View key={log.id} style={styles.listItem}>
          <View><Text style={styles.cardHeader}>{log.issue}</Text><Text style={{color: THEME.muted, fontSize: 11}}>{log.date}</Text></View>
          <Text style={{color: log.status === 'Resolved' ? THEME.emerald : THEME.amber, fontWeight: 'bold'}}>{log.status}</Text>
          </View>
        ))}
        </>
      ) : (
        <View style={styles.cardDark}>
        <TouchableOpacity onPress={() => setActiveTab('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back to Dashboard</Text></TouchableOpacity>
        <Text style={[styles.subTitle, {marginTop: 0}]}>New Service Request</Text>
        <Text style={styles.labelSmall}>Select Issue Type</Text>
        {['Plumbing', 'Electrical', 'Carpentry', 'AC Repair', 'Cleaning'].map(item => (
          <TouchableOpacity key={item} style={styles.selectItem} onPress={() => submitServiceRequest(item)}>
          <Text style={{color: '#fff'}}>{item}</Text>
          <Text style={{color: THEME.emerald}}>+</Text>
          </TouchableOpacity>
        ))}
        </View>
      )}
      </View>
    )}

    {/* GUARD DASHBOARD[cite: 3] */}
    {userRole === 'guard' && (
      <View>
      {guardSubView === 'home' && (
        <>
        <TouchableOpacity style={styles.scanAction} onPress={() => setGuardSubView('scan')}>
        <Text style={styles.scanText}>📷 SCAN QR / ENTER CODE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bigButton, {backgroundColor: THEME.slate}]} onPress={() => setGuardSubView('register')}>
        <Text style={styles.buttonText}>📝 REGISTER NEW VISITOR</Text>
        </TouchableOpacity>
        </>
      )}

      {guardSubView === 'register' && (
        <View style={styles.cardDark}>
        <TouchableOpacity onPress={() => setGuardSubView('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
        <TextInput style={styles.input} placeholder="Visitor Name" placeholderTextColor={THEME.muted} />
        <TextInput style={styles.input} placeholder="Visitor Phone (10 digits)" keyboardType="numeric" maxLength={10} placeholderTextColor={THEME.muted} />
        <TextInput style={styles.input} placeholder="Flat Number" placeholderTextColor={THEME.muted} />
        <TextInput style={styles.input} placeholder="Purpose" placeholderTextColor={THEME.muted} />
        <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity style={[styles.bigButton, {flex: 1, backgroundColor: THEME.amber}]} onPress={() => Alert.alert("Calling...", "Resident has been contacted.")}><Text style={styles.buttonText}>📞 CALL</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.bigButton, {flex: 1}]} onPress={() => {Alert.alert("Success", "Request sent to resident dashboard."); setGuardSubView('home');}}><Text style={styles.buttonText}>SUBMIT</Text></TouchableOpacity>
        </View>
        </View>
      )}

      {guardSubView === 'scan' && (
        <View style={styles.cardDark}>
        <TouchableOpacity onPress={() => setGuardSubView('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
        <TextInput style={styles.input} placeholder="Enter Passcode" keyboardType="numeric" maxLength={6} />
        <TouchableOpacity style={styles.bigButton} onPress={() => {Alert.alert("Verified", "Access Granted"); setGuardSubView('home');}}><Text style={styles.buttonText}>VERIFY</Text></TouchableOpacity>
        </View>
      )}
      </View>
    )}

    {/* OTHER ROLES[cite: 3] */}
    {['admin', 'maid', 'staff'].includes(userRole) && (
      <View style={styles.cardDark}>
      <Text style={styles.cardHeader}>{userRole.toUpperCase()} Dashboard</Text>
      <Text style={{color: THEME.muted, marginTop: 10}}>Feature implementation pending for next phase.</Text>
      </View>
    )}

    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.navy },
  centerBox: { flex: 1, backgroundColor: THEME.navy, alignItems: 'center', justifyContent: 'center', padding: 25 },
  heroImg: { width: width * 0.9, height: 320, borderRadius: 24, marginBottom: 20 },
  brandName: { fontSize: 32, fontWeight: 'bold', color: THEME.white, marginBottom: 30 },
  authLayout: { flex: 1, backgroundColor: THEME.navy, justifyContent: 'center', padding: 25 },
  titleLg: { fontSize: 32, fontWeight: 'bold', color: THEME.white, marginBottom: 15 },
  cardDark: { backgroundColor: THEME.slate, padding: 20, borderRadius: 20, marginBottom: 20 },
  labelSmall: { color: THEME.muted, fontSize: 10, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: THEME.navy, color: THEME.white, padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
  tag: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: THEME.border },
  tagActive: { backgroundColor: THEME.emerald, borderColor: THEME.emerald },
  tagText: { color: THEME.muted, fontSize: 10, fontWeight: 'bold' },
  // Status Bar Fix for Logout Visibility[cite: 3]
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border
  },
  dashHead: { fontSize: 20, fontWeight: 'bold', color: THEME.white },
  roleBadge: { color: THEME.amber, fontSize: 9, fontWeight: 'bold' },
  exitBtn: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 },
                                 subTitle: { fontSize: 18, color: THEME.white, fontWeight: 'bold', marginVertical: 15 },
                                 announcementCard: { backgroundColor: THEME.navy, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: THEME.amber, marginBottom: 10, marginTop: 15 },
                                 actionBtn: { backgroundColor: THEME.slate, padding: 15, borderRadius: 15, width: 100, alignItems: 'center' },
                                 qrPlaceholder: { width: 120, height: 120, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
                                 listItem: { backgroundColor: THEME.slate, padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
                                 selectItem: { padding: 15, backgroundColor: THEME.navy, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
                                 cardHeader: { color: THEME.white, fontWeight: 'bold' },
                                 scanAction: { backgroundColor: THEME.emerald, padding: 22, borderRadius: 15, alignItems: 'center', marginBottom: 15, marginTop: 20 },
                                 scanText: { fontWeight: 'bold', color: '#fff' },
                                 bigButton: { backgroundColor: THEME.emerald, padding: 18, borderRadius: 12, alignItems: 'center' },
                                 buttonText: { color: '#fff', fontWeight: 'bold' }
});
