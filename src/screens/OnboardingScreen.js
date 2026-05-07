import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1F5B" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* LOGO AREA */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}><Text style={{fontSize: 24}}>🏠</Text></View>
          <View>
            <Text style={styles.logoTitle}>MyGate</Text>
            <Text style={styles.logoSubtitle}>Smart Society Security</Text>
          </View>
        </View>

        <Text style={styles.mainHeading}>Secure access for your entire community</Text>

        {/* FEATURES */}
        <View style={styles.featureList}>
          <FeatureItem icon="🛡️" title="Role-Based Access" desc="Admin, Guard, Resident & Staff portals" />
          <FeatureItem icon="🔔" title="Real-Time Alerts" desc="Instant visitor & entry notifications" />
          <FeatureItem icon="📊" title="Society Analytics" desc="Logs, reports & security insights" />
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <StatItem num="2,400+" label="Societies" />
          <StatItem num="1.2M" label="Residents" />
          <StatItem num="99.9%" label="Uptime" />
        </View>

        {/* GET STARTED BUTTON */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.nextButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, title, desc }) => (
  <View style={styles.featureRow}>
    <View style={styles.iconCircle}><Text>{icon}</Text></View>
    <View>
      <Text style={styles.fTitle}>{title}</Text>
      <Text style={styles.fDesc}>{desc}</Text>
    </View>
  </View>
);

const StatItem = ({ num, label }) => (
  <View style={{alignItems: 'center'}}>
    <Text style={styles.sNum}>{num}</Text>
    <Text style={styles.sLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1F5B' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 50 },
  logoBox: { width: 50, height: 50, backgroundColor: '#C14DFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  logoSubtitle: { color: '#AEB8D0', fontSize: 14 },
  mainHeading: { color: '#fff', fontSize: 36, fontWeight: '800', marginBottom: 40, lineHeight: 45 },
  featureList: { marginBottom: 50 },
  featureRow: { flexDirection: 'row', marginBottom: 25, alignItems: 'center' },
  iconCircle: { width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  fTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  fDesc: { color: '#AEB8D0', fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  sNum: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  sLabel: { color: '#AEB8D0', fontSize: 14 },
  nextButton: { backgroundColor: '#635BFF', padding: 18, borderRadius: 15, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});