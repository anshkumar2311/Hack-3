import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const doctor = await db.doctor.findUnique({
            where: { clerkId: userId }
        });

        if (!doctor) {
            return new NextResponse('Doctor not found', { status: 404 });
        }

        const encoder = new TextEncoder();
        let isStreamActive = true;

        const stream = new ReadableStream({
            start(controller) {
                let intervalId: NodeJS.Timeout;

                const sendPendingRequests = async () => {
                    if (!isStreamActive) {
                        clearInterval(intervalId);
                        return;
                    }

                    try {
                        const requests = await db.chatSession.findMany({
                            where: {
                                doctorId: doctor.id,
                                startedAt: null,
                                endedAt: null
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        avatar: true
                                    }
                                },
                                messages: {
                                    orderBy: { timestamp: 'desc' },
                                    take: 1,
                                    select: {
                                        id: true,
                                        content: true,
                                        senderId: true,
                                        senderRole: true,
                                        timestamp: true
                                    }
                                }
                            },
                            orderBy: {
                                startedAt: 'desc'
                            }
                        });

                        if (isStreamActive) {
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify(requests)}\n\n`)
                            );
                        }
                    } catch (error) {
                        console.error('Error fetching requests:', error);
                        isStreamActive = false;
                        clearInterval(intervalId);
                        try {
                            controller.close();
                        } catch (closeError) {
                            // Ignore close errors
                        }
                    }
                };

                // Initial send
                sendPendingRequests().catch((error) => {
                    console.error('Error in initial send:', error);
                    isStreamActive = false;
                    try {
                        controller.close();
                    } catch (closeError) {
                        // Ignore close errors
                    }
                });

                // Set up polling
                intervalId = setInterval(sendPendingRequests, 1000);

                // Cleanup when the stream is cancelled
                return () => {
                    isStreamActive = false;
                    clearInterval(intervalId);
                };
            },
            cancel() {
                isStreamActive = false;
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('[CHAT_REQUESTS_STREAM]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
