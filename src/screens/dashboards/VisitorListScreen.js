import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

const visitors = [
  { id: '1', name: 'Ruchi', apt: '1', reason: 'Meetup', status: 'approved', time: '05 Feb, 03:06 pm' },
  { id: '2', name: 'Shruti Tripathi', apt: '1', reason: 'Meetup', status: 'approved', time: '05 Feb, 02:24 pm' },
  { id: '3', name: 'ST', apt: '5', reason: 'Meetup', status: 'approved', time: '05 Feb, 02:03 pm' },
];

export default function VisitorListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Visitor Management</Text>
      </View>

      <FlatList
        data={visitors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>Apartment {item.apt} • {item.reason}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1223', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  backBtn: { color: '#635BFF', fontSize: 16, fontWeight: 'bold', marginRight: 15 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#161F35', borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  details: { color: '#AEB8D0', fontSize: 13, marginTop: 2 },
  time: { color: '#717E95', fontSize: 11, marginTop: 4 },
  badge: { backgroundColor: 'rgba(0, 197, 102, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#00C566', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }
});