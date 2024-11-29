import { TwitterApi } from 'twitter-api-v2';

// This GET function will handle incoming requests for user data
export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  try {
    // OAuth 1.0a credentials from environment variables
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecretKey = process.env.TWITTER_API_SECRET_KEY;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    

    if (!apiKey || !apiSecretKey || !accessToken || !accessTokenSecret) {
      return new Response("Twitter OAuth credentials are missing", { status: 500 });
    }

    // Initialize Twitter client with OAuth 1.0a credentials
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecretKey,
      accessToken,
      accessSecret: accessTokenSecret,
    });
    console.log('here')

    // Get user by username
    const user = await twitterClient.v2.userByUsername(username, {
      'user.fields': ['profile_image_url', 'public_metrics'], // Request necessary fields
    });
    

    const userData = user.data;
    

    if (!userData) {
      return new Response("User not found", { status: 404 });
    }

    // Return the relevant user data
    return new Response(
      JSON.stringify({
        name: userData.name,
        profile_image_url: userData.profile_image_url,
        public_metrics: userData.public_metrics,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error fetching Twitter data:", error.message || error);
    return new Response("Error fetching Twitter data", { status: 500 });
  }
}
