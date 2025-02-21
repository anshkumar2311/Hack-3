// Add to your app/api/chat/[sessionId]/history/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { sessionId: string } }
) {
    try {
        const messages = await db.message.findMany({
            where: {
                chatSessionId: params.sessionId
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('[MESSAGE_HISTORY]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
