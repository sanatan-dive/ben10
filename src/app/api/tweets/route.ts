export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  try {
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return new Response("RapidAPI key is missing", { status: 500 });
    }

    const response = await fetch(`https://twitter-x.p.rapidapi.com/user/tweets?username=${username}&limit=1`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "twitter-x.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching Tweet data: Status ${response.status}, Message: ${response.statusText}`);
      return new Response(`Error fetching tweet data: ${response.statusText}`, {
        status: response.status,
      });
    }

    const jsonResponse = await response.json();
    
    // Log full response to inspect the structure
    console.log("API Response:", JSON.stringify(jsonResponse, null, 2)); 

    // Ensure proper access to tweet entries
    const tweetEntries = jsonResponse?.timeline_v2?.timeline?.instructions?.[0]?.entries;
    

    // Check if tweetEntries exist and contain valid data
    if (!tweetEntries || tweetEntries.length === 0) {
      return new Response("No tweets found for this user", { status: 404 });
    }

    // Extract tweet data from valid entries
    const tweetData = tweetEntries.map((entry: any) => {
      // Check that content structure exists before accessing it
      const tweet = entry?.content?.itemContent?.tweet_results?.result?.legacy;
      if (tweet) {
        return {
          text: tweet.full_text,
          created_at: tweet.created_at,
          likes: tweet.favorite_count,
          retweets: tweet.retweet_count,
          replies: tweet.reply_count,
          language: tweet.lang,
          conversation_id: tweet.conversation_id_str,
          author: {
            name: tweet.user_id_str,
            tweet_id: tweet.id_str,
          },
        };
      }
      return null;
    }).filter(Boolean); // Filter out invalid entries

    console.log("Tweet Data:", JSON.stringify(tweetData, null, 2));

    // If tweetData is empty, return a message indicating no valid tweets
    if (tweetData.length === 0) {
      return new Response("No valid tweet data found", { status: 404 });
    }

    return new Response(JSON.stringify(tweetData), { status: 200 });

  } catch (error: any) {
    console.error("Error fetching tweet data:", error);
    return new Response(JSON.stringify({ message: "Error fetching tweet data", error: error.message }), {
      status: 500,
    });
  }
}
