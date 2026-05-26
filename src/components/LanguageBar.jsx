const COLORS = ["#3fb950", "#79c0ff", "#d29922", "#f78166", "#a5d6ff", "#ffa657"];

export default function LanguageBar({ languages }) {
  const total = languages.reduce((sum, l) => sum + l.count, 0);
  return (
    <div>
      {languages.map((lang, i) => (
        <div key={lang.language} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "#8b949e" }}>{lang.language}</span>
            <span style={{ color: "#484f58" }}>{Math.round((lang.count / total) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: "#21262d", borderRadius: 2 }}>
            <div style={{
              height: 6, borderRadius: 2,
              background: COLORS[i % COLORS.length],
              width: `${(lang.count / total) * 100}%`
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}