// ────────────────────────────────────────────────────────────────
// services/scheduleService.ts
// Jadwal / schedule API calls
// ────────────────────────────────────────────────────────────────
import { httpRequest } from './httpClient';

export interface ScheduleDto {
  id: string;
  title: string;
  description?: string;
  scheduleType: string;
  scheduledDate: string;  // format: YYYY-MM-DD
  scheduledTime?: string; // format: HH:mm:ss
  isCompleted: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Jadwal berdasarkan tanggal ─────────────────────────────────────────────────
export async function getSchedulesByDate(date: Date): Promise<ScheduleDto[]> {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const res = await httpRequest<ApiResponse<ScheduleDto[]>>(`/schedules?date=${dateStr}`);
  return res.data;
}

// ── Semua jadwal ──────────────────────────────────────────────────────────────
export async function getAllSchedules(): Promise<ScheduleDto[]> {
  const res = await httpRequest<ApiResponse<ScheduleDto[]>>('/schedules');
  return res.data;
}

// ── Buat jadwal baru ──────────────────────────────────────────────────────────
export async function createSchedule(
  title: string,
  scheduleType: string,
  scheduledDate: Date,
  scheduledTime?: string,
  description?: string
): Promise<ScheduleDto> {
  const res = await httpRequest<ApiResponse<ScheduleDto>>('/schedules', {
    method: 'POST',
    body: {
      title,
      description,
      scheduleType,
      scheduledDate: scheduledDate.toISOString().split('T')[0],
      scheduledTime: scheduledTime ?? null,
    },
  });
  return res.data;
}

// ── Mark jadwal selesai / update ──────────────────────────────────────────────
export async function updateSchedule(
  id: string,
  updates: { isCompleted?: boolean; title?: string }
): Promise<ScheduleDto> {
  const res = await httpRequest<ApiResponse<ScheduleDto>>(`/schedules/${id}`, {
    method: 'PUT',
    body: updates,
  });
  return res.data;
}

// ── Hapus jadwal ──────────────────────────────────────────────────────────────
export async function deleteSchedule(id: string): Promise<void> {
  await httpRequest(`/schedules/${id}`, { method: 'DELETE' });
}
