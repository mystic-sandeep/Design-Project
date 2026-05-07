import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const mockStaff = [
  { id: '1', name: 'Security Guard', role: 'Guard', status: 'active', checkIn: '05 Feb, 03:05 pm' },
  { id: '2', name: 'Security Guard', role: 'Guard', status: 'active', checkIn: '05 Feb, 01:55 pm' },
];

export default function StaffListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Staff Management</Text>
      </View>

      <FlatList
        data={mockStaff}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subText}>Role: {item.role}</Text>
              <Text style={styles.subText}>Checked in: {item.checkIn}</Text>
            </View>
            <View style={styles.statusBadge}><Text style={styles.statusText}>{item.status}</Text></View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1223', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  backText: { color: '#635BFF', fontSize: 16, marginRight: 15 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#161F35', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subText: { color: '#AEB8D0', fontSize: 12, marginTop: 2 },
  statusBadge: { backgroundColor: 'rgba(0, 197, 102, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#00C566', fontSize: 10, fontWeight: 'bold' }
});