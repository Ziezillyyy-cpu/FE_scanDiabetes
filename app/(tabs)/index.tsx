import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

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
const CHART_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

export default function DashboardScreen() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [search, setSearch] = useState('');

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

  // ── Chart constants ──
  const yLabels = [150, 112, 75, 37, 0];
  const chartH = 150;

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
        {/* ── Quick Actions (horizontal scroll) ── */}
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
          <Text style={s.cardTitle}>Glucose Trends</Text>
          <View style={s.chartWrap}>
            {/* Y‑axis */}
            <View style={s.yAxis}>
              {yLabels.map((v) => (
                <Text key={v} style={s.yTick}>{v}</Text>
              ))}
            </View>
            {/* Chart area */}
            <View style={[s.chartArea, { height: chartH }]}>
              {yLabels.map((_, i) => (
                <View
                  key={i}
                  style={[
                    s.gridLine,
                    { top: (i / (yLabels.length - 1)) * chartH },
                  ]}
                />
              ))}
              {/* flat line at 0 */}
              <View style={[s.dataLine, { top: chartH - 2 }]} />
              {/* dots */}
              {CHART_DAYS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    s.dot,
                    {
                      left: `${(i / (CHART_DAYS.length - 1)) * 100}%` as any,
                      top: chartH - 5,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          {/* X labels */}
          <View style={s.xRow}>
            {CHART_DAYS.map((d) => (
              <Text key={d} style={s.xTick}>{d}</Text>
            ))}
          </View>
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
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },

  /* Chart */
  chartWrap: { flexDirection: 'row', marginBottom: 4 },
  yAxis: { width: 32, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 6 },
  yTick: { fontSize: 10, color: '#999' },
  chartArea: { flex: 1, position: 'relative' },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#EEE',
  },
  dataLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4ECDC4',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginLeft: -4,
  },
  xRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 32,
    marginTop: 4,
  },
  xTick: { fontSize: 10, color: '#999', textAlign: 'center' },

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
});
