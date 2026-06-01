import { NextResponse } from "next/server";
import { getRepoDetails } from "@/lib/github";
import { rateLimit } from "@/lib/rateLimit";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(request) {
  const limit = rateLimit(request);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `rate limit exceeded. try again in ${Math.ceil((limit.resetAt - Date.now()) / 1000)}s` },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo required" }, { status: 400 });
  }

  try {
    const { repoData, commits, prs, contributors } = await getRepoDetails(owner, repo);

    const prompt = `You are a senior developer analyzing a GitHub repository. Given the following data, write a concise technical summary.

Repo: ${repoData.full_name}
Description: ${repoData.description || "none"}
Language: ${repoData.language || "unknown"}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Open Issues: ${repoData.open_issues_count}
Recent commits: ${commits.slice(0, 3).map(c => c.commit.message.split("\n")[0]).join(", ")}

Respond in this exact JSON format:
{
  "what": "1-2 sentence explanation of what this project does",
  "techSummary": "1 sentence about the tech stack and architecture",
  "health": "Good | Fair | Needs Attention",
  "healthReason": "one short reason for the health rating"
}

Return only valid JSON, no markdown.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
    });

    const text = completion.choices[0].message.content.trim();
    const analysis = JSON.parse(text);

    return NextResponse.json(
      { repoData, commits, prs, contributors, analysis },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}