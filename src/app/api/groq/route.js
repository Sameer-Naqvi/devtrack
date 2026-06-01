import { NextResponse } from "next/server";
import { getUser, getRepos, extractLanguages, extractStats } from "@/lib/github";
import { generateDeveloperProfile } from "@/lib/groq";
import { rateLimit } from "@/lib/rateLimit";

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
    const profile = await generateDeveloperProfile({ user, repos, languages, stats });
    return NextResponse.json(
      { profile },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}