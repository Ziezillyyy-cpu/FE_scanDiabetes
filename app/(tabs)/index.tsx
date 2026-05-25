import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { getGlucoseTrends, GlucoseTrendPoint } from '@/services/glucoseService';
import { getSchedulesByDate, ScheduleDto, updateSchedule } from '@/services/scheduleService';
import { getAccessToken } from '@/services/httpClient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DAYS_HEADER = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

const SCHEDULE_COLORS: Record<string, string> = {
  GlucoseCheck: '#4ECDC4',
  Medication:   '#F7941D',
  Exercise:     '#4CAF50',
  DoctorVisit:  '#9C27B0',
};

const SCHEDULE_ICONS: Record<string, any> = {
  GlucoseCheck: 'pulse',
  Medication:   'medical',
  Exercise:     'walk',
  DoctorVisit:  'person',
};

export default function DashboardScreen() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [search, setSearch] = useState('');

  // ── API State ──
  const [trends, setTrends] = useState<GlucoseTrendPoint[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ── Cek autentikasi saat mount ──
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (!token) {
        router.replace('/login');
      } else {
        setCheckingAuth(false);
        fetchTrends();
      }
    };
    checkAuth();
  }, []);

  // ── Fetch schedules when selected date changes ──
  useEffect(() => {
    if (!checkingAuth) {
      fetchSchedules();
    }
  }, [selectedDay, month, year, checkingAuth]);

  const fetchTrends = async () => {
    setLoadingTrends(true);
    try {
      const data = await getGlucoseTrends(7);
      setTrends(data);
    } catch (_) {
      // Fallback: tampilkan chart kosong
      setTrends([]);
    } finally {
      setLoadingTrends(false);
    }
  };

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const date = new Date(year, month, selectedDay);
      const data = await getSchedulesByDate(date);
      setSchedules(data);
    } catch (_) {
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleToggleSchedule = async (schedule: ScheduleDto) => {
    try {
      const updated = await updateSchedule(schedule.id, { isCompleted: !schedule.isCompleted });
      setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (_) {}
  };

  // ── Calendar logic ──
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const prevDays = getDaysInMonth(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1,
  );

  type CalDay = { day: number; cur: boolean; isToday: boolean };
  const cells: CalDay[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, cur: false, isToday: false });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({
      day: i,
      cur: true,
      isToday:
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear(),
    });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, cur: false, isToday: false });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const dateLabel = `${MONTHS_SHORT[month]} ${selectedDay}, ${year}`;

  // ── Chart computed values ──
  const maxGlucose = 180;
  const chartH = 150;
  const chartData = trends.length > 0 ? trends : Array(7).fill({ day: '-', value: null });

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: '#4ECDC4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar style="dark" backgroundColor="#4ECDC4" />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Dashboard</Text>
          <TouchableOpacity
            style={s.profileBtn}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={s.searchBar}>
          <TextInput
            style={s.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={18} color="#999" />
        </View>
      </View>

      <ScrollView
        style={s.body}
        contentContainerStyle={s.bodyInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Quick Actions ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.qaRow}
        >
          {([
            { icon: 'calendar' as const, label: 'Planned' },
            { icon: 'add-circle' as const, label: 'Daily Track' },
            { icon: 'scan' as const, label: 'Glucose Scan' },
          ]).map((a) => (
            <TouchableOpacity key={a.label} style={s.qaItem}>
              <View style={s.qaIcon}>
                <Ionicons name={a.icon} size={30} color="#FFF" />
              </View>
              <Text style={s.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Glucose Trends ── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Glucose Trends</Text>
            <Text style={s.cardSubtitle}>7 hari terakhir (mg/dL)</Text>
          </View>

          {loadingTrends ? (
            <ActivityIndicator color="#4ECDC4" style={{ paddingVertical: 40 }} />
          ) : (
            <>
              <View style={s.chartWrap}>
                {/* Y‑axis */}
                <View style={s.yAxis}>
                  {[180, 135, 90, 45, 0].map((v) => (
                    <Text key={v} style={s.yTick}>{v}</Text>
                  ))}
                </View>
                {/* Chart area */}
                <View style={[s.chartArea, { height: chartH }]}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[s.gridLine, { top: (i / 4) * chartH }]}
                    />
                  ))}

                  {/* Bars dari data API */}
                  {chartData.map((point, i) => {
                    const val = point.value ?? 0;
                    const barH = val > 0 ? Math.min((val / maxGlucose) * chartH, chartH) : 4;
                    const barColor = val > 140 ? '#FF6B6B' : val > 100 ? '#F7941D' : '#4ECDC4';
                    return (
                      <View
                        key={i}
                        style={[
                          s.bar,
                          {
                            left: `${(i / (chartData.length - 1)) * 90 + 5}%` as any,
                            height: barH,
                            bottom: 0,
                            backgroundColor: barColor,
                          }
                        ]}
                      />
                    );
                  })}

                  {/* dot untuk setiap data point */}
                  {chartData.map((point, i) => {
                    const val = point.value ?? 0;
                    const dotY = val > 0 ? chartH - (val / maxGlucose) * chartH - 4 : chartH - 8;
                    return (
                      <View
                        key={`dot-${i}`}
                        style={[
                          s.dot,
                          {
                            left: `${(i / (chartData.length - 1)) * 90 + 4}%` as any,
                            top: dotY,
                            backgroundColor: val > 0 ? '#4ECDC4' : '#DDD',
                          }
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              {/* X labels */}
              <View style={s.xRow}>
                {chartData.map((point, i) => (
                  <Text key={i} style={s.xTick}>{point.day}</Text>
                ))}
              </View>

              {/* Legend */}
              <View style={s.legend}>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: '#4ECDC4' }]} />
                  <Text style={s.legendText}>Normal (&lt;100)</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: '#F7941D' }]} />
                  <Text style={s.legendText}>Pre-diabetes</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={s.legendText}>Tinggi (&gt;140)</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* ── Your Schedule ── */}
        <View style={s.card}>
          <View style={s.schedHead}>
            <Text style={s.cardTitle}>Your schedule</Text>
            <View style={s.dateBadge}>
              <Text style={s.dateBadgeText}>{dateLabel}</Text>
            </View>
          </View>

          {/* Month nav */}
          <View style={s.monthNav}>
            <TouchableOpacity onPress={prevMonth}>
              <Ionicons name="chevron-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={s.monthLabel}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={s.calRow}>
            {DAYS_HEADER.map((d) => (
              <Text key={d} style={s.calDayHead}>{d}</Text>
            ))}
          </View>

          {/* Day cells */}
          {Array.from({ length: cells.length / 7 }).map((_, r) => (
            <View key={r} style={s.calRow}>
              {cells.slice(r * 7, r * 7 + 7).map((c, ci) => {
                const sel = c.cur && c.day === selectedDay;
                return (
                  <TouchableOpacity
                    key={ci}
                    style={[
                      s.calCell,
                      sel && s.calCellSel,
                      c.isToday && !sel && s.calCellToday,
                    ]}
                    onPress={() => c.cur && setSelectedDay(c.day)}
                  >
                    <Text
                      style={[
                        s.calCellText,
                        !c.cur && s.calCellOther,
                        sel && s.calCellTextSel,
                      ]}
                    >
                      {c.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Schedule list dari API */}
          <View style={s.scheduleList}>
            {loadingSchedules ? (
              <ActivityIndicator color="#4ECDC4" style={{ paddingVertical: 16 }} />
            ) : schedules.length === 0 ? (
              <Text style={s.noScheduleText}>Tidak ada jadwal untuk tanggal ini</Text>
            ) : (
              schedules.map((sched) => {
                const color = SCHEDULE_COLORS[sched.scheduleType] ?? '#999';
                const icon = SCHEDULE_ICONS[sched.scheduleType] ?? 'calendar';
                const timeStr = sched.scheduledTime
                  ? sched.scheduledTime.slice(0, 5)
                  : '';
                return (
                  <View key={sched.id} style={[s.scheduleItem, { borderLeftColor: color }]}>
                    <View style={[s.scheduleIcon, { backgroundColor: color + '22' }]}>
                      <Ionicons name={icon} size={18} color={color} />
                    </View>
                    <View style={s.scheduleContent}>
                      <Text style={[s.scheduleTitle, sched.isCompleted && s.scheduleCompleted]}>
                        {sched.title}
                      </Text>
                      {timeStr ? <Text style={s.scheduleTime}>{timeStr}</Text> : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToggleSchedule(sched)}
                      style={[s.checkBox, sched.isCompleted && { backgroundColor: '#4ECDC4', borderColor: '#4ECDC4' }]}
                    >
                      {sched.isCompleted && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

/* ── Styles ── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#4ECDC4' },

  /* Header */
  header: {
    backgroundColor: '#4ECDC4',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#FFF' },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },

  /* Body */
  body: { flex: 1 },
  bodyInner: { paddingHorizontal: 16, paddingTop: 18 },

  /* Quick actions */
  qaRow: { paddingRight: 20, marginBottom: 18, gap: 16 },
  qaItem: { alignItems: 'center', width: 90 },
  qaIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#3BB8B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  qaLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', textAlign: 'center' },

  /* Card */
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  cardSubtitle: { fontSize: 12, color: '#999' },

  /* Chart */
  chartWrap: { flexDirection: 'row', marginBottom: 4 },
  yAxis: { width: 36, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 6 },
  yTick: { fontSize: 10, color: '#999' },
  chartArea: { flex: 1, position: 'relative' },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#EEE',
  },
  bar: {
    position: 'absolute',
    width: 10,
    borderRadius: 3,
    marginLeft: -5,
    opacity: 0.6,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
  xRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 36,
    marginTop: 4,
  },
  xTick: { fontSize: 10, color: '#999', textAlign: 'center', flex: 1 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#666' },

  /* Schedule */
  schedHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    backgroundColor: '#E0FAF7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  dateBadgeText: { fontSize: 12, color: '#3BB8B0', fontWeight: '600' },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: { fontSize: 15, fontWeight: '600', color: '#333' },

  /* Calendar */
  calRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 2 },
  calDayHead: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  calCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  calCellSel: { backgroundColor: '#4ECDC4' },
  calCellToday: { borderWidth: 1.5, borderColor: '#4ECDC4' },
  calCellText: { fontSize: 14, color: '#333' },
  calCellOther: { color: '#CCC' },
  calCellTextSel: { color: '#FFF', fontWeight: '700' },

  /* Schedule list */
  scheduleList: { marginTop: 16, gap: 8 },
  noScheduleText: { textAlign: 'center', color: '#999', fontSize: 14, paddingVertical: 12 },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FFFE',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    gap: 10,
  },
  scheduleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleContent: { flex: 1 },
  scheduleTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  scheduleCompleted: { textDecorationLine: 'line-through', color: '#AAA' },
  scheduleTime: { fontSize: 12, color: '#888', marginTop: 2 },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
