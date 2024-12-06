import { PrismaClient } from "@prisma/client";

export async function GET(request: Request): Promise<Response> {
    try {
        const prisma = new PrismaClient();
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response("Internal server error", { status: 500 });
    }
}