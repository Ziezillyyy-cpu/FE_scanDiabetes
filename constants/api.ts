// ────────────────────────────────────────────────────────────────
// constants/api.ts
// Base URL dan konfigurasi HTTP untuk koneksi ke Backend
// ────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';

// Saat run di emulator Android → 10.0.2.2 adalah host machine
// Saat run di device fisik atau iOS/web → pakai IP lokal komputer kamu
// Ganti dengan IP komputer kamu jika test di device fisik!
const getBaseUrl = () => {
  // Menggunakan IP lokal komputer agar bisa diakses oleh device fisik (Expo Go)
  return 'http://100.101.22.25:5017/api';
};

export const API_BASE_URL = getBaseUrl();

// Port default saat run `dotnet run` adalah 5066 (HTTP)
// Cek di Properties/launchSettings.json jika beda
