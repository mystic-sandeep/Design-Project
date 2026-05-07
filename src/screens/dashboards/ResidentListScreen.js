import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const mockResidents = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', apt: 'A-101', phone: '9876543210', status: 'active' },
];

export default function ResidentListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Resident Directory</Text>
      </View>

      <FlatList
        data={mockResidents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subText}>{item.email}</Text>
              <Text style={styles.subText}>Apt: {item.apt} | {item.phone}</Text>
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
  card: { backgroundColor: '#161F35', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  name: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subText: { color: '#AEB8D0', fontSize: 12, marginTop: 2 },
  statusBadge: { backgroundColor: 'rgba(0, 197, 102, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#00C566', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }
});