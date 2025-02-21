// app/api/chat/request/[requestId]/status/route.ts
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { requestId: string } }
) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const interval = setInterval(async () => {
                const session = await db.chatSession.findUnique({
                    where: { id: params.requestId }
                });

                if (session?.endedAt) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ rejected: true })}\n\n`)
                    );
                    controller.close();
                } else if (session?.startedAt) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ accepted: true })}\n\n`)
                    );
                    controller.close();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
