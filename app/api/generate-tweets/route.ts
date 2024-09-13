// app/api/generate-tweets/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt, videoUrl, exampleTweets } = body;

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Fetch transcript
  const transcriptRes = await fetch(
    `${baseUrl}/api/scrape-video?url=${encodeURIComponent(videoUrl)}`
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

  // Handle streaming response
  const reader = aiResponse.body?.getReader();
  let generatedTweets = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      generatedTweets += new TextDecoder().decode(value);
    }
  }

  return new Response(generatedTweets, {
    headers: { "Content-Type": "text/plain" },
  });
}
