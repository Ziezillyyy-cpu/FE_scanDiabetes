import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { getMyProfile, logout, UserDto } from '@/services/authService';

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

const DIABETES_LABELS: Record<string, string> = {
  Type1: 'Diabetes Tipe 1',
  Type2: 'Diabetes Tipe 2',
  PreDiabetes: 'Pre-Diabetes',
  None: 'Tidak ada',
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setUser(data);
    } catch (_) {
      // Jika gagal (token expired dll) → kembali ke login
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

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
        {loading ? (
          <ActivityIndicator color="#4ECDC4" size="large" />
        ) : (
          <>
            <View style={s.avatar}>
              <Ionicons name="person" size={48} color="#FFF" />
            </View>
            <Text style={s.name}>{user?.name ?? 'User'}</Text>
            <Text style={s.email}>{user?.email ?? ''}</Text>

            {/* Diabetes type badge */}
            {user?.diabetesType && (
              <View style={s.badge}>
                <Ionicons name="pulse" size={12} color="#4ECDC4" />
                <Text style={s.badgeText}>
                  {DIABETES_LABELS[user.diabetesType] ?? user.diabetesType}
                </Text>
              </View>
            )}

            {/* Stats row */}
            <View style={s.statsRow}>
              {user?.gender && (
                <View style={s.statItem}>
                  <Ionicons
                    name={user.gender === 'Male' ? 'male' : 'female'}
                    size={16}
                    color="#4ECDC4"
                  />
                  <Text style={s.statText}>{user.gender}</Text>
                </View>
              )}
              {user?.phoneNumber && (
                <View style={s.statItem}>
                  <Ionicons name="call-outline" size={16} color="#4ECDC4" />
                  <Text style={s.statText}>{user.phoneNumber}</Text>
                </View>
              )}
            </View>
          </>
        )}
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
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
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
    minHeight: 180,
    justifyContent: 'center',
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

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0FAF7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  badgeText: { fontSize: 12, color: '#3BB8B0', fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: { fontSize: 13, color: '#666' },

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
