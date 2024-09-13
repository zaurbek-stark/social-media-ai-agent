import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { videoUrl, exampleTweets } = await req.json();

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Fetch transcript
  const transcriptRes = await fetch(
    `${baseUrl}/api/transcript?url=${encodeURIComponent(videoUrl)}`
  );
  const { transcript } = await transcriptRes.json();

  // Generate tweets
  const aiResponse = await fetch(`${baseUrl}/api/ai-interaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt:
        "Generate a series of tweets based on the following transcript and example tweets:",
      context: { transcript, exampleTweets },
    }),
  });

  const generatedTweets = await aiResponse.json();
  return NextResponse.json(generatedTweets);
}
