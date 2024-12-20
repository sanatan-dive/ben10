import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import aliensData from "./alien.json";

interface RequestBody {
  username: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!geminiApiKey || !rapidApiKey) {
      throw new Error("Required API keys are not set in environment variables.");
    }

    // Initialize the generative AI client
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }

    let data: RequestBody;
    try {
      data = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON format in request body" }, { status: 400 });
    }

    const username = data.username?.trim();
    if (!username) {
      return NextResponse.json({ error: "Username field is required" }, { status: 400 });
    }

    const tweetResponse = await fetch(
      `https://twitter-x.p.rapidapi.com/user/tweets?username=${encodeURIComponent(username)}&limit=10`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "twitter-x.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );

    if (!tweetResponse.ok) {
      return NextResponse.json(
        { error: `Error fetching tweets: ${tweetResponse.statusText}` },
        { status: tweetResponse.status }
      );
    }

    const tweetJson = await tweetResponse.json();
    const instructions = tweetJson?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];
    const tweetEntries = instructions.find((inst: any) => inst.type === "TimelineAddEntries")?.entries || [];

    const tweetTexts = tweetEntries
      .map((entry: any) => entry?.content?.itemContent?.tweet_results?.result?.legacy?.full_text)
      .filter((text: string | undefined) => typeof text === "string");

    if (!tweetTexts.length) {
      return NextResponse.json({ error: "No valid tweets found." }, { status: 404 });
    }

    const sanitizedTweets = tweetTexts.map((tweet :string) => tweet.replace(/[^a-zA-Z0-9\s]/g, ""));
    const combinedTweets = sanitizedTweets.join("\n");
    const prompt = `${combinedTweets}\n\nBased on these tweets, provide a humorous but safe and lighthearted observation in human language keep it real short under 50 words.`;

    let genAIResult;
    try {
      genAIResult = await model.generateContent(prompt);
    } catch (err) {
      return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
    }

    const summary = genAIResult?.response?.text?.() || "No content generated.";
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
