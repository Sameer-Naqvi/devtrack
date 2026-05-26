import { NextResponse } from "next/server";
import { getPRDiff, getPRDetails } from "@/lib/github";
import { reviewPRDiff } from "@/lib/groq";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const prUrl = searchParams.get("url");

  if (!prUrl) {
    return NextResponse.json({ error: "PR URL is required" }, { status: 400 });
  }

  try {
    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub PR URL" }, { status: 400 });
    }

    const [, owner, repo, prNumber] = match;
    const [diff, prDetails] = await Promise.all([
      getPRDiff(owner, repo, prNumber),
      getPRDetails(owner, repo, prNumber),
    ]);

    const review = await reviewPRDiff(diff, prDetails);
    return NextResponse.json({ review, prDetails });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}