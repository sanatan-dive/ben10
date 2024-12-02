
export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  try {
    // RapidAPI credentials from environment variables
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return new Response("RapidAPI key is missing", { status: 500 });
    }

    // Fetch user data from the new RapidAPI endpoint
    const response = await fetch(`https://twitter-api45.p.rapidapi.com/screenname.php?screenname=${username}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching Twitter data: Status ${response.status}, Message: ${response.statusText}`);
      return new Response(`Error fetching Twitter data: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Parse the JSON response
    const jsonResponse = await response.json();

    // Check if the user data exists in the response
    if (jsonResponse.status !== "active") {
      return new Response("User not found or inactive", { status: 404 });
    }

    // Extract and format relevant data
    const userData = {
      name: jsonResponse.name,
      username: jsonResponse.profile,
      profile_image_url: jsonResponse.avatar,
      description: jsonResponse.desc,
      followers_count: jsonResponse.sub_count,
      following_count: jsonResponse.friends,
      tweet_count: jsonResponse.statuses_count,
      profile_banner_url: jsonResponse.header_image,
      verified: jsonResponse.blue_verified || false,
      url: jsonResponse.website,
      location: jsonResponse.location,
      created_at: jsonResponse.created_at,
      user_id: jsonResponse.id,
    };
    
    // Return formatted response
    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error occurred:", error.message || error);
    return new Response("Error fetching Twitter data", { status: 500 });
  }
}
