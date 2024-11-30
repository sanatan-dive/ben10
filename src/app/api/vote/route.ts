import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    const { voterId, votedUserId, value }: { voterId: number; votedUserId: number; value: number } = await request.json();

    // Validate input
    if (!voterId || !votedUserId || ![1, -1].includes(value)) {
      return new Response("Invalid input", { status: 400 });
    }

    // Prevent self-voting
    if (voterId === votedUserId) {
      return new Response("You cannot vote for yourself", { status: 400 });
    }

    // Check if the voter and voted user exist
    const [voter, votedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: voterId } }),
      prisma.user.findUnique({ where: { id: votedUserId } }),
    ]);

    if (!voter || !votedUser) {
      return new Response("Voter or voted user does not exist", { status: 404 });
    }

    // Save the vote
    const vote = await prisma.vote.create({
      data: {
        voterId,
        votedUserId,
        value,
      },
    });

    return new Response(JSON.stringify({ message: "Vote recorded", vote }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in vote creation:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
