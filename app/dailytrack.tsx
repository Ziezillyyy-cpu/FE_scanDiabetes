import { useState } from "react";

type Screen = "home" | "riwayat" | "reminder" | "mood" | "profil";
type ActivityType = "glucose" | "meal" | "steps" | "water";
type StatusType = "normal" | "warning" | "good" | "info";

interface Activity {
  id: string; type: ActivityType; label: string; sublabel: string;
  value: string; unit: string; status: StatusType;
}

const COLORS: Record<ActivityType, { bg: string; icon: string }> = {
  glucose: { bg: "#FFF0F0", icon: "#D94F4F" },
  meal:    { bg: "#FFF5E8", icon: "#D4720F" },
  steps:   { bg: "#EBF3FF", icon: "#3A74C8" },
  water:   { bg: "#E8F8FF", icon: "#1E9EBB" },
};

const BADGE: Record<StatusType, { bg: string; color: string; label: string }> = {
  warning: { bg: "#FFF3E0", color: "#A05C00", label: "Sedikit tinggi" },
  good:    { bg: "#E8F8F0", color: "#1A6E45", label: "Normal" },
  normal:  { bg: "#EEF2FF", color: "#2456A4", label: "Normal" },
  info:    { bg: "#EEF2FF", color: "#2456A4", label: "Progres" },
};

const TYPE_OPTIONS: { type: ActivityType; label: string; unit: string; default: string }[] = [
  { type: "glucose", label: "Gula darah",  unit: "mg/dL",   default: "100" },
  { type: "meal",    label: "Makan",       unit: "kcal",    default: "300" },
  { type: "steps",   label: "Langkah",     unit: "langkah", default: "500" },
  { type: "water",   label: "Air minum",   unit: "ml",      default: "250" },
];

const INITIAL: Activity[] = [
  { id:"1", type:"glucose", label:"Periksa gula darah", sublabel:"07:30",              value:"124",   unit:"mg/dL",   status:"warning" },
  { id:"2", type:"meal",    label:"Waktu makan",        sublabel:"08:00 · Sarapan",    value:"420",   unit:"kcal",    status:"good"    },
  { id:"3", type:"steps",   label:"Daily steps",        sublabel:"09:15",              value:"3.241", unit:"langkah", status:"info"    },
  { id:"4", type:"meal",    label:"Waktu makan",        sublabel:"12:00 · Makan siang",value:"380",   unit:"kcal",    status:"good"    },
  { id:"5", type:"glucose", label:"Periksa gula darah", sublabel:"13:00",              value:"98",    unit:"mg/dL",   status:"good"    },
];

// Menghapus reminder obat, menyisakan daily activity saja
const REMINDERS = [
  { time:"07:30", bg:"#FFF0F0", ic:"#D94F4F", icon:"🩸", label:"Cek gula darah",        sub:"Setiap hari · Pagi",           on: true  },
  { time:"12:00", bg:"#FFF5E8", ic:"#D4720F", icon:"🍽",  label:"Waktu makan siang",     sub:"Senin – Jumat",                on: true  },
  { time:"13:00", bg:"#FFF0F0", ic:"#D94F4F", icon:"🩸", label:"Cek gula setelah makan",sub:"2 jam setelah makan siang",    on: false },
  { time:"18:00", bg:"#E8F8FF", ic:"#1E9EBB", icon:"💧", label:"Minum air",             sub:"Target 2L per hari",           on: true  },
];

const SYMPTOMS = [
  { label: "Tidak ada gejala",     color: "#4ECBA8", active: true  },
  { label: "Pusing / sakit kepala",color: "#FFB3B3", active: false },
  { label: "Lemas / gemetar",      color: "#FFD4A8", active: false },
  { label: "Berkeringat berlebih", color: "#FFD4A8", active: false },
];

const MOODS = [
  { label: "Baik",   em: "😊" },
  { label: "Biasa",  em: "😐" },
  { label: "Lemas",  em: "🥱" },
  { label: "Stres",  em: "😫" },
];

