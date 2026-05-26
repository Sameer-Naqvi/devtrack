export default function StatCard({ label, value, color }) {
  const colors = { green: "#3fb950", blue: "#79c0ff", yellow: "#d29922", default: "#e6edf3" };
  const c = colors[color] || colors.default;
  return (
    <div style={{
      background: "#0d1117", border: "1px solid #21262d",
      borderRadius: 6, padding: "10px 12px"
    }}>
      <div style={{ fontSize: 20, fontWeight: "bold", color: c, fontFamily: "Courier New, monospace" }}>{value}</div>
      <div style={{ fontSize: 10, color: "#484f58", marginTop: 2 }}>{label}</div>
    </div>
  );
}