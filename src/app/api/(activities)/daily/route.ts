import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const tasks = await prisma.dailyTasks.findMany({
            where: {
                userId: user.id,
            },
            include: {
                tasks: true,
                completedTasks: true,
            },
        });

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}