import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function MaintenanceScreen({ navigation }) {
  const [alerts] = useState([
    { id: '1', issue: 'Water Leakage Block C', flat: 'C-302', status: 'Urgent' },
    { id: '2', json: 'Power Failure Common Area', flat: 'Clubhouse', status: 'In Progress' }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance Control</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {alerts.map(al => (
          <View key={al.id} style={styles.card}>
            <Text style={styles.title}>{al.issue || al.json}</Text>
            <Text style={styles.sub}>Location: {al.flat} • Status: {al.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#6366f1', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 16 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  title: { fontSize: 14, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 4 }
});