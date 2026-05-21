import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

export default function RegisterVisitorForm({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    flatNumber: '',
    reason: ''
  });

  const handleRegister = async () => {
    // 1. Basic Validation
    if (!formData.name || !formData.phone || !formData.flatNumber) {
      Alert.alert("Missing Fields", "Please fill in the visitor's name, phone, and flat number.");
      return;
    }

    setLoading(true);

    try {
      /* 2. API Integration
        Replace this URL with your actual backend endpoint.
        Your backend MUST handle the logic of taking this 'pending' visitor,
        alerting the Admin, and sending the push notification to the Resident.
      */
      const response = await fetch('https://your-api-base-url.com/api/v2/visitors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_name: formData.name,
          phone: formData.phone,
          flat_number: formData.flatNumber,
          reason_of_visit: formData.reason,
          status: 'pending', // This tells the admin/resident it needs approval
          timestamp: new Date().toISOString()
        })
      });

      // --- REMOVE THIS TIMEOUT IN PRODUCTION (Used here just to simulate network delay for testing) ---
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Success Handling
      Alert.alert(
        "Visitor Registered",
        "Approval request has been sent to the Resident and Admin.",
        [{ text: "OK", onPress: () => navigation.goBack() }] // Returns guard to dashboard
      );

    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Network Error", "Could not register visitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Visitor</Text>
        <View style={{ width: 50 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Visitor Details</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Doe"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />

          <Text style={styles.label}>Visiting Flat / Unit *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. A-402"
            value={formData.flatNumber}
            onChangeText={(text) => setFormData({ ...formData, flatNumber: text })}
          />

          <Text style={styles.label}>Reason for Visit</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Delivery, Guest, Maintenance"
            multiline={true}
            numberOfLines={3}
            value={formData.reason}
            onChangeText={(text) => setFormData({ ...formData, reason: text })}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Send Approval Request</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#094c4c',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16
  },
  backBtn: { padding: 8 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#4b5563', marginBottom: 6 },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  submitBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});