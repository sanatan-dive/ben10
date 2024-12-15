import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  
  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  try {
    // RapidAPI credentials from environment variables
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return new NextResponse("RapidAPI key is missing", { status: 500 });
    }

    // Fetch user data from the RapidAPI endpoint
    const response = await fetch(
      `https://twitter-api45.p.rapidapi.com/screenname.php?screenname=${username}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "twitter-api45.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );

    if (!response.ok) {
      console.error(`Error fetching Twitter data: Status ${response.status}, Message: ${response.statusText}`);
      return new NextResponse(`Error fetching Twitter data: ${response.statusText}`, {
        status: response.status,
      });
    }
    

    // Parse the JSON response from RapidAPI
    const jsonResponse = await response.json();

    if (jsonResponse.status !== "active") {
      return new NextResponse("User not found or inactive", { status: 404 });
    }

    const userImage = jsonResponse.avatar.replace('_normal', '_200x200');


    const userData = {
      name: jsonResponse.name,
      username: jsonResponse.profile,
      profile_image_url: userImage, 
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

    // console.log("User Data:", userData);

    return new NextResponse(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error occurred:", error.message || error);
    return new NextResponse("Error fetching Twitter data", { status: 500 });
  }
}
