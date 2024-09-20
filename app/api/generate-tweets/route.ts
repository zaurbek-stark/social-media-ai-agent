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
    const { videoUrl, exampleTweets } = context.body;

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

    const prompt = `Generate a series of short posts based on the following transcript and examples.
    Rules:
    - Start with a strong hook.
    - Don't use emojis.
    - Limit it to one sentence per line.
    - Have line breaks between each line.

    Transcript: ${transcript}
    Examples: ${JSON.stringify(exampleTweets)}
    
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
