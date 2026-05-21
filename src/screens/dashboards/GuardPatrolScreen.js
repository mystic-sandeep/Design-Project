import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function GuardPatrolScreen({ navigation }) {
  const [checkpoints, setCheckpoints] = useState([
    { id: '1', title: 'Main Gate Security Post', location: 'Ground Level', status: 'Completed', time: '08:00 PM' },
    { id: '2', title: 'Block-A Rear Perimeter', location: 'Near Parking', status: 'Completed', time: '08:45 PM' },
    { id: '3', title: 'Clubhouse & Amenities Deck', location: '1st Floor', status: 'Pending', time: '--:--' },
    { id: '4', title: 'Basement B2 Security Loop', location: 'CCTV Blindspot', status: 'Pending', time: '--:--' },
  ]);

  const handleScanPress = (name) => {
    Alert.alert("Scanner Active", `Initializing camera interface to scan QR code at: ${name}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patrol Points</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Guard Quick Status summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📍 Night Shift Patrol Route</Text>
          <Text style={styles.summarySub}>2 / 4 Checkpoints Checked Successfully</Text>
        </View>

        <Text style={styles.sectionTitle}>Assigned Checkpoints</Text>

        {checkpoints.map((point) => (
          <View key={point.id} style={styles.checkpointCard}>
            <View style={styles.pointDetails}>
              <Text style={styles.pointTitle}>{point.title}</Text>
              <Text style={styles.pointMeta}>📍 {point.location} • {point.status === 'Completed' ? `Checked at ${point.time}` : 'Awaiting Check'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, point.status === 'Completed' ? styles.btnDone : styles.btnScan]}
              onPress={() => point.status !== 'Completed' && handleScanPress(point.title)}
              disabled={point.status === 'Completed'}
            >
              <Text style={styles.btnText}>{point.status === 'Completed' ? '✓ Safe' : '📸 Scan'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#094c4c', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16 },
  summaryCard: { backgroundColor: '#0d1b3e', borderRadius: 12, padding: 16, marginBottom: 20 },
  summaryTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  summarySub: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 },
  checkpointCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  pointDetails: { flex: 1, paddingRight: 8 },
  pointTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  pointMeta: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  actionButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, minWidth: 75, alignItems: 'center' },
  btnScan: { backgroundColor: '#6366f1' },
  btnDone: { backgroundColor: '#f3f4f6' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' }
});