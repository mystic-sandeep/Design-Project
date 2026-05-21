import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function AdminTasksScreen({ navigation }) {
  const [tasks] = useState([
    { id: '1', title: 'Fix Lift B Maintenance Issue', assignTo: 'Technician Amit', status: 'Pending' },
    { id: '2', title: 'Perimeter Wall Inspection', assignTo: 'Guard Suresh', status: 'Completed' },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tasks.map(task => (
          <View key={task.id} style={styles.card}>
            <View>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.sub}>Assigned to: {task.assignTo}</Text>
            </View>
            <Text style={styles.status}>{task.status}</Text>
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
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  status: { fontSize: 12, fontWeight: '700', color: '#4b5563' }
});