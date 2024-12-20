import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

interface RequestBody {
  username: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    
    if (!geminiApiKey || !rapidApiKey) {
      throw new Error("Required API keys are not set in environment variables");
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Parse request body
    let data: RequestBody;
    try {
      const rawBody = await req.text();
      if (!rawBody) {
        return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
      }
      data = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON format in request body" }, { status: 400 });
    }
    

    if (!data.username) {
      return NextResponse.json({ error: "Username field is required" }, { status: 400 });
    }

    // Fetch tweets with error handling
    const tweetResponse = await fetch(
      `https://twitter-x.p.rapidapi.com/user/tweets?username=${encodeURIComponent(data.username)}&limit=10`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "twitter-x.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );

    if (!tweetResponse.ok) {
      throw new Error(`Failed to fetch tweets: ${tweetResponse.statusText}`);
    }

    const tweetJson = await tweetResponse.json();
    
    // Extract tweets with proper type checking
    const instructions = tweetJson?.data?.user?.result?.timeline_v2?.timeline?.instructions;
    const tweetEntries = Array.isArray(instructions) 
      ? instructions.find((inst: any) => inst.type === "TimelineAddEntries")?.entries || []
      : [];

    if (!Array.isArray(tweetEntries)) {
      return NextResponse.json({ error: "Invalid tweet data format" }, { status: 500 });
    }

    // Extract and clean tweet texts
    const tweetTexts = tweetEntries
      .map((entry: any) => entry?.content?.itemContent?.tweet_results?.result?.legacy?.full_text)
      .filter((text: string | undefined): text is string => Boolean(text))
      .map(text => text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')) // Remove URLs
      .map(text => text.replace(/[^\w\s.,!?]/g, ' ')); // Remove special characters

    if (tweetTexts.length === 0) {
      return NextResponse.json({ error: "No valid tweets found" }, { status: 404 });
    }

    // Create a more neutral prompt to avoid safety filters
    const prompt = `
      Here are some recent social media posts:

      ${tweetTexts.join("\n")}

      Keep the tone light and appropriate and generate a funny roast of this user posts keep it short like a tweet.
    `.trim();

    try {
      const genAIResult = await model.generateContent(prompt);
      const summary = await genAIResult.response.text();
      
      return NextResponse.json({ 
        summary,
        
      });
    } catch (genAIError) {
      // Handle Gemini-specific errors
      if (genAIError instanceof Error && genAIError.message.includes('SAFETY')) {
        // Fall back to a more conservative summary
        return NextResponse.json({
          summary: "Unable to generate summary due to content guidelines. Please try with different content.",
          
        });
      }
      throw genAIError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error in tweet summary generation:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}