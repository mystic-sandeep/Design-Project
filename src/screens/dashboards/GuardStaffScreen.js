import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function GuardStaffScreen({ navigation }) {
  // Mock Data structure ready for your backend API array
  const [staffLog, setStaffLog] = useState([
    { id: '1', name: 'Ramesh Kumar', role: 'Maid (Flat B-201)', status: 'IN', time: '08:15 AM' },
    { id: '2', name: 'Sandeep Singh', role: 'Driver (Flat A-104)', status: 'OUT', time: '12:30 PM' },
    { id: '3', name: 'Anil Sharma', role: 'Electrician', status: 'IN', time: '02:45 PM' },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Staff Log</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Search Bar Placeholder */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="🔍 Search staff by name or role..." placeholderTextColor="#9ca3af" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Activity Log</Text>

        {staffLog.map((item) => (
          <View key={item.id} style={styles.logCard}>
            <View style={styles.logInfo}>
              <Text style={styles.staffName}>{item.name}</Text>
              <Text style={styles.staffRole}>{item.role}</Text>
              <Text style={styles.logTime}>Last Update: {item.time}</Text>
            </View>

            <TouchableOpacity style={[styles.statusBadge, item.status === 'IN' ? styles.bgGreen : styles.bgRed]}>
              <Text style={[styles.badgeText, item.status === 'IN' ? styles.textGreen : styles.textRed]}>
                {item.status === 'IN' ? '✓ Inside' : '✗ Exited'}
              </Text>
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
  searchContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e5e7eb' },
  searchInput: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1f2937' },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 12 },
  logCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  logInfo: { flex: 1 },
  staffName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  staffRole: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  logTime: { fontSize: 11, color: '#9ca3af', marginTop: 6 },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  bgGreen: { backgroundColor: '#dcfce7' },
  bgRed: { backgroundColor: '#fef2f2' },
  textGreen: { color: '#15803d' },
  textRed: { color: '#b91c1c' },
  badgeText: { fontSize: 12, fontWeight: '700' }
});