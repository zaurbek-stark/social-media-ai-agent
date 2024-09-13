import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { videoUrl, exampleLinkedInPosts, selectedTweets } = await req.json();

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Fetch transcript
  const transcriptRes = await fetch(
    `${baseUrl}/api/transcript?url=${encodeURIComponent(videoUrl)}`
  );
  const { transcript } = await transcriptRes.json();

  // Generate LinkedIn posts
  const aiResponse = await fetch(`${baseUrl}/api/ai-interaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt:
        "Generate LinkedIn posts based on the following transcript, example posts, and selected tweets:",
      context: { transcript, exampleLinkedInPosts, selectedTweets },
    }),
  });

  const generatedPosts = await aiResponse.json();
  return NextResponse.json(generatedPosts);
}
