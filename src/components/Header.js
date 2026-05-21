// src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title }) {
  const navigation = useNavigation();

  // Bulletproof height calculation with a solid fallback value (24-30px) for Android devices
  const getStatusBarPadding = () => {
    if (Platform.OS === 'ios') {
      return 44;
    }
    // If StatusBar.currentHeight is falsy or 0, fallback to a standard safe padding of 30px
    return StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 30;
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: getStatusBarPadding() }]}>
      {/* Ensures the platform status bar configuration matches our header */}
      <StatusBar barStyle="light-content" backgroundColor="#0a4a4a" translucent={true} />

      <View style={styles.headerContent}>
        <Text style={styles.headerText}>{title}</Text>

        {/* Profile Button - Elevated touch areas */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileScreen')}
          activeOpacity={0.7}
          style={styles.profileButton}
        >
          <View style={styles.avatarMiniCircle}>
            <Text style={styles.avatarIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0a4a4a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    height: 56, // Fixed viewport size independent of status bar allocations
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  profileButton: {
    minWidth: 44,
    minHeight: 44, // Meets minimum mobile hit target standards
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIconText: {
    fontSize: 18,
  }
});