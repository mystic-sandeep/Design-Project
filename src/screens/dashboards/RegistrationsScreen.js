import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function RegistrationsScreen({ navigation }) {
  const [requests] = useState([
    { id: '1', name: 'Rahul Verma', flat: 'A-504', type: 'Tenant' },
    { id: '2', name: 'Priya Sharma', flat: 'B-102', type: 'Owner' }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Resident Approvals</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {requests.map(req => (
          <View key={req.id} style={styles.card}>
            <View>
              <Text style={styles.title}>{req.name}</Text>
              <Text style={styles.sub}>Flat {req.flat} • Role: {req.type}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={[styles.btn, styles.btnApprove]}><Text style={styles.btnTxt}>Approve</Text></TouchableOpacity>
            </View>
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
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnApprove: { backgroundColor: '#16a34a' },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' }
});