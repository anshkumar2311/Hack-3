import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { requestId: string } }
) {
    const { requestId } = params;
    const origin = req.headers.get('origin') || '';

    // Validate request ID
    if (!requestId) {
        return new Response('Missing request ID', { status: 400 });
    }

    const encoder = new TextEncoder();

    try {
        const session = await db.chatSession.findUnique({
            where: { id: requestId }
        });

        if (!session) {
            return new Response('Session not found', {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET',
                }
            });
        }

        const stream = new ReadableStream({
            async start(controller) {
                let isConnectionActive = true;

                const sendStatus = async () => {
                    if (!isConnectionActive) return;

                    try {
                        const updatedSession = await db.chatSession.findUnique({
                            where: { id: requestId }
                        });

                        if (!updatedSession) {
                            isConnectionActive = false;
                            controller.close();
                            return;
                        }

                        let status = 'pending';
                        if (updatedSession.endedAt) {
                            status = 'rejected';
                        } else if (updatedSession.startedAt) {
                            status = 'accepted';
                        }

                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ status })}\n\n`)
                        );

                        if (status !== 'pending') {
                            isConnectionActive = false;
                            controller.close();
                        }
                    } catch (error) {
                        console.error('Error sending status:', error);
                        isConnectionActive = false;
                        try {
                            controller.close();
                        } catch {} // Ignore if already closed
                    }
                };

                // Send initial status
                await sendStatus();

                // Poll for status changes
                const interval = setInterval(async () => {
                    if (!isConnectionActive) {
                        clearInterval(interval);
                        return;
                    }
                    await sendStatus();
                }, 1000);

                // Cleanup
                return () => {
                    isConnectionActive = false;
                    clearInterval(interval);
                };
            },
            cancel() {
                // This will trigger the cleanup function
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('Stream setup error:', error);
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET',
            }
        });
    }
}
