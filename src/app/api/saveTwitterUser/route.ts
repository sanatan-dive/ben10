import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body
    const {
      username,
      image,
      followers,
      posts,
      alienName,
      alienTitle,
      alienType,
      alienPower,
      alienDescription,
    } = await request.json();

    // Validate the input data
    if (!username || !alienName || !alienTitle || !alienType || !alienPower || !alienDescription) {
      return new Response("Invalid data", { status: 400 });
    }
    

    // Save the user and alien data in the database (directly in the User model)
    const user = await prisma.user.create({
      data: {
        username,
        
        image: image || "/default-avatar.png", // Use default if no image
        followers,
        posts,
        alienName,
        alienTitle,
        alienType,
        alienPower,
        alienDescription,
      },
    });

    return new Response(
      JSON.stringify({ message: "User and Alien data saved successfully", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving user and alien data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
