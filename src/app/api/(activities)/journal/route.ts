// /app/api/journal/route.ts
import { db } from '@/lib/db';
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user from our database using clerkId
        const dbUser = await db.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const journals = await db.journal.findMany({
            where: {
                userId: dbUser.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(journals);

    } catch (error) {
        console.error('Error fetching journal entries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch journal entries' },
            { status: 500 }
        );
    }
}
