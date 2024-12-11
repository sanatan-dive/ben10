import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
  try {
    // Fetch users with their alien info and sorting logic
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        image: true,
        alienName: true,
        alienTitle: true,
      },
    });

    // Function to assign priority based on alien title
    const alienTitlePriority = (alienTitle: string) => {
      switch (alienTitle) {
        case "Legendary":
          return 4;
        case "Epic":
          return 3;
        case "Rare":
          return 2;
        case "Common":
          return 1;
        default:
          return 0;
      }
    };

    // Sort users based on alienTitle priority
    const rankedUsers = leaderboard
      .sort((a, b) => alienTitlePriority(b.alienTitle) - alienTitlePriority(a.alienTitle));

    return new Response(JSON.stringify(rankedUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
