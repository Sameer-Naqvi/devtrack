"use client";
import { useState, useEffect } from "react";

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 10, color: "#3fb950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, paddingBottom: 4, borderBottom: "1px solid #21262d" }}>
    // {children}
  </div>
);

const Panel = ({ children, style }) => (
  <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: 14, ...style }}>
    {children}
  </div>
);

const ReviewSection = ({ title, items, borderColor, textColor }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 11, color: textColor, borderLeft: `2px solid ${borderColor}`, paddingLeft: 10, marginBottom: 6, lineHeight: 1.6 }}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default function PRReviewer({ initialUrl = "" }) {
  const [prUrl, setPrUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const review = async (url) => {
    const target = url || prUrl;
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/review?url=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "review failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when initialUrl is provided
  useEffect(() => {
    if (initialUrl) {
      setPrUrl(initialUrl);
      review(initialUrl);
    }
  }, [initialUrl]);

  const verdictColor = {
    "Approve": "#3fb950",
    "Request Changes": "#f78166",
    "Needs Discussion": "#d29922",
  };

  const scoreColor = (s) => s >= 8 ? "#3fb950" : s >= 5 ? "#d29922" : "#f78166";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#484f58", marginBottom: 8 }}>
          $ <span style={{ color: "#3fb950" }}>devtrack review</span>{" "}
          <span style={{ color: "#79c0ff" }}>{prUrl || "_"}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && review()}
            placeholder="https://github.com/owner/repo/pull/123"
            style={{
              flex: 1, background: "#161b22", border: "1px solid #30363d",
              borderRadius: 6, padding: "8px 12px", fontSize: 12,
              color: "#e6edf3", fontFamily: "Courier New, monospace", outline: "none"
            }}
          />
          <button
            onClick={() => review()}
            disabled={loading || !prUrl.trim()}
            style={{
              background: "#0d1117", border: "1px solid #3fb950",
              borderRadius: 6, color: "#3fb950", fontSize: 12,
              padding: "8px 16px", cursor: "pointer",
              fontFamily: "Courier New, monospace",
              opacity: !prUrl.trim() ? 0.4 : 1
            }}
          >
            {loading ? "reviewing..." : "$ run"}
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ fontSize: 12, color: "#484f58" }}>
          reviewing pr<span style={{ animation: "blink 1s step-end infinite" }}>...</span>
        </div>
      )}

      {error && (
        <div style={{ background: "#1a0000", border: "1px solid #f78166", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#f78166", marginBottom: 16 }}>
          error: {error}
        </div>
      )}

      {result && (
        <div>
          <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #21262d" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#e6edf3", flex: 1, marginRight: 16 }}>{result.prDetails.title}</div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: "bold", color: verdictColor[result.review.verdict] || "#e6edf3" }}>
                  [{result.review.verdict}]
                </div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: scoreColor(result.review.score), marginTop: 2 }}>
                  {result.review.score}/10
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#484f58" }}>
              <span style={{ color: "#8b949e" }}>{result.prDetails.changed_files} files</span>
              {" · "}
              <span style={{ color: "#3fb950" }}>+{result.prDetails.additions}</span>
              {" "}
              <span style={{ color: "#f78166" }}>-{result.prDetails.deletions}</span>
            </div>
          </div>

          <SectionTitle>summary</SectionTitle>
          <Panel style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.8 }}>{result.review.summary}</div>
          </Panel>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <SectionTitle>issues found</SectionTitle>
              <Panel>
                <ReviewSection title="potential bugs" items={result.review.bugs} borderColor="#f78166" textColor="#f78166" />
                <ReviewSection title="security" items={result.review.security} borderColor="#d29922" textColor="#d29922" />
                <ReviewSection title="style" items={result.review.style} borderColor="#484f58" textColor="#8b949e" />
              </Panel>
            </div>
            <div>
              <SectionTitle>positives</SectionTitle>
              <Panel>
                <ReviewSection title="looks good" items={result.review.positives} borderColor="#3fb950" textColor="#3fb950" />
              </Panel>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "#3fb950", marginTop: 16 }}>
            review complete · powered by groq llama-3.3
            <span style={{ display: "inline-block", width: 7, height: 12, background: "#3fb950", verticalAlign: "middle", marginLeft: 4, animation: "blink 1s step-end infinite" }} />
          </div>
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </div>
      )}
    </div>
  );
}