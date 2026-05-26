export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 flex flex-col gap-1">
      <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs">{sub}</p>}
    </div>
  );
}