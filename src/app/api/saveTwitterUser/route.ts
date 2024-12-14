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

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Save the user and alien data in the database
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
