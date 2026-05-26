"use client";
import { useState } from "react";
import StatCard from "./StatCard";
import LanguageBar from "./LanguageBar";

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
      if (!githubRes.ok) throw new Error("GitHub user not found");
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

  return (
    <div className="space-y-8">
      <div className="flex gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
          placeholder="Enter GitHub username..."
          className="flex-1 bg-gray-800 text-white rounded-xl px-5 py-3 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={analyze}
          disabled={loading || !username.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-700 text-red-300 rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      )}

      {data && profile && (
        <>
          <div className="flex items-center gap-5">
            <img
              src={data.user.avatar_url}
              alt={data.user.login}
              className="w-16 h-16 rounded-full border-2 border-gray-700"
            />
            <div>
              <h2 className="text-xl font-bold">{data.user.name || data.user.login}</h2>
              <p className="text-gray-400 text-sm">@{data.user.login}</p>
              {data.user.bio && <p className="text-gray-300 text-sm mt-1">{data.user.bio}</p>}
            </div>
            <div className="ml-auto text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                profile.activityLevel === "High" ? "bg-green-800 text-green-200" :
                profile.activityLevel === "Medium" ? "bg-yellow-800 text-yellow-200" :
                "bg-gray-700 text-gray-300"
              }`}>
                {profile.activityLevel} Activity
              </span>
              <p className="text-gray-400 text-xs mt-2">{profile.profileType}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Repositories" value={data.stats.totalRepos} />
            <StatCard label="Total Stars" value={data.stats.totalStars.toLocaleString()} />
            <StatCard label="Forks" value={data.stats.totalForks.toLocaleString()} />
            <StatCard label="Active (30d)" value={data.stats.recentlyActive} sub="repos updated" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-semibold">AI Profile Summary</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{profile.summary}</p>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {profile.strengths.map((s) => (
                    <span key={s} className="bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {profile.techStack.map((t) => (
                    <span key={t} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Recommendation</p>
                <p className="text-gray-300 text-sm leading-relaxed">{profile.recommendation}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-semibold">Languages</h3>
              <LanguageBar languages={data.languages} />
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-white font-semibold mb-3">Top Repositories</h3>
                <div className="space-y-2">
                  {data.repos.slice(0, 4).map((repo) => (
                    <div key={repo.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{repo.name}</p>
                        <p className="text-gray-400 text-xs truncate max-w-48">{repo.description || "No description"}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <p>⭐ {repo.stargazers_count.toLocaleString()}</p>
                        <p>{repo.language || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}