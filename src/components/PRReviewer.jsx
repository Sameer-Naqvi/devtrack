"use client";
import { useState } from "react";

const Section = ({ title, items, color }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm px-4 py-2 rounded-lg border-l-4 ${color}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function PRReviewer() {
  const [prUrl, setPrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const review = async () => {
    if (!prUrl.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/review?url=${encodeURIComponent(prUrl)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = {
    "Approve": "bg-green-800 text-green-200",
    "Request Changes": "bg-red-800 text-red-200",
    "Needs Discussion": "bg-yellow-800 text-yellow-200",
  };

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && review()}
          placeholder="https://github.com/owner/repo/pull/123"
          className="flex-1 bg-gray-800 text-white rounded-xl px-5 py-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={review}
          disabled={loading || !prUrl.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? "Reviewing..." : "Review PR"}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-700 text-red-300 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <>
          {/* PR Header */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-bold text-lg">{result.prDetails.title}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {result.prDetails.changed_files} files changed ·{" "}
                  <span className="text-green-400">+{result.prDetails.additions}</span>{" "}
                  <span className="text-red-400">-{result.prDetails.deletions}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${verdictColor[result.review.verdict] || "bg-gray-700 text-gray-300"}`}>
                  {result.review.verdict}
                </span>
                <p className="text-gray-400 text-xs mt-2">Score: {result.review.score}/10</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-4 leading-relaxed">{result.review.summary}</p>
          </div>

          {/* Review Sections */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 space-y-5">
              <Section title="Potential Bugs" items={result.review.bugs} color="border-red-500 bg-red-950 text-red-200" />
              <Section title="Security Concerns" items={result.review.security} color="border-orange-500 bg-orange-950 text-orange-200" />
              <Section title="Style Issues" items={result.review.style} color="border-yellow-500 bg-yellow-950 text-yellow-200" />
            </div>
            <div className="bg-gray-800 rounded-xl p-6 space-y-5">
              <Section title="Positives" items={result.review.positives} color="border-green-500 bg-green-950 text-green-200" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}