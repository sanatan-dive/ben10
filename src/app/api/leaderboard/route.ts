
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
  try {
    // Aggregate votes for each user
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        image: true,
        alienName: true,
        alienTitle: true,
        votesReceived: {
          select: { value: true },
        },
      },
    });

    // Calculate net votes (upvotes - downvotes) for each user
    const rankedUsers = leaderboard
      .map((user) => ({
        id: user.id,
        username: user.username,
        image: user.image,
        alienName: user.alienName,
        alienTitle: user.alienTitle,
        netVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
      }))
      .sort((a, b) => b.netVotes - a.netVotes); // Sort by net votes

    return new Response(JSON.stringify(rankedUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
