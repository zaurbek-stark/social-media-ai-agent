import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";
import { postSchema } from "../schema/schema";

export async function POST(req: Request) {
  try {
    const context = await req.json();
    const { videoUrl, exampleLinkedInPosts, selectedTweets } = context.body;

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Fetch transcript
    const transcriptRes = await fetch(
      `${baseUrl}/api/scrape-video?url=${encodeURIComponent(videoUrl)}`
    );
    const { transcript } = await transcriptRes.json();

    // Generate LinkedIn posts
    const prompt = `Generate 6 posts based on the following rules, transcript, and examples.
-------
RULES:
- Maximum 280 characters in length.
- Start with a strong and concise hook.
- Don't use emojis.
- Limit it to one sentence per line.
- Have line breaks between each line.

-------
HOOK:
- The post has to start with a strong and concise hook sentence.
- Use one of the hook formulas below:
  1. "Never [ACTION] Do This Instead"
  2. "I Tested [NUMBER] Years Of [SUBJECT]"
  3. "I Survived [TIME] With [PERSON/SITUATION]"
  4. "I Tried Every [SUBJECT]"
  5. "The [SUBJECT] Tier List"
  6. "[SUBJECT] You Won't Believe Exist"
  7. "[LOW PRICE] VS [HIGH PRICE] [SUBJECT]"
  8. "Don't Buy [SUBJECT] Until [CONDITION]"
  9. "[NUMBER] Things I Wish I Knew [SUBJECT]"
  10. "If you're [CONDITION], read this."
  11. "I Asked 100 [SUBJECT] [QUESTION]"
  12. Controversial statement (e.g. "Nobody cares about your [SUBJECT]")

-------
TRANSCRIPT:
${transcript}

-------
LIKED POSTS:
${JSON.stringify(selectedTweets)}

-------
EXAMPLE POSTS:
${JSON.stringify(exampleLinkedInPosts)}

-------
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
