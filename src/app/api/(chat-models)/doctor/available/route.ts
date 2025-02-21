import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    // Set headers for Server-Sent Events
    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    };

    try {
        // Create a response stream
        const stream = new ReadableStream({
            async start(controller) {
                let isStreamClosed = false;

                // Function to fetch and send doctors
                const sendDoctors = async () => {
                    // Don't try to send if stream is closed
                    if (isStreamClosed) {
                        return;
                    }

                    try {
                        const doctors = await db.doctor.findMany({
                            where: {
                                isAvailable: true,
                            },
                            select: {
                                id: true,
                                name: true,
                                speciality: true,
                                isAvailable: true,
                            }
                        });

                        // Check if stream is still open before sending
                        if (!isStreamClosed) {
                            const data = `data: ${JSON.stringify(doctors)}\n\n`;
                            controller.enqueue(new TextEncoder().encode(data));
                        }
                    } catch (error) {
                        console.error('[DOCTOR_FETCH_ERROR]', error);
                        // Only send error if stream is still open
                        if (!isStreamClosed) {
                            const errorData = `event: error\ndata: Failed to fetch doctors\n\n`;
                            try {
                                controller.enqueue(new TextEncoder().encode(errorData));
                            } catch (error: unknown) {
                                if (error && typeof error === 'object' && 'code' in error) {
                                    if (error.code === 'ERR_INVALID_STATE') {
                                        isStreamClosed = true;
                                    }
                                }
                            }
                        }
                    }
                };

                // Initial send
                await sendDoctors();

                // Poll for updates every 30 seconds
                const interval = setInterval(sendDoctors, 30000);

                // Cleanup on close
                return () => {
                    isStreamClosed = true;
                    clearInterval(interval);
                };
            }
        });

        return new NextResponse(stream, { headers });
    } catch (error) {
        console.error('[DOCTOR_AVAILABILITY_STREAM]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
