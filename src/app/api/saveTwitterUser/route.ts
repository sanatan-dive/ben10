import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body
    const { username }: { username?: string } = await request.json();

    // Validate the input
    if (!username || typeof username !== "string") {
      return new Response("Valid username is required", { status: 400 });
    }

    // Save the username and twitterId in the database, both with the same value
    try {
      const user = await prisma.user.create({
        data: {
          username,
          twitterId: username, // Set both username and twitterId to the same value
        },
      });
      return new Response(
        JSON.stringify({ message: "Username saved", user }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return new Response("Username or Twitter ID already exists", { status: 400 });
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error saving username:", error.message || error);
    return new Response("Internal server error", { status: 500 });
  }
}
