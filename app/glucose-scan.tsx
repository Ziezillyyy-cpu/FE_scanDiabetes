import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type ScanState = 'idle' | 'photo-selected' | 'scanning' | 'done';

export default function GlucoseScanScreen() {
  const [state, setState] = useState<ScanState>('idle');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // ── Request permissions ──
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Diperlukan',
        'Aplikasi membutuhkan akses kamera untuk mengambil foto.',
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Diperlukan',
        'Aplikasi membutuhkan akses galeri untuk memilih foto.',
      );
      return false;
    }
    return true;
  };

  // ── Pick from gallery ──
  const pickFromGallery = async () => {
    setShowPicker(false);
    const granted = await requestGalleryPermission();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setState('photo-selected');
    }
  };

  // ── Take from camera ──
  const pickFromCamera = async () => {
    setShowPicker(false);
    const granted = await requestCameraPermission();
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setState('photo-selected');
    }
  };

  // ── Pick from Google Drive / Files ──
  const pickFromDrive = async () => {
    setShowPicker(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setState('photo-selected');
      }
    } catch {
      Alert.alert('Error', 'Gagal mengambil file.');
    }
  };

  // ── Scan ──
  const handleScan = () => {
    setState('scanning');
    // Simulate scanning process
    setTimeout(() => {
      setState('done');
    }, 2500);
  };

  // ── Reset ──
  const handleReset = () => {
    setState('idle');
    setImageUri(null);
  };

  return (
    <View style={s.root}>
      <StatusBar style="dark" backgroundColor="#4ECDC4" />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
          <Ionicons name="arrow-back-circle" size={32} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Glucose Scan</Text>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={s.headerBtn}
        >
          <View style={s.profileIcon}>
            <Ionicons name="person" size={18} color="#FFF" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Description ── */}
      <Text style={s.desc}>
        Unggah luka pada kaki pasien untuk mendeteksi diabetes secara otomatis
      </Text>

      {/* ── Center content area ── */}
      <View style={s.centerArea}>
        {/* ── Upload Card ── */}
        <View style={s.card}>
          {imageUri ? (
            <TouchableOpacity onPress={handleReset} activeOpacity={0.8}>
              <Image source={{ uri: imageUri }} style={s.preview} />
            </TouchableOpacity>
          ) : (
            <View style={s.placeholder}>
              <View style={s.placeholderIcon}>
                <Ionicons name="images" size={40} color="#FFF" />
                <View style={s.plusBadge}>
                  <Ionicons name="add" size={20} color="#FFF" />
                </View>
              </View>
            </View>
          )}

          <Text style={s.uploadTitle}>
            {imageUri ? 'Foto Siap' : 'Unggah Foto'}
          </Text>
          <Text style={s.uploadSub}>
            {imageUri
              ? 'Ketuk foto untuk mengganti'
              : 'Pilih dan unggah foto pasien'}
          </Text>

          {/* ── Main Action Button ── */}
          {state === 'idle' && (
            <TouchableOpacity
              style={s.actionBtn}
              onPress={() => setShowPicker(true)}
            >
              <Text style={s.actionBtnText}>Upload foto</Text>
            </TouchableOpacity>
          )}

          {state === 'photo-selected' && (
            <TouchableOpacity
              style={[s.actionBtn, s.scanBtn]}
              onPress={handleScan}
            >
              <Ionicons name="scan" size={20} color="#FFF" />
              <Text style={[s.actionBtnText, s.scanBtnText]}>Scan</Text>
            </TouchableOpacity>
          )}

          {state === 'scanning' && (
            <View style={[s.actionBtn, s.scanningBtn]}>
              <ActivityIndicator color="#FFF" size="small" />
              <Text style={[s.actionBtnText, s.scanBtnText]}>Scanning...</Text>
            </View>
          )}

          {state === 'done' && (
            <TouchableOpacity
              style={[s.actionBtn, s.doneBtn]}
              onPress={handleReset}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={[s.actionBtnText, s.scanBtnText]}>Scan Selesai</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Result Button (always at bottom, only visible after scan done) ── */}
      <View style={s.resultContainer}>
        {state === 'done' && (
          <TouchableOpacity style={s.resultBtn}>
            <Text style={s.resultBtnText}>Result</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Source Picker Modal ── */}
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <Text style={s.sheetTitle}>Pilih Sumber Foto</Text>

            <TouchableOpacity style={s.sheetItem} onPress={pickFromGallery}>
              <View style={[s.sheetIcon, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="images-outline" size={22} color="#FFF" />
              </View>
              <View>
                <Text style={s.sheetLabel}>Galeri</Text>
                <Text style={s.sheetSub}>Pilih dari galeri foto</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.sheetItem} onPress={pickFromCamera}>
              <View style={[s.sheetIcon, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="camera-outline" size={22} color="#FFF" />
              </View>
              <View>
                <Text style={s.sheetLabel}>Kamera</Text>
                <Text style={s.sheetSub}>Ambil foto langsung</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.sheetItem} onPress={pickFromDrive}>
              <View style={[s.sheetIcon, { backgroundColor: '#F7941D' }]}>
                <Ionicons name="cloud-outline" size={22} color="#FFF" />
              </View>
              <View>
                <Text style={s.sheetLabel}>Google Drive</Text>
                <Text style={s.sheetSub}>Pilih dari penyimpanan cloud</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.sheetCancel}
              onPress={() => setShowPicker(false)}
            >
              <Text style={s.sheetCancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#4ECDC4' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  profileIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Description */
  desc: {
    fontSize: 14,
    color: '#1A1A2E',
    paddingHorizontal: 20,
    marginBottom: 16,
    lineHeight: 20,
  },

  /* Center area */
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  /* Card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  placeholderIcon: { position: 'relative' },
  plusBadge: {
    position: 'absolute',
    right: -14,
    bottom: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    marginTop: 20,
  },
  uploadTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  uploadSub: { fontSize: 13, color: '#555', marginBottom: 20 },

  /* Action buttons */
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 40,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  scanBtn: { backgroundColor: '#4ECDC4' },
  scanBtnText: { color: '#FFF' },
  scanningBtn: { backgroundColor: '#3BB8B0' },
  doneBtn: { backgroundColor: '#2ECC71' },

  /* Result */
  resultContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 62,
  },
  resultBtn: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultBtnText: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },

  /* Modal / Bottom Sheet */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  sheetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  sheetSub: { fontSize: 12, color: '#888', marginTop: 2 },
  sheetCancel: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  sheetCancelText: { fontSize: 15, fontWeight: '600', color: '#666' },
});
