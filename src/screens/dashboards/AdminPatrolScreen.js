import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function AdminPatrolScreen({ navigation }) {
  const [logs, setLogs] = useState([
    { id: '1', guard: 'Guard Suresh', point: 'Main Gate', status: 'Completed', time: '09:00 PM' },
    { id: '2', guard: 'Guard Ramesh', point: 'Rear Block B', status: 'Missed', time: '09:30 PM' },
    { id: '3', guard: 'Guard Suresh', point: 'Basement Parking', status: 'Completed', time: '10:00 PM' },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Guard Patrol Logs</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {logs.map(log => (
          <View key={log.id} style={styles.card}>
            <View>
              <Text style={styles.title}>{log.point}</Text>
              <Text style={styles.sub}>{log.guard} • {log.time}</Text>
            </View>
            <Text style={[styles.badge, log.status === 'Completed' ? styles.green : styles.red]}>{log.status}</Text>
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
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  title: { fontSize: 14, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  badge: { fontSize: 12, fontWeight: '700', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  green: { backgroundColor: '#dcfce7', color: '#16a34a' },
  red: { backgroundColor: '#fef2f2', color: '#ef4444' }
});