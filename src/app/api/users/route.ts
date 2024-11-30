import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        pfpUrl: true, // Add any other fields you need
      },
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
