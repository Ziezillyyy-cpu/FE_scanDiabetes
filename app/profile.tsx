import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

type MenuItem = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
};

const MENU: MenuItem[] = [
  { icon: 'person-outline', label: 'Edit Profile' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'information-circle-outline', label: 'About' },
];

export default function ProfileScreen() {
  return (
    <View style={s.root}>
      <StatusBar style="dark" backgroundColor="#4ECDC4" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar section */}
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Ionicons name="person" size={48} color="#FFF" />
        </View>
        <Text style={s.name}>User</Text>
        <Text style={s.email}>user@example.com</Text>
      </View>

      {/* Menu */}
      <ScrollView style={s.menu} showsVerticalScrollIndicator={false}>
        <View style={s.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.menuItem, i < MENU.length - 1 && s.menuBorder]}
            >
              <Ionicons name={item.icon} size={22} color="#333" />
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={() => router.replace('/login')}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFF" />
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },

  /* Header */
  header: {
    backgroundColor: '#4ECDC4',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },

  /* Avatar */
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  email: { fontSize: 14, color: '#888', marginTop: 4 },

  /* Menu */
  menu: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuLabel: { flex: 1, marginLeft: 14, fontSize: 15, color: '#333', fontWeight: '500' },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4444',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 24,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
