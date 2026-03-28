import { useState, useEffect } from "react";

const MONTHS = [
  { name: "MARCH", year: 2026, days: 31, startDay: 0 },
  { name: "APRIL", year: 2026, days: 30, startDay: 3 },
  { name: "MAY",   year: 2026, days: 31, startDay: 5 },
  { name: "JUNE",  year: 2026, days: 30, startDay: 1 },
];

// startDay: 0=Sun, 1=Mon... (March 1 2026 = Sunday)
const WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const TODAY_MONTH = 2; // March (0-indexed)
const TODAY_DAY = 28;

const QUOTES = [
  "Every day clean is a day you reclaim yourself. 🔥",
  "Bhai, ek din ka streak bhi ek jeet hai. 💪",
  "Your future self is watching. Make him proud.",
  "Discipline is the bridge between goals and accomplishment.",
  "Jo log struggle karte hain, wahi log grow karte hain. 🌱",
];

function MonthCard({ month, monthIdx, data, onToggle }) {
  const blanks = Array(month.startDay).fill(null);
  const allDays = Array.from({ length: month.days }, (_, i) => i + 1);
  const grid = [...blanks, ...allDays];

  const clean = allDays.filter(d => data[`${monthIdx}-${d}`] === "clean").length;
  const relapsed = allDays.filter(d => data[`${monthIdx}-${d}`] === "relapse").length;
  const tracked = clean + relapsed;

  const isCurrentMonth = monthIdx === TODAY_MONTH;
  const isPast = monthIdx < TODAY_MONTH;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      border: `1px solid ${isCurrentMonth ? "#30a14e" : "#21262d"}`,
      borderRadius: 16,
      padding: 20,
      boxShadow: isCurrentMonth ? "0 0 24px rgba(48,161,78,0.15)" : "0 4px 16px rgba(0,0,0,0.4)",
      position: "relative",
      overflow: "hidden",
    }}>
      {isCurrentMonth && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "#30a14e", color: "#fff", fontSize: 8,
          padding: "3px 10px", borderRadius: "0 16px 0 8px", letterSpacing: 2
        }}>CURRENT</div>
      )}

      {/* Month Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 9, color: "#8b949e", letterSpacing: 4, marginBottom: 2 }}>{month.year}</div>
          <div style={{ fontSize: 24, fontFamily: "'Georgia', serif", fontWeight: "bold", color: "#f0f6fc", letterSpacing: 2 }}>{month.name}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 9, color: "#8b949e", lineHeight: 1.8 }}>
          <div>✅ Clean: <span style={{ color: "#3fb950" }}>{clean}</span></div>
          <div>❌ Relapse: <span style={{ color: "#f85149" }}>{relapsed}</span></div>
          <div>📊 Rate: <span style={{ color: tracked > 0 ? (clean/tracked >= 0.7 ? "#3fb950" : "#f0883e") : "#8b949e" }}>
            {tracked > 0 ? Math.round(clean/tracked*100) + "%" : "—"}
          </span></div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#21262d", borderRadius: 4, height: 4, marginBottom: 14, overflow: "hidden" }}>
        <div style={{
          width: tracked > 0 ? `${(clean/tracked)*100}%` : "0%",
          height: "100%",
          background: "linear-gradient(90deg, #3fb950, #56d364)",
          borderRadius: 4,
          transition: "width 0.5s ease"
        }} />
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
        {WEEK.map(w => (
          <div key={w} style={{ textAlign: "center", fontSize: 7, color: "#484f58", letterSpacing: 1, padding: "2px 0" }}>{w}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
        {grid.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;

          const key = `${monthIdx}-${day}`;
          const status = data[key];
          const isToday = isCurrentMonth && day === TODAY_DAY;
          const isFuture = (monthIdx > TODAY_MONTH) || (isCurrentMonth && day > TODAY_DAY);

          return (
            <div
              key={key}
              onClick={() => !isFuture && onToggle(key)}
              style={{
                aspectRatio: "1",
                borderRadius: 6,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: isFuture ? "default" : "pointer",
                fontSize: 9, fontWeight: "bold",
                position: "relative",
                background: status === "clean"
                  ? "linear-gradient(135deg, #1a3a1a, #1f4a1f)"
                  : status === "relapse"
                  ? "linear-gradient(135deg, #3a1a1a, #4a1f1f)"
                  : isFuture
                  ? "#0d1117"
                  : isToday
                  ? "#1c2128"
                  : "#161b22",
                border: isToday
                  ? "2px solid #e3b341"
                  : status === "clean"
                  ? "1px solid #3fb950"
                  : status === "relapse"
                  ? "1px solid #f85149"
                  : "1px solid #21262d",
                opacity: isFuture ? 0.3 : 1,
                transition: "transform 0.1s, box-shadow 0.1s",
                boxShadow: status === "clean"
                  ? "0 0 8px rgba(63,185,80,0.3)"
                  : status === "relapse"
                  ? "0 0 8px rgba(248,81,73,0.3)"
                  : "none",
              }}
              onMouseEnter={e => {
                if (!isFuture) e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={{ color: isFuture ? "#484f58" : isToday ? "#e3b341" : "#8b949e", fontSize: 8, lineHeight: 1 }}>{day}</div>
              {status === "clean" && <div style={{ fontSize: 10 }}>✅</div>}
              {status === "relapse" && <div style={{ fontSize: 10 }}>❌</div>}
              {isToday && !status && (
                <div style={{
                  position: "absolute", bottom: 2,
                  width: 4, height: 4, borderRadius: "50%", background: "#e3b341"
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NoFapTracker() {
  const [data, setData] = useState({});
  const [quoteIdx] = useState(Math.floor(Math.random() * QUOTES.length));

  const onToggle = (key) => {
    setData(prev => {
      const cur = prev[key];
      if (!cur) return { ...prev, [key]: "clean" };
      if (cur === "clean") return { ...prev, [key]: "relapse" };
      return { ...prev, [key]: undefined };
    });
  };

  // Overall stats
  const totalClean = Object.values(data).filter(v => v === "clean").length;
  const totalRelapse = Object.values(data).filter(v => v === "relapse").length;
  const totalTracked = totalClean + totalRelapse;

  // Current streak
  let streak = 0;
  outer: for (let mi = TODAY_MONTH; mi >= 0; mi--) {
    const m = MONTHS[mi];
    const startD = mi === TODAY_MONTH ? TODAY_DAY : m.days;
    for (let d = startD; d >= 1; d--) {
      const v = data[`${mi}-${d}`];
      if (v === "clean") streak++;
      else if (v === "relapse") break outer;
      else if (mi === TODAY_MONTH && d === TODAY_DAY) continue;
      else break outer;
    }
  }

  // Longest streak
  let longest = 0, cur = 0;
  for (let mi = 0; mi <= TODAY_MONTH; mi++) {
    const m = MONTHS[mi];
    const maxD = mi === TODAY_MONTH ? TODAY_DAY : m.days;
    for (let d = 1; d <= maxD; d++) {
      const v = data[`${mi}-${d}`];
      if (v === "clean") { cur++; longest = Math.max(longest, cur); }
      else if (v === "relapse") cur = 0;
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#010409",
      fontFamily: "'Georgia', serif",
      color: "#f0f6fc",
      padding: "28px 20px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "#30a14e", marginBottom: 8, textTransform: "uppercase" }}>
          ⚔️ The Discipline Calendar
        </div>
        <h1 style={{
          fontSize: 32, margin: 0,
          background: "linear-gradient(90deg, #f0f6fc, #3fb950)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontStyle: "italic", letterSpacing: 1
        }}>
          NoFap Journey
        </h1>
        <div style={{ fontSize: 11, color: "#8b949e", marginTop: 6, fontStyle: "italic" }}>
          March – June 2026
        </div>
        <div style={{
          marginTop: 12, fontSize: 11, color: "#e3b341", fontStyle: "italic",
          maxWidth: 400, margin: "12px auto 0"
        }}>
          "{QUOTES[quoteIdx]}"
        </div>
      </div>

      {/* How to use */}
      <div style={{ textAlign: "center", marginBottom: 20, fontSize: 9, color: "#484f58", letterSpacing: 1 }}>
        CLICK ONCE = ✅ CLEAN &nbsp;|&nbsp; CLICK TWICE = ❌ RELAPSE &nbsp;|&nbsp; CLICK THRICE = CLEAR
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "🔥 Current Streak", value: `${streak}d`, color: streak >= 7 ? "#3fb950" : streak >= 3 ? "#e3b341" : "#f85149" },
          { label: "🏆 Longest Streak", value: `${longest}d`, color: "#58a6ff" },
          { label: "✅ Clean Days", value: totalClean, color: "#3fb950" },
          { label: "📊 Success Rate", value: totalTracked > 0 ? `${Math.round(totalClean/totalTracked*100)}%` : "—", color: "#c9d1d9" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "#0d1117", border: "1px solid #21262d",
            borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 100
          }}>
            <div style={{ fontSize: 20, fontWeight: "bold", color }}>{value}</div>
            <div style={{ fontSize: 8, color: "#8b949e", letterSpacing: 1, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Calendars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        {MONTHS.map((m, mi) => (
          <MonthCard key={mi} month={m} monthIdx={mi} data={data} onToggle={onToggle} />
        ))}
      </div>

      {/* Motivation footer */}
      <div style={{
        textAlign: "center", marginTop: 32, padding: "20px",
        borderTop: "1px solid #21262d", color: "#484f58", fontSize: 10, lineHeight: 2
      }}>
        <div style={{ color: "#3fb950", fontSize: 12, marginBottom: 6 }}>💪 YOU CHOSE THIS. YOU CAN DO THIS.</div>
        Har ek clean day teri zindagi wapas le raha hai.<br />
        Brain fog clear hoga. Energy aayegi. Confidence aayega.<br />
        <span style={{ color: "#e3b341" }}>Stay strong, bhai. 🔥</span>
      </div>
    </div>
  );
}
