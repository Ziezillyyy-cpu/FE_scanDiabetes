import { useState } from "react";

type TimelineDotKind = "done" | "lab" | "insulin" | "future";

interface TimelineItem {
  title: string;
  sub: string;
  kind: TimelineDotKind;
  badge?: string;
}

interface ScheduleItem {
  time: string;
  name: string;
  status: "selesai" | "segera" | "belum";
}

const TREATMENT_TIMELINE: TimelineItem[] = [
  { title: "Diagnosis awal",        sub: "10 Jan 2026 · HbA1c 9.2%",          kind: "done" },
  { title: "Mulai Metformin",       sub: "22 Feb 2026 · Dr. Melysa",          kind: "done" },
  { title: "Cek HbA1c bulan ke-3",  sub: "15 Feb 2026 · Turun ke 7.8%",       kind: "lab", badge: "Membaik" },
  { title: "Tambah Insulin Lantus", sub: "30 Apr 2026 · Dosis 14 unit malam", kind: "insulin" },
  { title: "Cek HbA1c berikutnya",  sub: "Target 15 Jul 2026 · 6 hari lagi",  kind: "future" },
];

const SCHEDULE_TODAY: ScheduleItem[] = [
  { time: "07:00", name: "Tekanan Darah", status: "selesai" },
  { time: "13:00", name: "Ahli gizi",     status: "segera"  },
  { time: "19:00", name: "Konsultasi",    status: "belum"   },
];

const SCHEDULE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  selesai: { bg: "#E8F8F0", color: "#1A6E45", label: "Selesai" },
  segera:  { bg: "#EEF2FF", color: "#2456A4", label: "Segera"  },
  belum:   { bg: "#FFF3E0", color: "#A05C00", label: "Belum"   },
};

