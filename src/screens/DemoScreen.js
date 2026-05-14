import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function DemoScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Switch to Mygate now</Text>
          <Text style={styles.subtitle}>
            Book a free demo & watch how Mygate makes every task smoother & faster.
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>NAME</Text>
                <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>MOBILE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 00000 00000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>SOCIETY NAME</Text>
              <TextInput style={styles.input} placeholder="Society name" placeholderTextColor="#9ca3af" />
            </View>

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit →</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backLink}>
              <Text style={styles.backLinkText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9f7' },
  scrollContent: { padding: 20, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#111', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6b7280', lineHeight: 24, marginBottom: 30 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 5 },
  row: { flexDirection: 'row', gap: 12 },
  field: { flex: 1, marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#6b7280', marginBottom: 8, letterSpacing: 1 },
  input: { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 15 },
  submitBtn: { backgroundColor: '#f5c800', padding: 18, borderRadius: 50, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#0a4a4a', fontWeight: '800', fontSize: 16 },
  backLink: { marginTop: 20, alignItems: 'center' },
  backLinkText: { color: '#0a4a4a', fontWeight: '600', textDecorationLine: 'underline' }
});