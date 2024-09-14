import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { videoUrl, exampleTweets } = await req.json();

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Fetch transcript
    const transcriptRes = await fetch(
      `${baseUrl}/api/scrape-video?url=${encodeURIComponent(videoUrl)}`
    );

    if (!transcriptRes.ok) {
      throw new Error(
        `Failed to fetch transcript: ${transcriptRes.statusText}`
      );
    }

    const { transcript } = await transcriptRes.json();

    const prompt = `Generate a series of tweets based on the following transcript and example tweets:
    Transcript: ${transcript}
    Example Tweets: ${JSON.stringify(exampleTweets)}
    
    Assistant: `;

    const result = await streamText({
      model: anthropic("claude-3-opus-20240229"),
      // maxTokens: 2000,
      prompt: prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in generate-tweets API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
