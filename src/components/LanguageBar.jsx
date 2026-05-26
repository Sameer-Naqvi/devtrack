const COLORS = [
  "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-red-500", "bg-pink-500",
];

export default function LanguageBar({ languages }) {
  const total = languages.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="space-y-3">
      {languages.map((lang, i) => (
        <div key={lang.language}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">{lang.language}</span>
            <span className="text-gray-500">{lang.count} repos</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`${COLORS[i % COLORS.length]} h-2 rounded-full`}
              style={{ width: `${(lang.count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}