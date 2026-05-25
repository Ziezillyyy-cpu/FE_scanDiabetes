// ────────────────────────────────────────────────────────────────
// services/authService.ts
// Register, Login, Logout ke Backend API
// ────────────────────────────────────────────────────────────────
import { httpRequest, saveTokens, clearTokens } from './httpClient';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  diabetesType?: string;
  profilePictureUrl?: string;
  dateOfBirth?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Register ──────────────────────────────────────────────────────────────────
export async function register(
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
  diabetesType?: string
): Promise<UserDto> {
  const res = await httpRequest<ApiResponse<AuthResponse>>('/auth/register', {
    method: 'POST',
    requiresAuth: false,
    body: { name, email, password, phoneNumber, diabetesType },
  });

  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.user;
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<UserDto> {
  const res = await httpRequest<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    requiresAuth: false,
    body: { email, password },
  });

  await saveTokens(res.data.accessToken, res.data.refreshToken);
  return res.data.user;
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  try {
    await httpRequest('/auth/logout', { method: 'POST' });
  } catch (_) {
    // tetap lanjut clear token meskipun request gagal
  } finally {
    await clearTokens();
  }
}

// ── Get Profile ───────────────────────────────────────────────────────────────
export async function getMyProfile(): Promise<UserDto> {
  const res = await httpRequest<ApiResponse<UserDto>>('/users/me');
  return res.data;
}

// ── Update Profile ────────────────────────────────────────────────────────────
export async function updateProfile(data: Partial<UserDto>): Promise<UserDto> {
  const res = await httpRequest<ApiResponse<UserDto>>('/users/me', {
    method: 'PUT',
    body: data,
  });
  return res.data;
}
