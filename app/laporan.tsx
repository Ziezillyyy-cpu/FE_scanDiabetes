import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

//1. Data Mockup - Menambahkan untuk menambahkan category dan juga time 
const DAILY_TASKS = [
  { id: '1', title: 'Periksa Gula Darah', sub: 'Pagi - Sebelum Makan', time: '07:00', icon: 'water', color: '#FF5252', completed: true },
  { id: '2', title: 'Waktu Makan', sub: 'Sarapan Sehat', time: '08:00', icon: 'silverware-fork-knife', color: '#FFA726', completed: true },
  { id: '3', title: 'Daily Steps', sub: 'Target: 5.000 langkah', time: '10:00', icon: 'footprint', color: '#42A5F5', completed: false },
  { id: '4', title: 'Waktu Makan', sub: 'Makan Siang', time: '13:00', icon: 'silverware-fork-knife', color: '#FFA726', completed: false },
  { id: '5', title: 'Periksa Gula Darah', sub: 'Malam - Sebelum Tidur', time: '20:00', icon: 'water', color: '#FF5252', completed: false },
];

export default function DailyTrackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Daily Track</Text>
        
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="person" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* MAIN TRACK CARD */}
        <View style={styles.mainCard}>
          <Text style={styles.cardHeader}>Rencana Hari Ini</Text>
          
          {DAILY_TASKS.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.taskRow}>
                <View style={styles.taskLeft}>
                  {/* Icon Container */}
                  <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  
                  {/* Text Info */}
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskSub}>{item.sub} • {item.time}</Text>
                  </View>
                </View>

                {/* Status Indicator */}
                <View style={styles.statusContainer}>
                  {item.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  ) : (
                    <View style={styles.pendingCircle} />
                  )}
                </View>
              </TouchableOpacity>
              
              {/* Separator - Menghilangkan garis di item terakhir */}
              {index !== DAILY_TASKS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* SUMMARY CARD (Kartu bawah yang tadi kosong) */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Progres Kesehatan</Text>
            <Text style={styles.summaryPercent}>40%</Text>
          </View>
          
          {/* Progress Bar Dummy */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
          
          <Text style={styles.summaryFooter}>2 dari 5 aktivitas selesai hari ini</Text>
        </View>

      </ScrollView>

      {/* Bottom Home Indicator (iOS style) */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#57E4AC', // Warna Hijau Mint sesuai gambar asli
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3F429B', // Warna biru keunguan
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 30,
    padding: 20,
    // Shadow untuk iOS & Android
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    marginLeft: 15,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  taskSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusContainer: {
    paddingLeft: 10,
  },
  pendingCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 60, // Menyesuaikan dengan posisi teks agar lebih rapi
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 30,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  summaryPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3F429B',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#57E4AC',
    borderRadius: 5,
  },
  summaryFooter: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
    fontStyle: 'italic',
  },
  homeIndicator: {
    height: 5,
    width: 140,
    backgroundColor: '#000',
    borderRadius: 10,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  }
});