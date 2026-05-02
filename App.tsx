import React, { useState, useEffect } from 'react';
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
  Alert,
  Share,
  Modal,
  StatusBar,
  Platform
} from 'react-native';

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
  // --- CORE STATE ---
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  // UI States
  const [activeTab, setActiveTab] = useState('home');
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Data States
  const [serviceLogs, setServiceLogs] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [pendingGuests, setPendingGuests] = useState([]);

  // Form States
  const [preApproveForm, setPreApproveForm] = useState({ name: '', phone: '', vehicleNo: '' });
  const [guardVisitorForm, setGuardVisitorForm] = useState({
    name: '',
    phone: '',
    flat: '',
    vehicleType: 'None',
    vehicleNo: '',
    purpose: '',
    idProof: ''
  });

  // --- HANDLERS ---

  const handleLogout = () => {
    setCurrentStep('onboarding');
    setUserRole('');
    setUserName('');
    setPhoneNumber('');
    setOtp('');
    setActiveTab('home');
    setShowAnnouncement(false);
    setGeneratedCode('');
  };

  const validateName = (text) => {
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setUserName(filteredText);
  };

  const handleEmergency = () => {
    Alert.alert(
      "🚨 EMERGENCY ALERT",
      "Your SOS signal has been sent to the Main Gate and Society Admin. Help is on the way.",
      [{ text: "Understood", style: "destructive" }]
    );
  };

  const submitServiceRequest = (issue) => {
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

  const generatePreApproval = () => {
    if (!preApproveForm.name || preApproveForm.phone.length !== 10) {
      return Alert.alert("Error", "Please enter a valid guest name and 10-digit phone number");
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(code);

    const newGuest = {
        id: Date.now().toString(),
        name: preApproveForm.name,
        vehicle: preApproveForm.vehicleNo || 'No Vehicle',
        code: code,
        status: 'Pending Approval'
    };
    setPendingGuests([newGuest, ...pendingGuests]);
  };

  const shareGeneratedCode = () => {
    Share.share({
      message: `MyGate Invite: Hello ${preApproveForm.name}, use Passcode ${generatedCode} for entry to ${userName}'s residence. Vehicle: ${preApproveForm.vehicleNo || 'N/A'}`,
    });
    setGeneratedCode('');
    setActiveTab('home');
    setPreApproveForm({ name: '', phone: '', vehicleNo: '' });
  };

  const handleGuardSubmit = () => {
    if(!guardVisitorForm.name || !guardVisitorForm.flat) {
        return Alert.alert("Error", "Name and Flat Number are required.");
    }
    const newEntry = {
      id: Date.now().toString(),
      name: guardVisitorForm.name,
      vehicle: guardVisitorForm.vehicleNo || 'No Vehicle',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Check-In'
    };
    setVisitorLogs([newEntry, ...visitorLogs]);
    Alert.alert("Success", "Visitor Checked In Successfully");
    setActiveTab('home');
    setGuardVisitorForm({ name: '', phone: '', flat: '', vehicleType: 'None', vehicleNo: '', purpose: '', idProof: '' });
  };

  const AnnouncementModal = () => (
    <Modal visible={showAnnouncement} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.announcementPopup}>
          <Text style={{fontSize: 24}}>📢</Text>
          <Text style={styles.popupTitle}>Society Notice</Text>
          <Text style={styles.popupText}>Elevator B maintenance is scheduled from 2 PM to 5 PM today. Please use Elevator A.</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAnnouncement(false)}>
            <Text style={styles.buttonText}>Acknowledge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
          <TextInput
            style={styles.input}
            placeholder="Full Name (A-Z only)"
            placeholderTextColor={THEME.muted}
            value={userName}
            onChangeText={validateName}
          />
          <TextInput
            style={styles.input}
            placeholder="10 Digit Mobile"
            placeholderTextColor={THEME.muted}
            keyboardType="numeric"
            maxLength={10}
            value={phoneNumber}
            onChangeText={(val) => setPhoneNumber(val.replace(/[^0-9]/g, ''))}
          />
          <Text style={styles.labelSmall}>Select Role</Text>
          <View style={styles.roleRow}>
            {['resident', 'guard', 'admin', 'maid', 'staff'].map(role => (
              <TouchableOpacity key={role} style={[styles.tag, userRole === role && styles.tagActive]} onPress={() => setUserRole(role)}>
                <Text style={[styles.tagText, userRole === role && {color: '#fff'}]}>{role.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.bigButton} onPress={() => {
            if(userRole && phoneNumber.length === 10 && userName.length > 2) {
              setCurrentStep('otp');
            } else {
              Alert.alert("Error", "Valid Name, 10-digit Phone, & Role required");
            }
          }}>
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
          <TouchableOpacity style={styles.bigButton} onPress={() => {
            if(otp.length === 6) {
              setCurrentStep('dashboard');
              setShowAnnouncement(true);
            } else {
              Alert.alert("Error", "Enter 6 digits");
            }
          }}>
            <Text style={styles.buttonText}>Verify & Enter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AnnouncementModal />

      {/* FIXED HEADER - CLEARING SYSTEM UI AND NOTCH */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Text style={styles.dashHead}>MyGate</Text>
          <Text style={styles.roleBadge}>{userRole.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={styles.tickerContainer} onPress={() => setShowAnnouncement(true)}>
            <Text numberOfLines={1} style={styles.tickerText}>📢 Notice: Elevator B maintenance scheduled for today...</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.exitBtn}>
          <Text style={{ color: THEME.red, fontWeight: 'bold', fontSize: 11 }}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>

        {/* RESIDENT DASHBOARD */}
        {userRole === 'resident' && (
          <View>
            {activeTab === 'home' && (
              <>
                <Text style={styles.subTitle}>Quick Actions</Text>
                <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTab('service_request')}>
                    <Text style={{fontSize: 20}}>🛠️</Text>
                    <Text style={styles.actionBtnText}>Service Req</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTab('pre_approve')}>
                    <Text style={{fontSize: 20}}>🎫</Text>
                    <Text style={styles.actionBtnText}>Pre-Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#450a0a'}]} onPress={handleEmergency}>
                    <Text style={{fontSize: 20}}>🚨</Text>
                    <Text style={styles.actionBtnText}>Emergency</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subTitle}>Pending Guest Approvals</Text>
                {pendingGuests.length === 0 ? (
                  <Text style={styles.emptyText}>No pending guests.</Text>
                ) : (
                    pendingGuests.map(guest => (
                    <View key={guest.id} style={styles.listItem}>
                      <View>
                        <Text style={styles.cardHeader}>{guest.name}</Text>
                        <Text style={{color: THEME.muted, fontSize: 11}}>Vehicle: {guest.vehicle} • Code: {guest.code}</Text>
                      </View>
                      <Text style={{color: THEME.amber, fontWeight: 'bold', fontSize: 11}}>{guest.status}</Text>
                    </View>
                  ))
                )}

                <Text style={styles.subTitle}>Recent Service Logs</Text>
                {serviceLogs.length === 0 ? (
                  <Text style={styles.emptyText}>No service requests raised yet.</Text>
                ) : (
                  serviceLogs.map(log => (
                    <View key={log.id} style={styles.listItem}>
                      <View><Text style={styles.cardHeader}>{log.issue}</Text><Text style={{color: THEME.muted, fontSize: 11}}>{log.date}</Text></View>
                      <Text style={{color: log.status === 'Resolved' ? THEME.emerald : THEME.amber, fontWeight: 'bold'}}>{log.status}</Text>
                    </View>
                  ))
                )}
              </>
            )}

            {activeTab === 'service_request' && (
              <View style={styles.cardDark}>
                <TouchableOpacity onPress={() => setActiveTab('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
                <Text style={styles.subTitle}>New Service Request</Text>
                {['Plumbing', 'Electrical', 'Carpentry', 'AC Repair'].map(item => (
                  <TouchableOpacity key={item} style={styles.selectItem} onPress={() => submitServiceRequest(item)}>
                    <Text style={{color: '#fff'}}>{item}</Text>
                    <Text style={{color: THEME.emerald}}>+</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTab === 'pre_approve' && (
              <View style={styles.cardDark}>
                <TouchableOpacity onPress={() => {setActiveTab('home'); setGeneratedCode('');}}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
                <Text style={styles.subTitle}>Register Guest</Text>

                {!generatedCode ? (
                  <>
                    <TextInput style={styles.input} placeholder="Guest Name" placeholderTextColor={THEME.muted} value={preApproveForm.name} onChangeText={(t) => setPreApproveForm({...preApproveForm, name: t})} />
                    <TextInput
                        style={styles.input}
                        placeholder="Guest Phone (10 Digits)"
                        keyboardType="numeric"
                        maxLength={10}
                        placeholderTextColor={THEME.muted}
                        value={preApproveForm.phone}
                        onChangeText={(t) => setPreApproveForm({...preApproveForm, phone: t.replace(/[^0-9]/g, '')})}
                    />
                    <TextInput style={styles.input} placeholder="Vehicle Number (Optional)" placeholderTextColor={THEME.muted} value={preApproveForm.vehicleNo} onChangeText={(t) => setPreApproveForm({...preApproveForm, vehicleNo: t})} />
                    <TouchableOpacity style={styles.bigButton} onPress={generatePreApproval}>
                      <Text style={styles.buttonText}>Generate Unique Code</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{alignItems: 'center', paddingVertical: 10}}>
                    <Text style={{color: THEME.muted, marginBottom: 10}}>Unique Passcode for {preApproveForm.name}:</Text>
                    <Text style={{color: THEME.emerald, fontSize: 36, fontWeight: 'bold', letterSpacing: 4, marginBottom: 20}}>{generatedCode}</Text>
                    <TouchableOpacity style={[styles.bigButton, {width: '100%'}]} onPress={shareGeneratedCode}>
                      <Text style={styles.buttonText}>Share Code with Visitor</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* GUARD DASHBOARD */}
        {userRole === 'guard' && (
          <View>
            {activeTab === 'home' && (
              <>
                <Text style={styles.subTitle}>Guard Quick Actions</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20}}>
                  <TouchableOpacity style={styles.guardActionBtn} onPress={() => setActiveTab('verify_pre')}>
                    <Text style={{fontSize: 20}}>✅</Text>
                    <Text style={styles.actionBtnText}>Pre-Approved Entry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.guardActionBtn} onPress={() => setActiveTab('new_guest')}>
                    <Text style={{fontSize: 20}}>📝</Text>
                    <Text style={styles.actionBtnText}>Register New</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.guardActionBtn, {backgroundColor: '#450a0a'}]} onPress={handleEmergency}>
                    <Text style={{fontSize: 20}}>🚨</Text>
                    <Text style={styles.actionBtnText}>Emergency</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.subTitle}>Entry/Exit Logs</Text>
                {visitorLogs.length === 0 ? (
                  <Text style={styles.emptyText}>No visitors logged today.</Text>
                ) : (
                  visitorLogs.map(log => (
                    <View key={log.id} style={styles.listItem}>
                      <View>
                        <Text style={styles.cardHeader}>{log.name}</Text>
                        <Text style={{color: THEME.muted, fontSize: 11}}>{log.vehicle} • {log.time}</Text>
                      </View>
                      <TouchableOpacity onPress={() => Alert.alert("Logged", "Guest Exit recorded")}>
                        <Text style={{color: THEME.amber, fontWeight: 'bold'}}>{log.type}</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </>
            )}

            {activeTab === 'verify_pre' && (
              <View style={styles.cardDark}>
                <TouchableOpacity onPress={() => setActiveTab('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
                <TextInput style={[styles.input, {textAlign: 'center', fontSize: 24}]} placeholder="ALPHA123" autoCapitalize="characters" maxLength={6} />
                <TouchableOpacity style={styles.bigButton} onPress={() => {Alert.alert("Verified", "Entry Granted"); setActiveTab('home');}}>
                  <Text style={styles.buttonText}>Verify Passcode</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'new_guest' && (
              <View style={styles.cardDark}>
                <TouchableOpacity onPress={() => setActiveTab('home')}><Text style={{color: THEME.emerald, marginBottom: 15}}>← Back</Text></TouchableOpacity>
                <Text style={styles.subTitle}>Register Visitor Details</Text>

                <TextInput style={styles.input} placeholder="Visitor Name" placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, name: t})} />
                <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="numeric" maxLength={10} placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, phone: t})} />
                <TextInput style={styles.input} placeholder="Flat Number" placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, flat: t})} />
                <TextInput style={styles.input} placeholder="Purpose" placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, purpose: t})} />
                <TextInput style={styles.input} placeholder="ID Proof (Last 4 digits)" keyboardType="numeric" maxLength={4} placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, idProof: t})} />

                <Text style={styles.labelSmall}>Vehicle Entry</Text>
                <View style={styles.roleRow}>
                  {['None', 'Car', 'Bike'].map(v => (
                    <TouchableOpacity key={v} style={[styles.tag, guardVisitorForm.vehicleType === v && styles.tagActive]} onPress={() => setGuardVisitorForm({...guardVisitorForm, vehicleType: v})}>
                      <Text style={styles.tagText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {guardVisitorForm.vehicleType !== 'None' && (
                  <TextInput style={styles.input} placeholder="Vehicle Number" autoCapitalize="characters" placeholderTextColor={THEME.muted} onChangeText={(t) => setGuardVisitorForm({...guardVisitorForm, vehicleNo: t})} />
                )}

                <TouchableOpacity style={styles.bigButton} onPress={handleGuardSubmit}>
                  <Text style={styles.buttonText}>Confirm Check-In</Text>
                </TouchableOpacity>
              </View>
            )}
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

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // FIX: Dynamic padding to push nav bar below physical notch/status bar
    paddingTop: Platform.OS === 'ios' ? 45 : 40,
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    backgroundColor: THEME.navy,
  },
  navLeft: { width: '25%' },
  tickerContainer: {
    width: '55%',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  tickerText: {
    color: THEME.amber,
    fontSize: 9,
    fontWeight: 'bold'
  },
  dashHead: { fontSize: 16, fontWeight: 'bold', color: THEME.white },
  roleBadge: { color: THEME.amber, fontSize: 8, fontWeight: 'bold' },
  exitBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: 8 },

  subTitle: { fontSize: 18, color: THEME.white, fontWeight: 'bold', marginVertical: 15 },
  actionBtn: { backgroundColor: THEME.slate, padding: 12, borderRadius: 15, width: (width - 70) / 3, alignItems: 'center', justifyContent: 'center', height: 90 },
  guardActionBtn: { backgroundColor: THEME.slate, padding: 12, borderRadius: 15, width: (width - 60) / 2, alignItems: 'center', marginBottom: 10, height: 100, justifyContent: 'center' },
  actionBtnText: { color: '#fff', fontSize: 10, marginTop: 8, textAlign: 'center', fontWeight: '600' },
  listItem: { backgroundColor: THEME.slate, padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectItem: { padding: 15, backgroundColor: THEME.navy, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  cardHeader: { color: THEME.white, fontWeight: 'bold' },
  bigButton: { backgroundColor: THEME.emerald, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  announcementPopup: { width: width * 0.85, backgroundColor: THEME.slate, padding: 25, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: THEME.amber },
  popupTitle: { color: THEME.amber, fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  popupText: { color: '#fff', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  closeBtn: { backgroundColor: THEME.emerald, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  emptyText: { color: THEME.muted, textAlign: 'center', marginTop: 10, fontStyle: 'italic', fontSize: 12 }
});