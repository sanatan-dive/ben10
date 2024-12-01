import { TwitterApi } from 'twitter-api-v2';

interface tweet{
  tweet: string
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  try {
    const apiKey = process.env.TWITTER_API_KEY_2;
    const apiSecretKey = process.env.TWITTER_API_SECRET_KEY_2;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN_2;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET_2;

    if (!apiKey || !apiSecretKey || !accessToken || !accessTokenSecret) {
      return new Response("Twitter OAuth credentials are missing", { status: 500 });
    }

    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecretKey,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    // Get user by username
    const user = await twitterClient.v2.userByUsername(username);

    if (!user.data) {
      return new Response("User not found", { status: 404 });
    }

    const userId = user.data.id;

    // Fetch user tweets, excluding replies
    const tweets = await twitterClient.v2.userTimeline(userId, {
      'tweet.fields': ['created_at', 'public_metrics', 'text'], // Specify required fields
      max_results: 10, // Limit to 10 tweets
      exclude: ['replies'], // Exclude replies
    });

    if (!tweets.data || tweets.data.length === 0) {
      return new Response("No tweets found for the user", { status: 404 });
    }

    // Map and format the tweet data
    const tweetData = tweets.data.map((tweet : any) => ({
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics,
    }));

    return new Response(
      JSON.stringify(tweetData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error fetching tweets:", error.message || error);
    return new Response("Error fetching tweets", { status: 500 });
  }
}
