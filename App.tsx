import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

// Modern Professional Color Palette
const COLORS = {
  background: '#0F172A',
  cardBg: '#1E293B',
  primary: '#10B981',
  accent: '#F59E0B',
  white: '#FFFFFF',
  textMain: '#F8FAFC',
  textMuted: '#94A3B8',
  danger: '#EF4444',
  border: '#334155'
};

export default function App() {
  const [step, setStep] = useState<'onboarding' | 'login' | 'otp' | 'dashboard'>('onboarding');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'resident' | 'guard' | 'admin' | 'maid' | 'staff' | ''>('');


  const Onboarding = () => (
    <View style={styles.onboardingContainer}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1558002038-1037906d8959?w=800' }}
        style={styles.onboardingImage}
      />
      <Text style={styles.onboardingTitle}>MyGate Secure</Text>
      <Text style={styles.onboardingSub}>
        Premium society management for modern living. Security and convenience at your fingertips.
      </Text>
      <TouchableOpacity style={styles.mainButton} onPress={() => setStep('login')}>
        <Text style={styles.mainButtonText}>Enter Society</Text>
      </TouchableOpacity>
    </View>
  );


  const renderDashboard = () => {
    switch(role) {
      case 'resident': return (
        <View>
          <Text style={styles.sectionTitle}>Quick Approvals</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Zomato Delivery</Text>
            <Text style={styles.cardSub}>Waiting at Main Gate</Text>
            <View style={styles.rowBetween}>
              <TouchableOpacity style={styles.smallBtnSuccess}><Text style={styles.btnText}>Allow</Text></TouchableOpacity>
              <TouchableOpacity style={styles.smallBtnDanger}><Text style={styles.btnText}>Deny</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      );
      case 'guard': return (
        <View>
          <Text style={styles.sectionTitle}>Gate Entry</Text>
          <TextInput style={styles.modernInput} placeholder="Visitor Name" placeholderTextColor={COLORS.textMuted} />
          <TextInput style={styles.modernInput} placeholder="Flat Number" placeholderTextColor={COLORS.textMuted} />
          <TouchableOpacity style={styles.mainButton}><Text style={styles.mainButtonText}>Check In</Text></TouchableOpacity>
        </View>
      );
      case 'maid': return (
        <View>
          <Text style={styles.sectionTitle}>My Schedule</Text>
          <View style={styles.card}><Text style={styles.cardTitle}>Flat 402 - 08:00 AM</Text></View>
          <View style={styles.card}><Text style={styles.cardTitle}>Flat 105 - 10:30 AM</Text></View>
        </View>
      );
      case 'staff': return (
        <View>
          <Text style={styles.sectionTitle}>Pending Repairs</Text>
          <View style={styles.card}><Text style={styles.cardTitle}>🔧 Lift B2 Calibration</Text></View>
          <View style={styles.card}><Text style={styles.cardTitle}>🧹 Lobby Cleaning</Text></View>
        </View>
      );
      case 'admin': return (
        <View>
          <Text style={styles.sectionTitle}>Admin Controls</Text>
          <TouchableOpacity style={styles.card}><Text style={styles.cardTitle}>View Society Analytics</Text></TouchableOpacity>
          <TouchableOpacity style={styles.card}><Text style={styles.cardTitle}>User Management</Text></TouchableOpacity>
        </View>
      );
      default: return null;
    }
  };


  if (step === 'onboarding') return <Onboarding />;

  if (step === 'login') {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authWrapper}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loginHeader}>
          <Text style={styles.loginTitle}>Welcome</Text>
          <Text style={styles.loginSub}>Sign in to your society portal</Text>
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.modernInput}
            placeholder="98765 43210"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Select Your Role</Text>
          <View style={styles.roleGrid}>
            {['resident', 'guard', 'admin', 'maid', 'staff'].map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.rolePill, role === r && styles.rolePillActive]}
                onPress={() => setRole(r as any)}
              >
                <Text style={[styles.rolePillText, role === r && styles.rolePillTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.mainButton, !role && { opacity: 0.5 }]}
            onPress={() => role ? setStep('otp') : Alert.alert('Error', 'Please select a role')}
          >
            <Text style={styles.mainButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'otp') {
    return (
      <View style={styles.authWrapper}>
        <View style={styles.loginHeader}>
          <Text style={styles.loginTitle}>Verification</Text>
          <Text style={styles.loginSub}>Enter the 6-digit code sent to {phone}</Text>
        </View>
        <View style={styles.loginCard}>
          <TextInput
            style={[styles.modernInput, styles.otpInput]}
            placeholder="000 000"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.mainButton} onPress={() => setStep('dashboard')}>
            <Text style={styles.mainButtonText}>Verify & Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.dashboardBody}>
        <View style={styles.dashHeader}>
          <View>
            <Text style={styles.dashTitle}>Dashboard</Text>
            <Text style={styles.dashRole}>{role.toUpperCase()} ACCOUNT</Text>
          </View>
          <TouchableOpacity onPress={() => setStep('login')}><Text style={{color: COLORS.danger}}>Logout</Text></TouchableOpacity>
        </View>
        {renderDashboard()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: COLORS.background },
  // Onboarding
  onboardingContainer: { flex: 1, backgroundColor: COLORS.background, padding: 30, justifyContent: 'center', alignItems: 'center' },
  onboardingImage: { width: width * 0.85, height: 350, borderRadius: 30, marginBottom: 40 },
  onboardingTitle: { fontSize: 34, fontWeight: 'bold', color: COLORS.white },
  onboardingSub: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginTop: 15, marginBottom: 40, lineHeight: 24 },

  // Login Screen
  authWrapper: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 25 },
  loginHeader: { marginBottom: 40 },
  loginTitle: { fontSize: 40, fontWeight: 'bold', color: COLORS.white },
  loginSub: { fontSize: 18, color: COLORS.textMuted, marginTop: 5 },
  loginCard: { backgroundColor: COLORS.cardBg, padding: 25, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  inputLabel: { color: COLORS.textMuted, fontSize: 14, marginBottom: 8, fontWeight: '600' },
  modernInput: { backgroundColor: COLORS.background, color: COLORS.white, padding: 18, borderRadius: 12, fontSize: 18, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  otpInput: { textAlign: 'center', letterSpacing: 10, fontSize: 24, fontWeight: 'bold' },

  // Role Selection
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  rolePill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  rolePillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  rolePillText: { color: COLORS.textMuted, fontWeight: 'bold', textTransform: 'capitalize' },
  rolePillTextActive: { color: COLORS.white },

  // Dashboard
  dashboardBody: { flex: 1, padding: 20 },
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  dashTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  dashRole: { fontSize: 12, color: COLORS.accent, fontWeight: 'bold', letterSpacing: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 15 },
  card: { backgroundColor: COLORS.cardBg, padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  cardSub: { color: COLORS.textMuted, fontSize: 14, marginTop: 4, marginBottom: 15 },

  // Buttons
  mainButton: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 15, alignItems: 'center' },
  mainButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  smallBtnSuccess: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  smallBtnDanger: { backgroundColor: COLORS.danger, padding: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: 'bold' }
});