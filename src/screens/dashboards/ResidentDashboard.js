import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

export default function ResidentDashboard({ navigation }) {

  const handleExit = () => {
    Alert.alert("Logout", "Do you want to log out of your resident account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Exit", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10182D" />

      {/* Header with Logout/Exit */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Resident Portal</Text>
          <Text style={styles.headerSubtitle}>Apt: A-101 | Admin User</Text>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>

        {/* Quick Actions Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🎟️</Text>
            <Text style={styles.actionLabel}>Pre-Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionLabel}>Message Guard</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Visitor Status (Matching the web version table) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Visitors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('VisitorList')}>
            <Text style={styles.viewAllText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Ruchi</Text>
              <Text style={styles.itemSub}>Personal • 05 Feb</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#00C56620' }]}>
              <Text style={[styles.statusText, { color: '#00C566' }]}>Approved</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>Delivery: Zomato</Text>
              <Text style={styles.itemSub}>Food • 04 Feb</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#635BFF20' }]}>
              <Text style={[styles.statusText, { color: '#635BFF' }]}>Entered</Text>
            </View>
          </View>
        </View>

        {/* Community Section */}
        <Text style={styles.sectionTitle}>Community</Text>
        <View style={styles.communityCard}>
          <TouchableOpacity style={styles.communityItem}>
            <Text style={styles.commIcon}>📢</Text>
            <Text style={styles.commText}>Notice Board</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.communityItem}>
            <Text style={styles.commIcon}>🛠️</Text>
            <Text style={styles.commText}>Help Desk</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Consistent Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, { color: '#635BFF' }]}>🏠</Text>
          <Text style={[styles.navLabel, { color: '#635BFF' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('VisitorList')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleExit}>
          <Text style={styles.navIcon}>🚪</Text>
          <Text style={styles.navLabel}>Logout</Text>
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
    borderRadius: 8
  },
  exitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  scrollBody: { padding: 15 },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#161F35',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242F49'
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  viewAllText: { color: '#635BFF', fontWeight: 'bold' },
  listCard: {
    backgroundColor: '#161F35',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 25
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#242F49'
  },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  itemSub: { color: '#AEB8D0', fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  communityCard: {
    backgroundColor: '#161F35',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 5
  },
  communityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15
  },
  commIcon: { fontSize: 18, marginRight: 8 },
  commText: { color: '#fff', fontWeight: '500' },
  divider: { width: 1, height: '60%', backgroundColor: '#242F49', alignSelf: 'center' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#10182D',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#242F49'
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 22, color: '#717E95' },
  navLabel: { fontSize: 10, color: '#717E95', marginTop: 4 }
});