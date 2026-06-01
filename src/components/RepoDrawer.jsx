"use client";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const healthColor = { "Good": "#3fb950", "Fair": "#d29922", "Needs Attention": "#f78166" };

export default function RepoDrawer({ repo, owner, onClose, onPRClick }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  const actualOwner = repo.full_name ? repo.full_name.split("/")[0] : owner;

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    fetch(`/api/repo?owner=${actualOwner}&repo=${repo.name}`)
      .then((r) => r.json())
      .then((d) => { if (d.error) throw new Error(d.error); setData(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [repo.name, actualOwner]);

  return (
    <div style={{ marginTop: 12, background: "#0d1117", border: "1px solid #3fb950", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ background: "#161b22", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #21262d", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#3fb950", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span>// {repo.full_name || repo.name}</span>
          <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#79c0ff", textDecoration: "underline" }}>
            view on github
          </a>
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#484f58", cursor: "pointer", fontSize: 14, fontFamily: "Courier New, monospace" }}>x</button>
      </div>

      <div style={{ padding: 14 }}>
        {loading && <div style={{ fontSize: 12, color: "#484f58" }}>analyzing repo...</div>}
        {error && <div style={{ fontSize: 12, color: "#f78166" }}>error: {error}</div>}

        {data && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>

            <div>
              <div style={{ fontSize: 10, color: "#3fb950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>// what it does</div>
              <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.7, marginBottom: 10 }}>{data.analysis.what}</div>
              <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.7, marginBottom: 10 }}>{data.analysis.techSummary}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "#484f58" }}>health</span>
                <span style={{ fontSize: 11, fontWeight: "bold", color: healthColor[data.analysis.health] || "#e6edf3" }}>
                  [{data.analysis.health}]
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#484f58", marginTop: 4, lineHeight: 1.6 }}>{data.analysis.healthReason}</div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { label: "stars", val: data.repoData.stargazers_count.toLocaleString(), color: "#d29922" },
                  { label: "forks", val: data.repoData.forks_count.toLocaleString(), color: "#79c0ff" },
                  { label: "issues", val: data.repoData.open_issues_count, color: "#f78166" },
                  { label: "language", val: data.repoData.language || "none", color: "#3fb950" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#161b22", borderRadius: 6, padding: "6px 10px", border: "1px solid #21262d" }}>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 9, color: "#484f58" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#3fb950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>// recent commits</div>
              {data.commits.length === 0 && <div style={{ fontSize: 11, color: "#484f58" }}>no commits found</div>}
              {data.commits.map((c) => (
                <div key={c.sha} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #21262d" }}>
                  <div style={{ fontSize: 11, color: "#e6edf3", lineHeight: 1.5, marginBottom: 3 }}>
                    {c.commit.message.split("\n")[0].slice(0, 60)}{c.commit.message.length > 60 ? "..." : ""}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "#79c0ff" }}>{c.commit.author.name}</span>
                    <span style={{ fontSize: 10, color: "#484f58" }}>{new Date(c.commit.author.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#30363d", marginTop: 2 }}>{c.sha.slice(0, 7)}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#3fb950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>// open pull requests</div>
              {data.prs.length === 0 && <div style={{ fontSize: 11, color: "#484f58", marginBottom: 14 }}>no open prs</div>}
              {data.prs.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => onPRClick(pr.html_url)}
                  style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #21262d", cursor: "pointer" }}
                >
                  <div style={{ fontSize: 11, color: "#e6edf3", lineHeight: 1.5 }}>
                    #{pr.number} {pr.title.slice(0, 45)}{pr.title.length > 45 ? "..." : ""}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: "#484f58" }}>by {pr.user.login}</span>
                    <span style={{ fontSize: 10, color: "#3fb950" }}>[analyze]</span>
                  </div>
                </div>
              ))}

              <div style={{ fontSize: 10, color: "#3fb950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, marginTop: 14 }}>// contributors</div>
              {data.contributors.length === 0 && <div style={{ fontSize: 11, color: "#484f58" }}>no data</div>}
              {data.contributors.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <img src={c.avatar_url} alt={c.login} style={{ width: 20, height: 20, borderRadius: "50%", filter: "grayscale(40%)" }} />
                  <span style={{ fontSize: 11, color: "#79c0ff" }}>{c.login}</span>
                  <span style={{ fontSize: 10, color: "#484f58", marginLeft: "auto" }}>{c.contributions} commits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}