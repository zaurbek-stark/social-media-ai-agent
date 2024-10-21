import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { HormoziHooks, HormoziOutlierTweets } from "../../data/hormozi";

export const runtime = "edge";

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(req: Request) {
  try {
    console.log("test");
    const { prompt: userInput, context } = await req.json();
    console.log("🚀 ~ POST ~ context:", context);

    const selectedPosts = JSON.stringify(context);
    console.log("🚀 ~ POST ~ selectedPosts:", selectedPosts);

    // Shuffle the arrays before using them
    const shuffledHooks = shuffleArray(HormoziHooks).join("\n* ");
    const shuffledTweets = shuffleArray(HormoziOutlierTweets).join(
      "\n\n****\nNEW EXAMPLE:\n\n"
    );
    console.log("🚀 ~ POST ~ shuffledTweets:", shuffledTweets);

    const prompt = `I will give you a topic. Generate 9 posts based on the following rules and post examples.
-------
## RULES:
- Start with a strong and concise hook.
- Don't use emojis.
- Limit it to one sentence per line.
- Have a LINE BREAK between each line (i.e. there SHOULD always be an empty line between each lines).
- For each post you generate, use the most fitting HOOK and EXAMPLE POST from the list below as inspiration.

-------
## HOOKS:
The post has to start with a strong and concise hook sentence. Use one of these hook formulas:
${shuffledHooks}

${
  selectedPosts &&
  `-------
## SELECTED POSTS:
${selectedPosts}`
}

-------
## EXAMPLE POSTS:
The post should have one sentence per line and LINE BREAKS between each lines, like the posts below.
You can use these posts as inspiration for the WRITTING STYLE only (don't copy the content):

${shuffledTweets}

-------
## SOURCE TOPIC:
${userInput}

-------
## OUTPUT FORMAT:
<posts>
  <post>
    <content>
    --YOUR POST CONTENT HERE--
    </content>
    <rating>
    --YOUR POST RATING HERE--
    </rating>
  </post>
  --REPEAT FOR EACH POST--
<posts>

-------
Assistant: `;

    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
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
