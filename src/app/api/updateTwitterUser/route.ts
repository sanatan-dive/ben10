import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request): Promise<Response> {
  try {
    const { username, image, followers, posts } = await request.json();

    if (!username || !image) {
      return new Response("Invalid data", { status: 400 });
    }

    // Update only the image field for the given username
    const user = await prisma.user.update({
      where: { username },
      data: { image,
        followers,
        posts
       },
    });

    return new Response(
      JSON.stringify({ message: "User picture updated successfully", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user picture:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
