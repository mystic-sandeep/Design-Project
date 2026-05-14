// src/components/maid/MaidTaskCard.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function MaidTaskCard({ task, onAccept, onComplete }) {
  // Determine priority indicator line color matching web dashboard parameters
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444'; // Red
      case 'medium': return '#eab308'; // Yellow
      default: return '#3b82f6'; // Blue
    }
  };

  return (
    <View style={styles.taskCard}>
      {/* Priority Border Strip Indicator */}
      <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) }]} />

      {/* Task Information Data Details */}
      <View style={styles.taskInfoContainer}>
        <Text style={styles.taskTitleText}>{task.title}</Text>
        <Text style={styles.taskMetaText}>
          📍 {task.location || 'Flat —'} • 📅 Due: {task.dueDate || 'Today'}
        </Text>
        {task.description ? (
          <Text style={styles.taskDescText} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* Action Controller State Machine (Pending -> Accepted -> Done) */}
      <View style={styles.taskControlContainer}>
        {task.status === 'pending' && (
          <TouchableOpacity style={styles.btnAccept} onPress={() => onAccept(task.id)}>
            <Text style={styles.controlBtnText}>Accept</Text>
          </TouchableOpacity>
        )}

        {task.status === 'accepted' && (
          <TouchableOpacity style={styles.btnDone} onPress={() => onComplete(task.id)}>
            <Text style={styles.controlBtnText}>Done ✓</Text>
          </TouchableOpacity>
        )}

        {task.status === 'done' && (
          <View style={styles.statusBadgeCompleted}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priorityTag: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  taskInfoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  taskMetaText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  taskDescText: {
    fontSize: 11,
    color: '#4b5563',
    marginTop: 4,
    fontStyle: 'italic',
  },
  taskControlContainer: {
    minWidth: 75,
    alignItems: 'flex-end',
  },
  btnAccept: {
    backgroundColor: '#6366f1', // Direct Indigo match from web panel
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnDone: {
    backgroundColor: '#22c55e', // Emerald Success Green
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  controlBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusBadgeCompleted: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  completedText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
});