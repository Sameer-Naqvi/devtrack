const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

export async function getUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export async function getRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );
  if (!res.ok) throw new Error("Could not fetch repos");
  return res.json();
}

export async function getCommitActivity(username, repo) {
  const res = await fetch(
    `https://api.github.com/repos/${username}/${repo}/stats/commit_activity`,
    { headers }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getPRDiff(owner, repo, prNumber) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers: { ...headers, Accept: "application/vnd.github.diff" } }
  );
  if (!res.ok) throw new Error("Could not fetch PR diff");
  return res.text();
}

export async function getPRDetails(owner, repo, prNumber) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    { headers }
  );
  if (!res.ok) throw new Error("Could not fetch PR details");
  return res.json();
}

export function extractLanguages(repos) {
  const langCount = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });
  return Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, count]) => ({ language, count }));
}

export function extractStats(repos) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const recentlyActive = repos.filter((r) => {
    const updated = new Date(r.updated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return updated > thirtyDaysAgo;
  }).length;

  return { totalStars, totalForks, recentlyActive, totalRepos: repos.length };
}