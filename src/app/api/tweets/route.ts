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

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables.");
    }

    if (!rapidApiKey) {
      throw new Error("RAPIDAPI_KEY is not set in the environment variables.");
    }

    // Initialize the generative AI client
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Parse the request body
    let data: RequestBody;
    try {
      const rawBody = await req.text();
      if (!rawBody) {
        console.error("Empty body received");
        return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
      }
    
      data = JSON.parse(rawBody);
    } catch (err) {
      console.error("Error parsing JSON body:", err);
      return NextResponse.json({ error: "Invalid JSON format in request body" }, { status: 400 });
    }
    

    const username = data.username;
    if (!username) {
      return NextResponse.json({ error: "Username field is required" }, { status: 400 });
    }

    // console.log("Username:", username);

    // Fetch tweets
    const tweetResponse = await fetch(
      `https://twitter-x.p.rapidapi.com/user/tweets?username=${username}&limit=10`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "twitter-x.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );

    if (!tweetResponse.ok) {
      const message = `Error fetching tweets: ${tweetResponse.statusText}`;
      console.error(message);
      return NextResponse.json({ error: message }, { status: tweetResponse.status });
    }

    const tweetJson = await tweetResponse.json();
    const instructions = tweetJson?.data?.user?.result?.timeline_v2?.timeline?.instructions;
    const tweetEntries = Array.isArray(instructions) && instructions.length > 0
      ? instructions.find((inst: any) => inst.type === "TimelineAddEntries")?.entries || []
      : [];

    if (!Array.isArray(tweetEntries)) {
      return NextResponse.json({ error: "Invalid tweet data format" }, { status: 500 });
    }

    // Extract tweet texts
    const tweetTexts = tweetEntries
      .map((entry: any) => entry?.content?.itemContent?.tweet_results?.result?.legacy?.full_text)
      .filter((text: string | undefined) => text) as string[];

    if (tweetTexts.length === 0) {
      return NextResponse.json({ error: "No valid tweets found" }, { status: 404 });
    }

    // Combine tweets into a single prompt
    const combinedTweets = tweetTexts.join("\n");
    const prompt = `${combinedTweets}\n\nBased on these tweets, roast or insult this user give reply in normal human language also keep it short like a tweet. give response in second person perspective for example using you instead of this`;

    // Generate content using the Gemini model
    const genAIResult = await model.generateContent(prompt);

    const summary = await genAIResult.response?.text();



    // Return the generated summary
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
