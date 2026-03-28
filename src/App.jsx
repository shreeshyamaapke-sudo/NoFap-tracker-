import { useState, useEffect } from "react";

const MONTHS = [
  { name: "MARCH", year: 2026, days: 31, startDay: 0 },
  { name: "APRIL", year: 2026, days: 30, startDay: 3 },
  { name: "MAY",   year: 2026, days: 31, startDay: 5 },
  { name: "JUNE",  year: 2026, days: 30, startDay: 1 },
];

const WEEK = ["S","M","T","W","T","F","S"];
const TODAY_MONTH = 0;
const TODAY_DAY = 28;

const HINDI_QUOTES = [
  "🔥 तू वो नहीं जो तूने किया — तू वो है जो तू बन सकता है।",
  "💪 हर बार जब तू रुका, तूने अपने दिमाग को जीता।",
  "⚔️ असली मर्द वो है जो अपनी इच्छाओं का मालिक हो।",
  "🧠 नशा तोड़ने वाला कमज़ोर नहीं, सबसे ताकतवर होता है।",
  "🌅 आज का clean day कल का confidence है।",
  "🏆 तेरा दिमाग ठीक हो रहा है — बस रुक मत।",
  "⚡ Energy बर्बाद मत कर — इसे अपने सपनों पर लगा।",
  "🎯 जो खुद को control करे, वो दुनिया को control करे।",
  "🌱 हर clean day तेरे brain को heal करता है।",
  "💥 Relapse एक गलती है, हार नहीं — उठ और चल।",
  "🔐 अपनी energy lock कर — यही तेरी असली power है।",
  "👑 तू addict नहीं, तू एक warrior है जो लड़ रहा है।",
  "🌟 आज strong रहा तो कल का तू खुद को thank करेगा।",
  "💎 खुद से किया वादा सबसे बड़ा वादा होता है।",
  "🚀 तेरी असली life अभी शुरू हो रही है — बर्बाद मत कर।",
];

function getDayStatus(monthIdx, day, relapses) {
  const key = `${monthIdx}-${day}`;
  if (relapses[key]) return "relapse";
  if (monthIdx < TODAY_MONTH) return "clean";
  if (monthIdx === TODAY_MONTH && day <= TODAY_DAY) return "clean";
  return "future";
}

