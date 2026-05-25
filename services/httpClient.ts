// ────────────────────────────────────────────────────────────────
// services/httpClient.ts
// Fetch wrapper dengan JWT token otomatis di setiap request
// ────────────────────────────────────────────────────────────────
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

export const TOKEN_KEY = 'visioped_access_token';
export const REFRESH_KEY = 'visioped_refresh_token';

// Simpan token ke SecureStore
export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

// Hapus token (logout)
export async function clearTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

// Ambil access token
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// ── HTTP Client ───────────────────────────────────────────────────────────────
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: object;
  requiresAuth?: boolean;
}

export async function httpRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, requiresAuth = true } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || `Error ${response.status}`);
  }

  return json;
}
