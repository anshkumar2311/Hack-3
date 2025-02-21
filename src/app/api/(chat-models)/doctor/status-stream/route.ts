// app/api/doctor/status-stream/route.ts
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();
    let isStreamClosed = false;

    const stream = new ReadableStream({
        async start(controller) {
            // Send initial data
            try {
                const doctors = await db.doctor.findMany({
                    select: {
                        id: true,
                        clerkId: true,
                        name: true,
                        isAvailable: true,
                        speciality: true,
                        bio: true,
                        avatar: true,
                    }
                });

                if (!isStreamClosed) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(doctors)}\n\n`)
                    );
                }
            } catch (error) {
                console.error('Error fetching initial doctors:', error);
                controller.error(error);
                return;
            }

            // Set up interval for updates
            const interval = setInterval(async () => {
                if (isStreamClosed) {
                    clearInterval(interval);
                    return;
                }

                try {
                    const doctors = await db.doctor.findMany({
                        select: {
                            id: true,
                            clerkId: true,
                            name: true,
                            isAvailable: true,
                            speciality: true,
                            bio: true,
                            avatar: true,
                        }
                    });

                    if (!isStreamClosed) {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify(doctors)}\n\n`)
                        );
                    }
                } catch (error) {
                    console.error('Error fetching doctors update:', error);
                    if (!isStreamClosed) {
                        controller.error(error);
                    }
                    clearInterval(interval);
                }
            }, 5000);

            // Cleanup function
            return () => {
                isStreamClosed = true;
                clearInterval(interval);
            };
        },
        cancel() {
            isStreamClosed = true;
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