function MonthCard({ month, monthIdx, relapses, onToggle }) {
  const blanks = Array(month.startDay).fill(null);
  const allDays = Array.from({ length: month.days }, (_, i) => i + 1);
  const grid = [...blanks, ...allDays];

  const pastDays = allDays.filter(d =>
    monthIdx < TODAY_MONTH || (monthIdx === TODAY_MONTH && d <= TODAY_DAY)
  );
  const relapsedCount = pastDays.filter(d => relapses[`${monthIdx}-${d}`]).length;
  const cleanCount = pastDays.length - relapsedCount;
  const tracked = pastDays.length;
  const isCurrentMonth = monthIdx === TODAY_MONTH;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      border: `1.5px solid ${isCurrentMonth ? "#30a14e" : "#21262d"}`,
      borderRadius: 14,
      padding: "14px 12px",
      boxShadow: isCurrentMonth ? "0 0 20px rgba(48,161,78,0.2)" : "none",
      position: "relative",
    }}>
      {isCurrentMonth && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "#30a14e", color: "#fff", fontSize: 7,
          padding: "2px 8px", borderRadius: "0 14px 0 8px", letterSpacing: 2
        }}>CURRENT</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 7, color: "#8b949e", letterSpacing: 3 }}>{month.year}</div>
          <div style={{ fontSize: 20, fontFamily: "'Georgia', serif", fontWeight: "bold", color: "#f0f6fc" }}>{month.name}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 8, color: "#8b949e", lineHeight: 1.9 }}>
          <div>✅ <span style={{ color: "#3fb950" }}>{cleanCount}</span></div>
          <div>❌ <span style={{ color: "#f85149" }}>{relapsedCount}</span></div>
          <div style={{ color: tracked > 0 ? (cleanCount/tracked >= 0.7 ? "#3fb950" : "#f0883e") : "#8b949e" }}>
            {tracked > 0 ? Math.round(cleanCount/tracked*100) + "%" : "—"}
          </div>
        </div>
      </div>

      <div style={{ background: "#21262d", borderRadius: 4, height: 3, marginBottom: 10, overflow: "hidden" }}>
        <div style={{
          width: tracked > 0 ? `${(cleanCount/tracked)*100}%` : "0%",
          height: "100%", background: "linear-gradient(90deg, #3fb950, #56d364)",
          borderRadius: 4, transition: "width 0.5s ease"
        }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 3 }}>
        {WEEK.map((w, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 7, color: "#484f58" }}>{w}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {grid.map((day, i) => {
          if (!day) return <div key={`b-${i}`} />;
          const status = getDayStatus(monthIdx, day, relapses);
          const isToday = isCurrentMonth && day === TODAY_DAY;
          const isFuture = status === "future";

          return (
            <div
              key={`${monthIdx}-${day}`}
              onClick={() => !isFuture && onToggle(monthIdx, day)}
              style={{
                aspectRatio: "1",
                borderRadius: 5,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: isFuture ? "default" : "pointer",
                background: status === "clean"
                  ? "linear-gradient(135deg, #1a3a1a, #1f4a1f)"
                  : status === "relapse"
                  ? "linear-gradient(135deg, #3a1a1a, #4a1f1f)"
                  : "#0d1117",
                border: isToday
                  ? "1.5px solid #e3b341"
                  : status === "clean" ? "1px solid #2a5a2a"
                  : status === "relapse" ? "1px solid #f85149"
                  : "1px solid #1a1a1a",
                opacity: isFuture ? 0.2 : 1,
                boxShadow: status === "relapse" ? "0 0 6px rgba(248,81,73,0.4)" : "none",
              }}
            >
              <div style={{ color: isToday ? "#e3b341" : status === "clean" ? "#4a7a4a" : "#555", fontSize: 7 }}>{day}</div>
              {status === "clean" && <div style={{ fontSize: 7 }}>✅</div>}
              {status === "relapse" && <div style={{ fontSize: 7 }}>❌</div>}
              {isToday && status !== "relapse" && (
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#e3b341", marginTop: 1 }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 8, fontSize: 7, color: "#2a4a2a" }}>
        सिर्फ relapse वाले दिन tap करो ❌
      </div>
    </div>
  );
}

function QuoteTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % HINDI_QUOTES.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1a0d, #1a0f00)",
      border: "1px solid #2a3a1a",
      borderRadius: 12,
      padding: "16px 14px",
      marginTop: 20,
      textAlign: "center",
      minHeight: 90,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
    }}>
      <div style={{ fontSize: 8, letterSpacing: 3, color: "#3fb950", marginBottom: 10, textTransform: "uppercase" }}>
        ✨ आज का मंत्र
      </div>
      <div style={{
        fontSize: 13,
        color: "#e3b341",
        fontFamily: "'Georgia', serif",
        fontStyle: "italic",
        lineHeight: 1.7,
        opacity: fade ? 1 : 0,
        transition: "opacity 0.4s ease",
        padding: "0 4px",
      }}>
        {HINDI_QUOTES[idx]}
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
        {HINDI_QUOTES.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 12 : 4, height: 4,
            borderRadius: 2,
            background: i === idx ? "#e3b341" : "#2a3a1a",
            transition: "all 0.3s",
            cursor: "pointer",
          }} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}

export default function NoFapTracker() {
  const [relapses, setRelapses] = useState({});

  const onToggle = (monthIdx, day) => {
    const key = `${monthIdx}-${day}`;
    setRelapses(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  let totalClean = 0, totalRelapse = 0;
  for (let mi = 0; mi <= TODAY_MONTH; mi++) {
    const m = MONTHS[mi];
    const maxD = mi === TODAY_MONTH ? TODAY_DAY : m.days;
    for (let d = 1; d <= maxD; d++) {
      if (relapses[`${mi}-${d}`]) totalRelapse++;
      else totalClean++;
    }
  }
  const totalTracked = totalClean + totalRelapse;

  let streak = 0;
  outer: for (let mi = TODAY_MONTH; mi >= 0; mi--) {
    const m = MONTHS[mi];
    const startD = mi === TODAY_MONTH ? TODAY_DAY : m.days;
    for (let d = startD; d >= 1; d--) {
      if (relapses[`${mi}-${d}`]) break outer;
      else streak++;
    }
  }

  let longest = 0, cur = 0;
  for (let mi = 0; mi <= TODAY_MONTH; mi++) {
    const m = MONTHS[mi];
    const maxD = mi === TODAY_MONTH ? TODAY_DAY : m.days;
    for (let d = 1; d <= maxD; d++) {
      if (relapses[`${mi}-${d}`]) cur = 0;
      else { cur++; longest = Math.max(longest, cur); }
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#010409",
      fontFamily: "'Georgia', serif",
      color: "#f0f6fc",
      padding: "20px 14px 40px",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 9, letterSpacing: 5, color: "#30a14e", marginBottom: 6, textTransform: "uppercase" }}>
          ⚔️ The Discipline Calendar
        </div>
        <h1 style={{
          fontSize: 26, margin: 0,
          background: "linear-gradient(90deg, #f0f6fc, #3fb950)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontStyle: "italic",
        }}>
          NoFap Journey
        </h1>
        <div style={{ fontSize: 10, color: "#8b949e", marginTop: 4 }}>March – June 2026</div>
      </div>

      <div style={{
        background: "#0d1a0d", border: "1px solid #1a3a1a", borderRadius: 8,
        padding: "8px 12px", textAlign: "center", marginBottom: 14,
        fontSize: 9, color: "#4a7a4a", lineHeight: 1.8
      }}>
        📌 सभी बीते दिन automatically ✅ हैं<br/>
        <span style={{ color: "#f85149" }}>❌ सिर्फ उस दिन tap करो जिस दिन fap हुआ हो</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "🔥 Current Streak", value: `${streak}d`, color: streak >= 7 ? "#3fb950" : streak >= 3 ? "#e3b341" : "#f85149" },
          { label: "🏆 Longest Streak", value: `${longest}d`, color: "#58a6ff" },
          { label: "✅ Clean Days", value: totalClean, color: "#3fb950" },
          { label: "📊 Success Rate", value: totalTracked > 0 ? `${Math.round(totalClean/totalTracked*100)}%` : "—", color: "#c9d1d9" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "#0d1117", border: "1px solid #21262d",
            borderRadius: 10, padding: "10px 12px", textAlign: "center"
          }}>
            <div style={{ fontSize: 22, fontWeight: "bold", color }}>{value}</div>
            <div style={{ fontSize: 8, color: "#8b949e", letterSpacing: 1, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MONTHS.map((m, mi) => (
          <MonthCard key={mi} month={m} monthIdx={mi} relapses={relapses} onToggle={onToggle} />
        ))}
      </div>

      <QuoteTicker />

      <div style={{
        textAlign: "center", marginTop: 24, padding: "16px 10px",
        borderTop: "1px solid #21262d", color: "#484f58", fontSize: 10, lineHeight: 2
      }}>
        <div style={{ color: "#3fb950", fontSize: 13, marginBottom: 6 }}>💪 तूने यह चुना। तू यह कर सकता है।</div>
        हर एक clean day तेरी ज़िंदगी वापस ले रहा है।<br/>
        Brain fog clear होगा। Energy आएगी। Confidence आएगा।<br/>
        <span style={{ color: "#e3b341" }}>Strong रह, भाई। 🔥</span>
      </div>
    </div>
  );
      }
