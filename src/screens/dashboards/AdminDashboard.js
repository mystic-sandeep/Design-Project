import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, Alert
} from 'react-native';

export default function AdminDashboard({ navigation }) {

  const handleExit = () => {
    Alert.alert("Logout", "Do you want to exit to the login page?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        onPress: () => navigation.replace('Login'), // Returns to Login and clears stack
        style: "destructive"
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182D" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Full system overview</Text>
        </View>

        {/* ADDED EXIT BUTTON */}
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#635BFF' }]}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Visitors Today</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#FFB800' }]}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Active Staff</Text>
          </View>
        </View>

        {/* Recent Visitors Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Visitors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VisitorList')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableRow}>
            <Text style={styles.rowTextMain}>Ruchi</Text>
            <Text style={styles.rowTextSub}>Apt 1</Text>
            <Text style={styles.statusText}>Approved</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowTextMain}>Shruti Tripathi</Text>
            <Text style={styles.rowTextSub}>Apt 1</Text>
            <Text style={styles.statusText}>Approved</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminDashboard')}>
          <Text style={[styles.navIcon, {color: '#635BFF'}]}>📊</Text>
          <Text style={[styles.navLabel, {color: '#635BFF'}]}>Dash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VisitorList')}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Visitors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ResidentList')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Residents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffList')}>
          <Text style={styles.navIcon}>🔧</Text>
          <Text style={styles.navLabel}>Staff</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1223' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#10182D'
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#AEB8D0', fontSize: 12 },
  exitButton: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollBody: { padding: 15 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: '48%',
    backgroundColor: '#161F35',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#AEB8D0', fontSize: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  viewAllText: { color: '#635BFF', fontWeight: 'bold' },
  tableCard: { backgroundColor: '#161F35', borderRadius: 12, padding: 10 },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242F49'
  },
  rowTextMain: { color: '#fff', fontWeight: '600', flex: 2 },
  rowTextSub: { color: '#AEB8D0', flex: 1 },
  statusText: { color: '#00C566', fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#10182D',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#242F49'
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 20, color: '#717E95' },
  navLabel: { fontSize: 10, color: '#717E95', marginTop: 4 }
});