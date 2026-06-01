import { NextResponse } from "next/server";
import { getPRDiff, getPRDetails } from "@/lib/github";
import { reviewPRDiff } from "@/lib/groq";
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
    return NextResponse.json(
      { review, prDetails },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}