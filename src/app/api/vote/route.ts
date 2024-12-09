import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<Response> {
  try {
    const { voterId, votedUserId, value }: { voterId: number; votedUserId: number; value: number } = await request.json();

    // Validate input
    if (!voterId || !votedUserId || ![1, -1].includes(value)) {
      return new Response("Invalid input: voterId, votedUserId, or value is incorrect", { status: 400 });
    }

    if (voterId === votedUserId) {
      return new Response("You cannot vote for yourself.", { status: 403 });
    }

    // Check if the voter and voted user exist
    const [voter, votedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: voterId } }),
      prisma.user.findUnique({ where: { id: votedUserId } }),
    ]);

    if (!voter || !votedUser) {
      return new Response("Voter or voted user does not exist.", { status: 404 });
    }

    // Check if a vote already exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        voterId_votedUserId: {
          voterId,
          votedUserId,
        },
      },
    });

    if (existingVote) {
      // If a vote already exists, update it and adjust the follower count
      if (existingVote.value === value) {
        return new Response("You have already voted for this user.", { status: 400 });
      }
    
      // Adjust the follower count based on the vote change
      const difference = value + existingVote.value;
//       console.log("Existing vote:", existingVote.value);
// console.log("New vote:", value);
// console.log("Difference:", difference);

    
      await prisma.$transaction([
        prisma.vote.update({
          where: {
            voterId_votedUserId: {
              voterId,
              votedUserId,
            },
          },
          data: { value },
        }),
        prisma.user.update({
          where: { id: votedUserId },
          data: {
            followers: {
              increment: value , // Correctly adjust followers
            },
          },
        }),
      ]);
    } else {
      // Create a new vote and update the follower count
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            voterId,
            votedUserId,
            value,
          },
        }),
        prisma.user.update({
          where: { id: votedUserId },
          data: {
            followers: {
              increment: value, // Add the new vote
            },
          },
        }),
      ]);
    }
    


    return new Response(JSON.stringify({ message: "Vote recorded successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
