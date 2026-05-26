import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateDeveloperProfile(userData) {
  const { user, repos, languages, stats } = userData;

  const prompt = `You are a senior engineering recruiter analyzing a developer profile. Given the following GitHub data, generate a structured developer profile.

Developer: ${user.name || user.login}
Bio: ${user.bio || "No bio provided"}
Public Repos: ${user.public_repos}
Followers: ${user.followers}
Account Created: ${user.created_at}

Top Languages: ${languages.map((l) => `${l.language} (${l.count} repos)`).join(", ")}
Total Stars: ${stats.totalStars}
Total Forks: ${stats.totalForks}
Recently Active Repos (last 30 days): ${stats.recentlyActive}

Top Repositories:
${repos
  .slice(0, 5)
  .map((r) => `- ${r.name}: ${r.description || "No description"} (${r.stargazers_count} stars, ${r.language || "unknown language"})`)
  .join("\n")}

Respond in this exact JSON format:
{
  "summary": "2-3 sentence developer summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "techStack": ["tech1", "tech2", "tech3"],
  "activityLevel": "High | Medium | Low",
  "profileType": "e.g. Full-Stack Developer, ML Engineer, etc.",
  "recommendation": "1-2 sentence hiring recommendation"
}

Return only valid JSON, no markdown, no explanation.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
  });

  const text = completion.choices[0].message.content.trim();
  return JSON.parse(text);
}

export async function reviewPRDiff(diff, prDetails) {
  const truncatedDiff = diff.length > 6000 ? diff.slice(0, 6000) + "\n... (diff truncated)" : diff;

  const prompt = `You are an expert code reviewer. Review the following GitHub Pull Request and provide structured feedback.

PR Title: ${prDetails.title}
PR Description: ${prDetails.body || "No description provided"}
Files Changed: ${prDetails.changed_files}
Additions: ${prDetails.additions}
Deletions: ${prDetails.deletions}

Diff:
${truncatedDiff}

Respond in this exact JSON format:
{
  "verdict": "Approve | Request Changes | Needs Discussion",
  "summary": "2-3 sentence overall summary of the PR",
  "bugs": ["potential bug 1", "potential bug 2"],
  "security": ["security concern 1"],
  "style": ["style issue 1", "style issue 2"],
  "positives": ["good thing 1", "good thing 2"],
  "score": 7
}

The score is out of 10. Return only valid JSON, no markdown, no explanation.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const text = completion.choices[0].message.content.trim();
  return JSON.parse(text);
}
