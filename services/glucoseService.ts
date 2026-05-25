// ────────────────────────────────────────────────────────────────
// services/glucoseService.ts
// Glucose readings & trend data dari Backend API
// ────────────────────────────────────────────────────────────────
import { httpRequest } from './httpClient';

export interface GlucoseDto {
  id: string;
  glucoseLevel: number;
  measurementType: string;
  notes?: string;
  measuredAt: string;
}

export interface GlucoseTrendPoint {
  day: string;
  value: number | null;
  date: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Semua pembacaan glukosa ───────────────────────────────────────────────────
export async function getAllGlucose(): Promise<GlucoseDto[]> {
  const res = await httpRequest<ApiResponse<GlucoseDto[]>>('/glucose');
  return res.data;
}

// ── Data trend untuk chart ────────────────────────────────────────────────────
export async function getGlucoseTrends(days: number = 7): Promise<GlucoseTrendPoint[]> {
  const res = await httpRequest<ApiResponse<GlucoseTrendPoint[]>>(`/glucose/trends?days=${days}`);
  return res.data;
}

// ── Tambah pembacaan baru ─────────────────────────────────────────────────────
export async function addGlucoseReading(
  glucoseLevel: number,
  measurementType: string,
  measuredAt: Date,
  notes?: string
): Promise<GlucoseDto> {
  const res = await httpRequest<ApiResponse<GlucoseDto>>('/glucose', {
    method: 'POST',
    body: {
      glucoseLevel,
      measurementType,
      measuredAt: measuredAt.toISOString(),
      notes,
    },
  });
  return res.data;
}

// ── Hapus pembacaan ───────────────────────────────────────────────────────────
export async function deleteGlucoseReading(id: string): Promise<void> {
  await httpRequest(`/glucose/${id}`, { method: 'DELETE' });
}
