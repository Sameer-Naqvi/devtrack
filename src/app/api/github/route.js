import { NextResponse } from "next/server";
import { getUser, getRepos, extractLanguages, extractStats } from "@/lib/github";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const [user, repos] = await Promise.all([getUser(username), getRepos(username)]);
    const languages = extractLanguages(repos);
    const stats = extractStats(repos);

    return NextResponse.json({ user, repos: repos.slice(0, 10), languages, stats });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}