const CHART_BARS = [
  { h: 70,  color: "#FFD4A8", day: "Sen" },
  { h: 45,  color: "#4ECBA8", day: "Sel" },
  { h: 80,  color: "#FFD4A8", day: "Rab" },
  { h: 50,  color: "#4ECBA8", day: "Kam" },
  { h: 90,  color: "#FFB3B3", day: "Jum" },
  { h: 55,  color: "#4ECBA8", day: "Sab" },
  { h: 60,  color: "#4ECBA8", day: "Min" },
];

function ActivityIcon({ type, color }: { type: ActivityType; color: string }) {
  if (type === "glucose") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2C9 2 3.5 7.5 3.5 11.5C3.5 14.5 6 17 9 17C12 17 14.5 14.5 14.5 11.5C14.5 7.5 9 2Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
  if (type === "meal") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6 2V8C6 9.1 6.9 10 8 10V16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 10V2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 2V7C13 8.1 12.1 9 11 9V16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
  if (type === "steps") return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <ellipse cx="6.5" cy="5.5" rx="2.5" ry="3.5" stroke={color} strokeWidth="1.5" />
      <ellipse cx="11.5" cy="12.5" rx="2.5" ry="3.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.5" />
      <path d="M9 5V13" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  phone: {
    width: 390, borderRadius: 44, background: "#4ECBA8", overflow: "hidden", position: "relative",
    boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
    fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
  },
  statusBar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 28px 4px" },
  statusTime: { fontSize:15, fontWeight:600, color:"#fff" },
  statusIcons: { display:"flex", gap:6, alignItems:"center" },
  hdr: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 20px 14px" },
  hdrBtn: { width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  hdrTitle: { fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"0.01em" },
  dateLine: { display:"flex", alignItems:"center", gap:6, padding:"0 20px 14px" },
  dateText: { fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:500 },
  dateDot: { width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.4)", flexShrink:0 },
  card: { background:"#fff", borderRadius:24, margin:"0 12px", paddingBottom:8 },
  cardHdr: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px 6px" },
  cardLbl: { fontSize:10, fontWeight:600, color:"#BBBBBB", letterSpacing:"0.08em", textTransform:"uppercase" as const },
  row: { display:"flex", alignItems:"center", gap:12, padding:"10px 18px" },
  divider: { height:"0.5px", background:"#F2F2F2", margin:"0 18px" },
  iconWrap: { width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  rowLabel: { fontSize:14, fontWeight:500, color:"#1C1C1E", lineHeight:1.2 },
  rowSub: { fontSize:11, color:"#BBBBBB", marginTop:2 },
  rowVal: { fontSize:13, fontWeight:600, color:"#1C1C1E", textAlign:"right" as const },
  rowUnit: { fontSize:10, fontWeight:400, color:"#CCCCCC" },
  badge: { display:"inline-block", marginTop:3, padding:"2px 7px", borderRadius:20, fontSize:10, fontWeight:500 },
  strip: { margin:"0 12px 12px", background:"#fff", borderRadius:20, display:"flex", padding:"12px 0" },
  stripSep: { width:"0.5px", background:"#EBEBEB", alignSelf:"stretch" },
  plusBtn: { width:28, height:28, borderRadius:"50%", background:"#4ECBA8", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
};

export default function DailyTrack() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activities, setActivities] = useState<Activity[]>(INITIAL);
  const [showSheet, setShowSheet] = useState(false);
  const [selType, setSelType] = useState<ActivityType>("glucose");
  const [inputVal, setInputVal] = useState("100");
  const [selMood, setSelMood] = useState(0);
  const [reminders, setReminders] = useState(REMINDERS.map(r => ({ ...r })));
  const [chartTab, setChartTab] = useState<"7" | "30" | "3bln">("7");

  const opt = TYPE_OPTIONS.find(o => o.type === selType)!;
  const avgGlucose = Math.round(activities.filter(a => a.type === "glucose").reduce((s, a) => s + parseInt(a.value), 0) / Math.max(activities.filter(a => a.type === "glucose").length, 1));
  const totalSteps = activities.filter(a => a.type === "steps").reduce((s, a) => s + parseInt(a.value.replace(/\./g, "").replace(",", "")), 0);
  const totalWater = activities.filter(a => a.type === "water").reduce((s, a) => s + parseInt(a.value), 0);

  // Skor Kontrol (Hanya Berbasis Aktivitas/Tracking)
  const glucoseReadings = activities.filter(a => a.type === "glucose");
  const glucoseInTarget = glucoseReadings.filter(a => { const v = parseInt(a.value); return v >= 80 && v <= 140; }).length;
  const glucoseScore = glucoseReadings.length > 0 ? Math.round((glucoseInTarget / glucoseReadings.length) * 50) : 0;
  const stepsScore = Math.min(Math.round((totalSteps / 6000) * 20), 20);
  const streakDays = 8;
  const streakScore = Math.min(streakDays * 4, 30);
  const totalScore = Math.min(glucoseScore + stepsScore + streakScore, 100);

  const scoreLabel = totalScore >= 80 ? "Progres Sangat Baik" : totalScore >= 50 ? "Progres Cukup" : "Perlu Konsisten";
  const scoreLabelColor = totalScore >= 80 ? { bg:"#E8F8F0", color:"#1A6E45" } : totalScore >= 50 ? { bg:"#FFF3E0", color:"#A05C00" } : { bg:"#FFF0F0", color:"#D94F4F" };
  const scoreCircumference = 314;
  const scoreOffset = scoreCircumference - (totalScore / 100) * scoreCircumference;

  function handleSave() {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const num = parseInt(inputVal);
    const status: StatusType = selType === "glucose" ? (num < 80 || num > 140 ? "warning" : "good") : "good";
    setActivities(prev => [...prev, {
      id: Date.now().toString(), type: selType,
      label: selType === "glucose" ? "Periksa gula darah" : opt.label,
      sublabel: time, value: inputVal, unit: opt.unit, status,
    }]);
    setShowSheet(false);
  }

  const navItems: { id: Screen; label: string; icon: string }[] = [
    { id:"home",    label:"Home",    icon:"🏠" },
    { id:"riwayat", label:"Tren",    icon:"📊" },
    { id:"reminder",label:"Alarm",   icon:"🔔" },
    { id:"mood",    label:"Mood",    icon:"😊" },
    { id:"profil",  label:"Profil",  icon:"👤" },
  ];

  function Header({ title }: { title: string }) {
    return (
      <>
        <div style={s.statusBar}>
          <span style={s.statusTime}>9:41</span>
          <div style={s.statusIcons}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4"/><rect x="4.5" y="4" width="3" height="8" rx="1" opacity="0.65"/><rect x="9" y="2" width="3" height="10" rx="1" opacity="0.85"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5C8.8 9.5 9.5 10.2 9.5 11S8.8 12.5 8 12.5 6.5 11.8 6.5 11 7.2 9.5 8 9.5Z" fill="white"/><path d="M3.5 7C5 5.5 6.9 4.5 8 4.5S11 5.5 12.5 7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M1 4.5C3.3 2.2 5.9 1 8 1S12.7 2.2 15 4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={s.hdr}>
          <div style={s.hdrBtn} onClick={() => setScreen("home")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={s.hdrTitle}>{title}</span>
          <div style={s.hdrBtn}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="5.5" r="3" stroke="white" strokeWidth="1.7"/><path d="M2 15C2 12 5 10 8.5 10C12 10 15 12 15 15" stroke="white" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#EAEAE6", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"32px 0", fontFamily:"inherit" }}>
      <div style={s.phone}>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div style={{ paddingBottom: 80 }}>
            <Header title="Daily Track" />
            <div style={s.dateLine}>
              <span style={s.dateText}>Kamis, 21 Mei 2026</span>
              <span style={s.dateDot}/>
              <span style={s.dateText}>Hari ke-14</span>
            </div>

            <div style={s.strip}>
              {[
                { val:`${avgGlucose} mg/dL`, lbl:"Rata-rata Gula" },
                { val: totalSteps.toLocaleString("id"), lbl:"Langkah" },
                { val: `${totalWater} ml`, lbl:"Air Minum" },
              ].map((item, i) => (
                <div key={item.lbl} style={{ display:"flex", flex:1, alignItems:"center" }}>
                  {i > 0 && <div style={s.stripSep}/>}
                  <div style={{ flex:1, textAlign:"center" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1C1C1E" }}>{item.val}</div>
                    <div style={{ fontSize:10, color:"#AAAAAA", marginTop:2 }}>{item.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ margin:"0 12px 12px", background:"#fff", borderRadius:24, padding:"18px 16px", textAlign:"center" }}>
              <div style={s.cardLbl}>Skor Aktivitas Hari Ini</div>
              <div style={{ position:"relative", width:120, height:120, margin:"12px auto" }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F0F0" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#4ECBA8" strokeWidth="8"
                    strokeDasharray={scoreCircumference} strokeDashoffset={scoreOffset} strokeLinecap="round"
                    transform="rotate(-90 60 60)" style={{ transition:"stroke-dashoffset 0.5s" }}/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:28, fontWeight:700, color:"#1C1C1E" }}>{totalScore}</span>
                  <span style={{ fontSize:10, color:"#AAAAAA" }}>poin</span>
                </div>
              </div>
              <div style={{ ...scoreLabelColor, display:"inline-block", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                {scoreLabel}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHdr}>
                <span style={s.cardLbl}>Log Aktivitas</span>
                <button onClick={() => setShowSheet(true)} style={s.plusBtn}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg></button>
              </div>
              {activities.map((act, i) => {
                const col = COLORS[act.type]; const badge = BADGE[act.status];
                return (
                  <div key={act.id}>
                    {i > 0 && <div style={s.divider}/>}
                    <div style={s.row}>
                      <div style={{ ...s.iconWrap, background: col.bg }}><ActivityIcon type={act.type} color={col.icon}/></div>
                      <div style={{ flex:1 }}>
                        <div style={s.rowLabel}>{act.label}</div>
                        <div style={s.rowSub}>{act.sublabel}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={s.rowVal}>{act.value} <span style={s.rowUnit}>{act.unit}</span></div>
                        <span style={{ ...s.badge, background:badge.bg, color:badge.color }}>{badge.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RIWAYAT ── */}
        {screen === "riwayat" && (
          <div style={{ paddingBottom: 80 }}>
            <Header title="Tren Mingguan"/>
            <div style={{ ...s.card, marginTop: 12 }}>
              <div style={s.cardHdr}><span style={s.cardLbl}>Kestabilan Gula Darah</span></div>
              <div style={{ padding:"0 18px 18px" }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:100 }}>
                  {CHART_BARS.map((b, i) => (
                    <div key={i} style={{ flex:1, height:`${b.h}%`, background:b.color, borderRadius:"4px 4px 0 0" }}/>
                  ))}
                </div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  {CHART_BARS.map((b,i) => <div key={i} style={{ flex:1, textAlign:"center", fontSize:10, color:"#AAA" }}>{b.day}</div>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REMINDER ── */}
        {screen === "reminder" && (
          <div style={{ paddingBottom: 80 }}>
            <Header title="Pengingat Harian"/>
            <div style={{ ...s.card, marginTop: 12 }}>
              {reminders.map((r, i) => (
                <div key={i}>
                  {i > 0 && <div style={s.divider}/>}
                  <div style={s.row}>
                    <span style={{ fontSize:14, fontWeight:700, minWidth:40 }}>{r.time}</span>
                    <div style={{ flex:1 }}>
                      <div style={s.rowLabel}>{r.label}</div>
                      <div style={s.rowSub}>{r.sub}</div>
                    </div>
                    <div 
                      onClick={() => setReminders(prev => prev.map((x,j) => j===i ? {...x, on:!x.on} : x))}
                      style={{ width:40, height:22, borderRadius:11, background: r.on?"#4ECBA8":"#DDD", position:"relative", cursor:"pointer" }}
                    >
                      <div style={{ position:"absolute", top:3, left: r.on?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"0.2s" }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MOOD ── */}
        {screen === "mood" && (
          <div style={{ paddingBottom: 80 }}>
            <Header title="Mood & Gejala"/>
            <div style={{ ...s.card, marginTop: 12 }}>
              <div style={s.cardHdr}><span style={s.cardLbl}>Apa yang kamu rasakan?</span></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:18 }}>
                {MOODS.map((m,i) => (
                  <div key={i} onClick={() => setSelMood(i)} style={{ background: selMood===i?"#F0FBF7":"#F8F8F8", border: selMood===i?"1.5px solid #4ECBA8":"1.5px solid transparent", borderRadius:12, padding:14, textAlign:"center", cursor:"pointer" }}>
                    <div style={{ fontSize:24 }}>{m.em}</div>
                    <div style={{ fontSize:12, color:"#333", marginTop:4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={s.divider}/>
              <div style={s.cardHdr}><span style={s.cardLbl}>Gejala Fisik</span></div>
              <div style={{ padding:18, display:"flex", flexDirection:"column", gap:8 }}>
                {SYMPTOMS.map((sym, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"#F8F8F8", borderRadius:10, padding:12 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:sym.color }}/>
                    <span style={{ fontSize:13 }}>{sym.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFIL ── */}
        {screen === "profil" && (
          <div style={{ paddingBottom: 80 }}>
            <Header title="Profil Saya"/>
            <div style={{ textAlign:"center", padding:20 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                 <span style={{ fontSize:32 }}>👤</span>
              </div>
              <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Ahmad Fauzi</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>Mulai tracking sejak Mei 2026</div>
            </div>
            <div style={s.card}>
              {[
                { k:"Tujuan Harian", v:"Stabilkan Gula" },
                { k:"Target Langkah", v:"6.000 / hari" },
                { k:"Target Air", v:"2.000 ml / hari" },
              ].map((item, i) => (
                <div key={item.k}>
                  {i > 0 && <div style={s.divider}/>}
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 18px" }}>
                    <span style={{ fontSize:13, color:"#AAA" }}>{item.k}</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{item.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOTTOM NAV ── */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#fff", display:"flex", borderTop:"0.5px solid #F0F0F0", padding:"8px 0 20px" }}>
          {navItems.map(n => (
            <div key={n.id} onClick={() => setScreen(n.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span style={{ fontSize:10, fontWeight: screen === n.id ? 600 : 400, color: screen === n.id ? "#4ECBA8" : "#AAA" }}>{n.label}</span>
            </div>
          ))}
        </div>

        {/* ── BOTTOM SHEET ── */}
        {showSheet && (
          <div onClick={e => { if(e.target===e.currentTarget) setShowSheet(false); }} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", display:"flex", alignItems:"flex-end" }}>
            <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:"20px", width:"100%" }}>
              <div style={{ width:40, height:4, background:"#EEE", borderRadius:2, margin:"0 auto 16px" }}/>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Tambah Aktivitas</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                {TYPE_OPTIONS.map(o => (
                  <div key={o.type} onClick={() => { setSelType(o.type); setInputVal(o.default); }} style={{ padding:12, borderRadius:12, border:`1.5px solid ${selType===o.type?"#4ECBA8":"#EEE"}`, background:selType===o.type?"#F0FBF7":"#fff", cursor:"pointer" }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{o.label}</div>
                  </div>
                ))}
              </div>
              <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{ width:"100%", border:"1.5px solid #EEE", borderRadius:12, padding:14, fontSize:20, fontWeight:600, marginBottom:16, outline:"none" }}/>
              <button onClick={handleSave} style={{ width:"100%", background:"#4ECBA8", border:"none", borderRadius:14, padding:14, fontSize:16, fontWeight:600, color:"#fff", cursor:"pointer" }}>Simpan Aktivitas</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}