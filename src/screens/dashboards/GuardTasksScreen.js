import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function GuardTasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    { id: '1', task: 'Inspect basement water pump room indicator', priority: 'High', completed: false },
    { id: '2', task: 'Collect emergency entrance barrier remote from Supervisor', priority: 'Medium', completed: false },
    { id: '3', task: 'Verify visitor parking structural log sheet accuracy', priority: 'Low', completed: true },
    { id: '4', task: 'Turn on outer security compound lights at sunset', priority: 'High', completed: true },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Daily Tasks</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* PENDING SECTION */}
        <Text style={styles.sectionTitle}>Pending Tasks ({tasks.filter(t => !t.completed).length})</Text>
        {tasks.filter(t => !t.completed).map((item) => (
          <TouchableOpacity key={item.id} style={styles.taskCard} onPress={() => toggleTask(item.id)}>
            <View style={styles.checkboxPlaceholder} />
            <View style={styles.taskContent}>
              <Text style={styles.taskText}>{item.task}</Text>
              <Text style={[styles.priorityText, item.priority === 'High' ? styles.textHigh : styles.textMed]}>
                • {item.priority} Priority
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* COMPLETED SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Completed Tasks</Text>
        {tasks.filter(t => t.completed).map((item) => (
          <TouchableOpacity key={item.id} style={[styles.taskCard, styles.taskCompleted]} onPress={() => toggleTask(item.id)}>
            <Text style={styles.checkMarkIcon}>✓</Text>
            <View style={styles.taskContent}>
              <Text style={[styles.taskText, styles.strikeText]}>{item.task}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#094c4c', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  taskCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  taskCompleted: { backgroundColor: '#f3f4f6', opacity: 0.7 },
  checkboxPlaceholder: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#9ca3af', marginRight: 12, marginTop: 2 },
  checkMarkIcon: { fontSize: 16, fontWeight: '900', color: '#16a34a', marginRight: 12, width: 20, textAlign: 'center' },
  taskContent: { flex: 1 },
  taskText: { fontSize: 14, fontWeight: '600', color: '#1f2937', lineHeight: 20 },
  strikeText: { textDecorationLine: 'line-through', color: '#9ca3af' },
  priorityText: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  textHigh: { color: '#ef4444' },
  textMed: { color: '#f59e0b' }
});