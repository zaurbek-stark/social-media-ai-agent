import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  console.log("🚀 ~ GET ~ url:", url);

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const fullTranscript = transcript.map((entry) => entry.text).join(" ");
    console.log("🚀 ~ GET ~ fullTranscript:", fullTranscript);
    return NextResponse.json({ transcript: fullTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
