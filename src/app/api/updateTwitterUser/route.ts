import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request): Promise<Response> {
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

    // Update or create user and alien data in the database
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        image: image || "/default-avatar.png", // Update to provided image or default
        followers,
        posts,
        alienName,
        alienTitle,
        alienType,
        alienPower,
        alienDescription,
      },
      create: {
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
      JSON.stringify({ message: "User and Alien data updated successfully", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user and alien data:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