function TimelineDot({ kind }: { kind: TimelineDotKind }) {
  const bgMap: Record<TimelineDotKind, string> = {
    done: "#4ECBA8", lab: "#3A74C8", insulin: "#7C5CBF", future: "#fff",
  };
  const wrapStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: "50%", flexShrink: 0, zIndex: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: bgMap[kind],
    border: kind === "future" ? "2px dashed #4ECBA8" : "none",
  };

  if (kind === "done") {
    return (
      <div style={wrapStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (kind === "insulin") {
    return (
      <div style={wrapStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14L7 9M9 7L13 3M11 1L15 5L13 7L9 3L11 1Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  const flaskColor = kind === "future" ? "#4ECBA8" : "white";
  return (
    <div style={wrapStyle}>
      <svg width={kind === "future" ? 14 : 16} height={kind === "future" ? 14 : 16} viewBox="0 0 16 16" fill="none">
        <path d="M6 2V6.5L3.5 11.5C3 12.5 3.7 13.5 4.8 13.5H11.2C12.3 13.5 13 12.5 12.5 11.5L10 6.5V2"
          stroke={flaskColor} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M5 2H11" stroke={flaskColor} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  phone: {
    width: 390, borderRadius: 44, background: "#4ECBA8", overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.2)",
    fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
    position: "relative",
  },
  statusBar: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 28px 4px" },
  statusTime: { fontSize:15, fontWeight:600, color:"#fff" },
  statusIcons: { display:"flex", gap:6, alignItems:"center" },
  hdr: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 20px 6px" },
  hdrBtn: { width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  hdrTitle: { fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"0.01em" },
  dateText: { fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:500 },
  card: { background:"#fff", borderRadius:24, margin:"0 12px", paddingBottom:8 },
  cardHdr: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px 6px" },
  cardLbl: { fontSize:10, fontWeight:600, color:"#BBBBBB", letterSpacing:"0.08em", textTransform:"uppercase" as const },
  divider: { height:"0.5px", background:"#F2F2F2", margin:"0 18px" },
  homeBar: { width:100, height:4, background:"rgba(255,255,255,0.25)", borderRadius:2, margin:"0 auto 16px" },
};

export default function Treatment() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#EAEAE6", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"32px 0 48px", fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif" }}>
      <div style={s.phone}>

        {/* Status bar */}
        <div style={s.statusBar}>
          <span style={s.statusTime}>9:41</span>
          <div style={s.statusIcons}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4"/><rect x="4.5" y="4" width="3" height="8" rx="1" opacity="0.65"/><rect x="9" y="2" width="3" height="10" rx="1" opacity="0.85"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5C8.8 9.5 9.5 10.2 9.5 11S8.8 12.5 8 12.5 6.5 11.8 6.5 11 7.2 9.5 8 9.5Z" fill="white"/><path d="M3.5 7C5 5.5 6.9 4.5 8 4.5S11 5.5 12.5 7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M1 4.5C3.3 2.2 5.9 1 8 1S12.7 2.2 15 4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="19" height="11" rx="3" stroke="white" strokeOpacity="0.6"/><rect x="2" y="2" width="14" height="8" rx="1.5" fill="white"/><path d="M21 3.5V8.5C22 8.2 22.8 7.2 22.8 6S22 3.8 21 3.5Z" fill="white" fillOpacity="0.45"/></svg>
          </div>
        </div>

        {/* Header */}
        <div style={s.hdr}>
          <div style={s.hdrBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={s.hdrTitle}>Treatment</span>
          <div style={s.hdrBtn}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="5.5" r="3" stroke="white" strokeWidth="1.7"/><path d="M2 15C2 12 5 10 8.5 10C12 10 15 12 15 15" stroke="white" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
        </div>

        {/* Subtitle */}
        <div style={{ padding:"0 20px 12px" }}>
          <span style={s.dateText}>Perjalanan terapi diabetes kamu</span>
        </div>

        {/* Treatment Timeline */}
        <div style={{ ...s.card, padding:"18px 16px 16px", marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
            <span style={s.cardLbl}>Linimasa terapi</span>
            <span style={{ fontSize:11, color:"#4ECBA8", fontWeight:600 }}>Bulan ke-7</span>
          </div>
          <div style={{ position:"relative", paddingLeft:4 }}>
            <div style={{ position:"absolute", left:15, top:6, bottom:6, width:2, background:"#EFEFEF" }} />
            {TREATMENT_TIMELINE.map((item, i) => (
              <div key={i} style={{ display:"flex", gap:12, marginBottom: i === TREATMENT_TIMELINE.length - 1 ? 0 : 18, position:"relative" }}>
                <TimelineDot kind={item.kind} />
                <div style={{ flex:1, paddingTop:4 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1C1C1E" }}>{item.title}</div>
                  <div style={{ fontSize:11, color:"#AAAAAA", marginTop:2 }}>{item.sub}</div>
                  {item.badge && (
                    <span style={{ display:"inline-block", marginTop:6, padding:"2px 8px", borderRadius:20, fontSize:9, fontWeight:600, background:"#E8F8F0", color:"#1A6E45" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal hari ini */}
        <div style={{ ...s.card, marginBottom:12 }}>
          <div style={s.cardHdr}>
            <span style={s.cardLbl}>Jadwal hari ini</span>
          </div>
          {SCHEDULE_TODAY.map((item, i) => {
            const badge = SCHEDULE_BADGE[item.status];
            return (
              <div key={i}>
                {i > 0 && <div style={s.divider} />}
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 18px" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#1C1C1E", minWidth:40 }}>{item.time}</span>
                  <span style={{ flex:1, fontSize:14, fontWeight:500, color:"#1C1C1E" }}>{item.name}</span>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:500, background:badge.bg, color:badge.color }}>
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
          <div style={{ height:8 }} />
        </div>

        {/* Save button */}
        <div style={{ padding:"4px 0 8px" }}>
          <button
            onClick={handleSave}
            style={{
              margin:"0 12px", background:"#fff", border:"none", borderRadius:16,
              padding:16, width:"calc(100% - 24px)", fontSize:15, fontWeight:600,
              color:"#1C1C1E", cursor:"pointer", fontFamily:"inherit",
              transition:"opacity 0.2s",
            }}
          >
            {saved ? "✓ Tersimpan" : "Simpan Rencana Perawatan"}
          </button>
        </div>

        <div style={s.homeBar} />

      </div>
    </div>
  );
}