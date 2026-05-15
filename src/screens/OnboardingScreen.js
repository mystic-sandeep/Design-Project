// src/screens/OnboardingScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Modal,
  FlatList
} from 'react-native';
import { COLORS } from '../constants/theme';

export default function OnboardingScreen({ navigation }) {
  // Demo Lead Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [pincode, setPincode] = useState('');

  // Custom dropdown pickers state
  const [units, setUnits] = useState('Select');
  const [role, setRole] = useState('Select');
  const [interest, setInterest] = useState('Select');

  // Picker visibility toggles
  const [activePicker, setActivePicker] = useState(null); // 'units' | 'role' | 'interest' | null

  const unitOptions = ['1-50', '51-200', '201-500', '500+'];
  const roleOptions = ['RWA President', 'Secretary', 'Treasurer', 'Resident'];
  const interestOptions = ['Community App', 'Smart Locks', 'Ad Platform', 'Full Suite'];

  const handleDemoSubmit = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Required Fields', 'Name and mobile number are required.');
      return;
    }

    const payload = { name, mobile, societyName, pincode, units, role, interest };

    try {
      const response = await fetch('https://your-domain.com/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert('🎉 Success', `${data.message}\nReference: ${data.referenceId}`);
      } else {
        Alert.alert('Error', data.error || 'Submission failed');
      }
    } catch (error) {
      Alert.alert(
        '🎉 Thank you!',
        'Our team will reach out within 24 hours to schedule your free demo.'
      );
      setName(''); setMobile(''); setSocietyName(''); setPincode('');
      setUnits('Select'); setRole('Select'); setInterest('Select');
    }
  };

  const openDropdown = (type) => setActivePicker(type);

  const handleSelectOption = (option) => {
    if (activePicker === 'units') setUnits(option);
    if (activePicker === 'role') setRole(option);
    if (activePicker === 'interest') setInterest(option);
    setActivePicker(null);
  };


  const getDropdownOptions = () => {
    if (activePicker === 'units') return unitOptions;
    if (activePicker === 'role') return roleOptions;
    if (activePicker === 'interest') return interestOptions;
    return [];
  };

  return (
    <View style={styles.masterContainer}>
      {/* PERSISTENT WEB HEADER TOP BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLogo}>
          <View style={styles.navLogoIcon}><Text style={styles.navLogoIconText}>M</Text></View>
          <Text style={styles.navLogoText}>mygate</Text>
        </View>
        <TouchableOpacity
          style={styles.btnNavLogin}
          onPress={() => navigation.navigate('Login')}

        >
          <Text style={styles.btnNavLoginText}>Login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🏆 India's Largest Community Platform</Text>
          </View>

          {/* FIXED SYSTEM: Separated title layouts into pure individual string elements */}
          <Text style={styles.heroTitleMain}>Making everyday living</Text>
          <Text style={styles.heroTitleYellow}>easier</Text>

          <Text style={styles.heroSubtitle}>
            Tech solutions to bring home convenience & security, and keep you connected to the community.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.btnHeroPrimary}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.btnHeroPrimaryText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* METRICS STATS BAR */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}><Text style={styles.statNum}>27K+</Text><Text style={styles.statLabel}>Communities</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>5M+</Text><Text style={styles.statLabel}>Homes</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>50+</Text><Text style={styles.statLabel}>Cities</Text></View>
        </View>

        {/* ECOSYSTEM CARDS */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTag}>The Mygate App</Text>
          <Text style={styles.sectionTitle}>Our community ecosystem</Text>

          <View style={[styles.ecoCard, styles.ecoCardTeal]}>
            <Text style={styles.ecoCardTag}>Community Insights</Text>
            <Text style={styles.ecoCardTitle}>Smart Society Analytics</Text>
            <Text style={styles.ecoCardDesc}>Real-time dashboards with visitor logs, maintenance dues, and community health metrics.</Text>
            <View style={styles.ecoCardScreenshot}>
              <Text style={styles.screenshotText}>📈 140 visitors today · ₹2590 pending</Text>
            </View>
          </View>

          <View style={[styles.ecoCard, styles.ecoCardYellow]}>
            <Text style={styles.ecoCardTag}>Community Tab</Text>
            <Text style={styles.ecoCardTitle}>All-in-One Community Hub</Text>
            <Text style={styles.ecoCardDesc}>Amenity bookings, prepaid meter, rent parking, emergency contacts — all in one tap.</Text>
            <View style={styles.ecoCardScreenshot}>
              <Text style={styles.screenshotText}>🎱 Booking confirmed · Club House</Text>
            </View>
          </View>
        </View>

        {/* SMART DOOR LOCK HARDWARE HIGHLIGHT */}
        <View style={[styles.sectionWrapper, styles.lockSection]}>
          <Text style={styles.lockTag}>Mygate Smart Locks</Text>
          <Text style={styles.lockTitle}>From the gate to the door</Text>
          <Text style={styles.lockDesc}>
            We've established a legacy of securing the gates of communities. Now we're bringing the same innovative experience to the doorstep.
          </Text>

          <View style={styles.lockVisualContainer}>
            <View style={styles.lockBody}>
              <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 10}}>🔐</Text>
              <View style={styles.lockKeypad}>
                {[...Array(9)].map((_, i) => <View key={i} style={styles.lockKey} />)}
              </View>
              <View style={styles.lockStatusBadge}>
                <Text style={styles.lockStatusText}>🔒 Secured</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AD PLATFORM PREVIEW */}
        <View style={[styles.sectionWrapper, styles.adSection]}>
          <Text style={styles.sectionTag}>Mygate Ad Platform</Text>
          <Text style={styles.sectionTitle}>Reach India's best communities</Text>

          <View style={styles.phoneMockup}>
            <View style={styles.phoneScreen}>
              <View style={styles.phoneHeader}>
                <View style={styles.phoneHeaderDot} />
                <Text style={styles.phoneHeaderText}>Entry approved: Zomato delivery</Text>
              </View>
              <View style={styles.phoneAdBanner}>
                <Text style={styles.phoneAdText}>🛋️ IKEA SALE — Up to 70% off! Shop now →</Text>
              </View>
              <View style={styles.phoneBody}>
                <Text style={styles.phoneBodyTitle}>Community Updates</Text>
                <Text style={styles.phoneAdTextLabel}>✅ Amenity Booking confirmed - 6PM</Text>
                <Text style={styles.phoneAdTextLabel}>Paragraph text info synced.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* INTERACTIVE DEMO INTAKE SYSTEM */}
        <View style={[styles.sectionWrapper, styles.demoSection]}>
          <Text style={styles.sectionTitle}>Switch to Mygate now</Text>
          <Text style={styles.demoFormDesc}>Book a free demo & watch how Mygate makes every task smoother & faster.</Text>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput style={styles.formInput} placeholder="Full name" value={name} onChangeText={setName} placeholderTextColor="#9ca3af" />

            <Text style={styles.fieldLabel}>MOBILE</Text>
            <TextInput style={styles.formInput} placeholder="+91 00000 00000" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} placeholderTextColor="#9ca3af" />

            <View style={styles.formInputRow}>
              <View style={styles.formHalfColumnLeft}>
                <Text style={styles.fieldLabel}>SOCIETY NAME</Text>
                <TextInput style={styles.formInput} placeholder="Society name" value={societyName} onChangeText={setSocietyName} placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.formHalfColumnRight}>
                <Text style={styles.fieldLabel}>PINCODE</Text>
                <TextInput style={styles.formInput} placeholder="Pincode" keyboardType="number-pad" value={pincode} onChangeText={setPincode} placeholderTextColor="#9ca3af" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>NO. OF UNITS</Text>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => openDropdown('units')}>
              <Text style={styles.dropdownSelectorText}>{units}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>YOUR ROLE</Text>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => openDropdown('role')}>
              <Text style={styles.dropdownSelectorText}>{role}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>INTERESTED IN?</Text>
            <TouchableOpacity style={styles.dropdownSelector} onPress={() => openDropdown('interest')}>
              <Text style={styles.dropdownSelectorText}>{interest}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSubmitForm} onPress={handleDemoSubmit}>
              <Text style={styles.btnSubmitFormText}>Submit Request →</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* WHATSAPP FLOAT SYSTEM OVERLAY */}
      <TouchableOpacity
        style={styles.whatsappFloat}
        onPress={() => Linking.openURL('https://wa.me/918001232084')}
      >
        <Text style={styles.whatsappText}>💬 Chat with us</Text>
      </TouchableOpacity>

      {/* ROBUST DROP-DOWN OVERLAY SELECTION MODAL */}
      <Modal transparent={true} visible={activePicker !== null} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMenuTitle}>Select an option</Text>
            <FlatList
              data={getDropdownOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOptionRow} onPress={() => handleSelectOption(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: COLORS.white },
  navBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 45, paddingBottom: 15,
    backgroundColor: 'rgba(10, 74, 74, 0.98)'
  },
  navLogo: { flexDirection: 'row', alignItems: 'center' },
  navLogoIcon: { width: 28, height: 28, backgroundColor: COLORS.yellow, borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  navLogoIconText: { color: COLORS.teal, fontWeight: '900', fontSize: 14 },
  navLogoText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  btnNavLogin: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  btnNavLoginText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  scrollPadding: { paddingTop: 100, paddingBottom: 80 },

  heroSection: { backgroundColor: '#062e2e', padding: 24, paddingVertical: 40 },
  heroBadge: { backgroundColor: 'rgba(245,200,0,0.15)', borderWidth: 1, borderColor: 'rgba(245,200,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16 },
  heroBadgeText: { color: COLORS.yellow, fontSize: 11, fontWeight: '700' },

  // Cleaned layout titles
  heroTitleMain: { fontSize: 32, fontWeight: '800', color: COLORS.white, lineHeight: 36 },
  heroTitleYellow: { fontSize: 32, fontWeight: '800', color: COLORS.yellow, lineHeight: 36, marginBottom: 12 },

  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22, marginBottom: 24 },
  btnHeroPrimary: { backgroundColor: COLORS.yellow, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30, alignItems: 'center' },
  btnHeroPrimaryText: { color: COLORS.teal, fontWeight: '700', fontSize: 15 },

  statsBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.offWhite, paddingVertical: 20, borderBottomWidth: 1, borderColor: '#e8e8e5' },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: COLORS.teal },
  statLabel: { fontSize: 11, color: COLORS.gray, marginTop: 2 },

  sectionWrapper: { padding: 24, paddingVertical: 40 },
  sectionTag: { fontSize: 11, fontWeight: '700', color: COLORS.teal, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dark, marginBottom: 20 },

  ecoCard: { borderRadius: 16, padding: 20, marginBottom: 16 },
  ecoCardTeal: { backgroundColor: '#e8f5f5' },
  ecoCardYellow: { backgroundColor: '#fffbde' },
  ecoCardTag: { fontSize: 10, fontWeight: '700', color: COLORS.tealLight, marginBottom: 6 },
  ecoCardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark, marginBottom: 6 },
  ecoCardDesc: { fontSize: 13, color: COLORS.gray, lineHeight: 18 },
  ecoCardScreenshot: { marginTop: 14, backgroundColor: 'rgba(255,255,255,0.7)', padding: 10, borderRadius: 8 },
  screenshotText: { fontSize: 11, color: '#444', fontWeight: '500' },

  lockSection: { backgroundColor: '#0d2828' },
  lockTag: { fontSize: 11, fontWeight: '700', color: COLORS.yellow, marginBottom: 6 },
  lockTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, marginBottom: 12 },
  lockDesc: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 20, marginBottom: 20 },
  lockVisualContainer: { alignItems: 'center', marginTop: 10 },
  lockBody: { width: 140, height: 220, backgroundColor: '#1a1a1a', borderRadius: 24, padding: 16, justifyContent: 'center' },
  lockKeypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  lockKey: { width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.15)', margin: 4 },
  lockStatusBadge: { backgroundColor: COLORS.yellow, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, alignSelf: 'center', marginTop: 15 },
  lockStatusText: { color: COLORS.teal, fontSize: 10, fontWeight: '700' },

  adSection: { backgroundColor: '#f0f8f0' },
  phoneMockup: { width: '100%', backgroundColor: '#111', borderRadius: 24, padding: 10, borderWidth: 1, borderColor: '#333' },
  phoneScreen: { backgroundColor: '#f5f5f5', borderRadius: 16, overflow: 'hidden', paddingBottom: 16 },
  phoneHeader: { backgroundColor: COLORS.teal, padding: 8, flexDirection: 'row', alignItems: 'center' },
  phoneHeaderDot: { width: 6, height: 6, backgroundColor: '#4ade80', borderRadius: 3, marginRight: 6 },
  phoneHeaderText: { color: COLORS.white, fontSize: 10, fontWeight: '600' },
  phoneAdBanner: { backgroundColor: COLORS.yellow, margin: 10, padding: 10, borderRadius: 8 },
  phoneAdText: { color: COLORS.teal, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  phoneBody: { paddingHorizontal: 12 },
  phoneBodyTitle: { fontSize: 12, fontWeight: '700', color: '#222', marginBottom: 4 },
  phoneAdTextLabel: { fontSize: 11, color: '#666', marginBottom: 4 },

  demoSection: { backgroundColor: '#eef5ef' },
  demoFormDesc: { fontSize: 13, color: COLORS.gray, marginBottom: 20, lineHeight: 18 },
  formCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  fieldLabel: { fontSize: 10, fontWeight: '700', color: COLORS.gray, marginBottom: 6 },
  formInput: { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, fontSize: 13, color: COLORS.dark, marginBottom: 14, backgroundColor: COLORS.white },
  formInputRow: { flexDirection: 'row', width: '100%', marginBottom: 14 },
  formHalfColumnLeft: { flex: 1, marginRight: 8 },
  formHalfColumnRight: { flex: 1, marginLeft: 8 },

  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 14, backgroundColor: COLORS.white },
  dropdownSelectorText: { fontSize: 13, color: COLORS.dark },
  dropdownArrow: { fontSize: 10, color: COLORS.gray },

  btnSubmitForm: { backgroundColor: COLORS.yellow, paddingVertical: 14, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnSubmitFormText: { color: COLORS.teal, fontWeight: '700', fontSize: 15 },
  whatsappFloat: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#25d366', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 16, elevation: 4 },
  whatsappText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: COLORS.white, borderRadius: 12, padding: 20, maxHeight: '60%' },
  modalMenuTitle: { fontSize: 15, fontWeight: '700', marginBottom: 15, color: COLORS.dark, textAlign: 'center' },
  modalOptionRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalOptionText: { fontSize: 14, color: COLORS.dark }
});