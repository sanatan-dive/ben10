import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
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
      return new NextResponse(`Error fetching Twitter data: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Parse the JSON response from RapidAPI
    const jsonResponse = await response.json();

    // Check if the user data exists in the response
    if (jsonResponse.status !== "active") {
      return new NextResponse("User not found or inactive", { status: 404 });
    }

    // Scrape profile image using puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the Twitter profile and wait for the profile image element
    await page.goto(`https://twitter.com/${username}`, { waitUntil: "domcontentloaded" });
    
    // Wait for the profile image to be loaded
    await page.waitForSelector('div[aria-label="Opens profile photo"] div[style]', { visible: true });

    // Scrape the profile image URL
 // Scrape the profile image URL
const profileImage = await page.evaluate(() => {
  const profileImageElement = document.querySelector('div[aria-label="Opens profile photo"] div[style]');
  if (profileImageElement) {
    // Cast the element to an HTMLDivElement to access the style property
    const element = profileImageElement as HTMLElement;
    const style = element.style.backgroundImage;
    if (style) {
      return style.slice(5, -2); // Remove 'url("...")' to get the actual URL
    }
  }
  return null;
});


    // Close the browser
    await browser.close();

    // Extract and format relevant data from RapidAPI response
    const userData = {
      name: jsonResponse.name,
      username: jsonResponse.profile,
      profile_image_url: profileImage, // Override with scraped image
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

    // Return the user data with the scraped profile image
    return new NextResponse(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error occurred:", error.message || error);
    return new NextResponse("Error fetching Twitter data", { status: 500 });
  }
}