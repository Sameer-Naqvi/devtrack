"use client";
import { useState } from "react";
import StatCard from "./StatCard";
import LanguageBar from "./LanguageBar";

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

export default function ProfileAnalyzer() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    setProfile(null);
    try {
      const [githubRes, groqRes] = await Promise.all([
        fetch(`/api/github?username=${username}`),
        fetch(`/api/groq?username=${username}`),
      ]);
      if (!githubRes.ok) throw new Error("user not found");
      const githubData = await githubRes.json();
      const groqData = await groqRes.json();
      setData(githubData);
      setProfile(groqData.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tagColors = ["#3fb950", "#3fb950", "#79c0ff", "#79c0ff", "#d29922"];

  return (
    <div>
      {/* Prompt input */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#484f58", marginBottom: 8 }}>
          $ <span style={{ color: "#3fb950" }}>devtrack analyze</span>{" "}
          <span style={{ color: "#79c0ff" }}>{username || "_"}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="enter github username..."
            style={{
              flex: 1, background: "#161b22", border: "1px solid #30363d",
              borderRadius: 6, padding: "8px 12px", fontSize: 12,
              color: "#e6edf3", fontFamily: "Courier New, monospace",
              outline: "none"
            }}
          />
          <button
            onClick={analyze}
            disabled={loading || !username.trim()}
            style={{
              background: loading ? "#161b22" : "#0d1117",
              border: "1px solid #3fb950", borderRadius: 6,
              color: "#3fb950", fontSize: 12, padding: "8px 16px",
              cursor: "pointer", fontFamily: "Courier New, monospace",
              opacity: (!username.trim()) ? 0.4 : 1
            }}
          >
            {loading ? "analyzing..." : "$ run"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#1a0000", border: "1px solid #f78166", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#f78166", marginBottom: 16 }}>
          error: {error}
        </div>
      )}

      {data && profile && (
        <div>
          {/* User header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #21262d" }}>
            <img
              src={data.user.avatar_url}
              alt={data.user.login}
              style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #3fb950", filter: "grayscale(30%)" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "#e6edf3" }}>{data.user.name || data.user.login}</div>
              <div style={{ fontSize: 11, color: "#484f58", marginBottom: 8 }}>@{data.user.login} · {data.user.location || "unknown location"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <div style={{ fontSize: 11 }}><span style={{ color: "#484f58" }}>followers  </span><span style={{ color: "#79c0ff" }}>{data.user.followers.toLocaleString()}</span></div>
                <div style={{ fontSize: 11 }}><span style={{ color: "#484f58" }}>activity   </span><span style={{ color: "#3fb950" }}>{profile.activityLevel?.toUpperCase()} ▲</span></div>
                <div style={{ fontSize: 11 }}><span style={{ color: "#484f58" }}>profile    </span><span style={{ color: "#d29922" }}>{profile.profileType}</span></div>
                <div style={{ fontSize: 11 }}><span style={{ color: "#484f58" }}>member     </span><span style={{ color: "#e6edf3" }}>since {new Date(data.user.created_at).getFullYear()}</span></div>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Left col */}
            <div>
              <SectionTitle>stats</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <StatCard label="repositories" value={data.stats.totalRepos} />
                <StatCard label="total stars" value={data.stats.totalStars.toLocaleString()} color="blue" />
                <StatCard label="forks" value={data.stats.totalForks.toLocaleString()} color="yellow" />
                <StatCard label="active 30d" value={data.stats.recentlyActive} color="green" />
              </div>

              <SectionTitle>languages</SectionTitle>
              <Panel>
                <LanguageBar languages={data.languages} />
              </Panel>
            </div>

            {/* Right col */}
            <div>
              <SectionTitle>top repos</SectionTitle>
              <Panel style={{ marginBottom: 16 }}>
                {data.repos.slice(0, 5).map((repo) => (
                  <div key={repo.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #21262d" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#79c0ff" }}>{repo.name}</div>
                      <div style={{ fontSize: 10, color: "#484f58", marginTop: 2, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {repo.description || "no description"}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "#d29922", whiteSpace: "nowrap" }}>★ {repo.stargazers_count.toLocaleString()}</div>
                  </div>
                ))}
              </Panel>
            </div>
          </div>

          {/* AI Profile */}
          <SectionTitle>ai profile</SectionTitle>
          <Panel>
            <div style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.8, marginBottom: 12 }}>{profile.summary}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {profile.strengths?.map((s, i) => (
                <span key={s} style={{ fontSize: 10, padding: "2px 8px", border: `1px solid ${tagColors[i % tagColors.length]}`, color: tagColors[i % tagColors.length], borderRadius: 3 }}>{s}</span>
              ))}
              {profile.techStack?.map((t, i) => (
                <span key={t} style={{ fontSize: 10, padding: "2px 8px", border: "1px solid #30363d", color: "#484f58", borderRadius: 3 }}>{t}</span>
              ))}
            </div>
            <div style={{ borderLeft: "2px solid #3fb950", paddingLeft: 10, fontSize: 11, color: "#3fb950", lineHeight: 1.6 }}>
              {profile.recommendation}
            </div>
          </Panel>

          <div style={{ fontSize: 11, color: "#3fb950", marginTop: 16 }}>
            analysis complete · powered by groq llama-3.3
            <span style={{ display: "inline-block", width: 7, height: 12, background: "#3fb950", verticalAlign: "middle", marginLeft: 4, animation: "blink 1s step-end infinite" }} />
          </div>

          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </div>
      )}
    </div>
  );
}