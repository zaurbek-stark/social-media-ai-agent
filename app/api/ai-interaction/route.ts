import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, context } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-opus-20240229"),
    maxTokens: 2000,
    prompt: `${prompt}\n\nContext: ${JSON.stringify(context)}\n\nAssistant: `,
  });

  return result.toTextStreamResponse();
}
