import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { postSchema } from "../schema/schema";

export const runtime = "edge";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const context = await req.json();
    console.log("🚀 ~ POST ~ exampleTweets:", context);
    const { videoUrl, exampleTweets } = context.body;
    console.log("🚀 ~ POST ~ exampleTweets:", exampleTweets);
    console.log("🚀 ~ POST ~ videoUrl:", videoUrl);

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

    const result = await streamObject({
      model: anthropic("claude-3-opus-20240229"),
      schema: postSchema,
      prompt: prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in generate-tweets API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
