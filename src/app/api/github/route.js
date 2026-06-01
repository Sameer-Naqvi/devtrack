import { NextResponse } from "next/server";
import { getUser, getRepos, extractLanguages, extractStats } from "@/lib/github";
import { rateLimit } from "@/lib/rateLimit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};

export async function GET(request) {
  const limit = rateLimit(request);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `rate limit exceeded. try again in ${Math.ceil((limit.resetAt - Date.now()) / 1000)}s` },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const [user, repos] = await Promise.all([getUser(username), getRepos(username)]);
    const languages = extractLanguages(repos);
    const stats = extractStats(repos);

    const cleanRepos = await Promise.all(repos.slice(0, 10).map(async (r) => {
      let full_name = r.full_name;
      if (r.fork) {
        try {
          const detail = await fetch(`https://api.github.com/repos/${r.full_name}`, { headers });
          const detailData = await detail.json();
          if (detailData.parent) full_name = detailData.parent.full_name;
        } catch (_) {}
      }
      return {
        id: r.id, name: r.name, full_name, fork: r.fork,
        description: r.description, html_url: r.html_url,
        stargazers_count: r.stargazers_count, forks_count: r.forks_count,
        language: r.language, updated_at: r.updated_at,
      };
    }));

    return NextResponse.json(
      { user, repos: cleanRepos, languages, stats },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}