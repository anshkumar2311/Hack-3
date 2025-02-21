import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
    status: z.enum(['accepted', 'rejected'])
});

export async function PATCH(
    req: Request,
    { params }: { params: { requestId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Validate requestId
        const requestId = params?.requestId;
        if (!requestId) {
            return new NextResponse('Request ID is required', { status: 400 });
        }

        // Parse and validate request body
        const body = await req.json();
        const result = updateSchema.safeParse(body);
        if (!result.success) {
            return new NextResponse('Invalid status', { status: 400 });
        }

        const { status } = result.data;

        // Verify doctor
        const doctor = await db.doctor.findUnique({
            where: { clerkId: userId }
        });

        if (!doctor) {
            return new NextResponse('Doctor not found', { status: 404 });
        }

        // Check if session exists and belongs to the doctor
        const existingSession = await db.chatSession.findFirst({
            where: {
                id: requestId,
                doctorId: doctor.id
            }
        });

        if (!existingSession) {
            return new NextResponse('Chat session not found', { status: 404 });
        }

        // Check if session is already handled
        if (existingSession.startedAt || existingSession.endedAt) {
            return NextResponse.json(existingSession);
        }

        // Update session
        const session = await db.chatSession.update({
            where: { id: requestId },
            data: {
                startedAt: status === 'accepted' ? new Date() : undefined,
                endedAt: status === 'rejected' ? new Date() : undefined
            }
        });

        // Add system message if accepted
        if (status === 'accepted') {
            await db.message.create({
                data: {
                    chatSessionId: session.id,
                    content: "Chat session started",
                    senderId: doctor.id,
                    senderRole: "DOCTOR"
                }
            });
        }

        return NextResponse.json(session);
    } catch (error) {
        if (error instanceof Error) {
            console.error('[CHAT_REQUEST_UPDATE]', {
                message: error.message,
                stack: error.stack
            });
        } else {
            console.error('[CHAT_REQUEST_UPDATE]', { error });
        }
        return new NextResponse('Internal Error', { status: 500 });
    }
}
