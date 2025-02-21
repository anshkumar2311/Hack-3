// app/api/chat/request/route.ts
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Parse request body
        const body = await req.json();
        if (!body || !body.doctorId) {
            return new NextResponse('Missing doctorId', { status: 400 });
        }

        const { doctorId } = body;

        // Verify doctor exists and is available
        const doctor = await db.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!doctor) {
            return new NextResponse('Doctor not found', { status: 404 });
        }

        if (!doctor.isAvailable) {
            return new NextResponse('Doctor is not available', { status: 400 });
        }

        // Get user record from database
        const user = await db.user.findFirst({
            where: { clerkId: userId }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Check for existing active session
        const existingSession = await db.chatSession.findFirst({
            where: {
                userId: user.id,
                doctorId: doctor.id,
                startedAt: null,
                endedAt: null
            }
        });

        if (existingSession) {
            return NextResponse.json(existingSession);
        }

        // Create new chat session
        const session = await db.chatSession.create({
            data: {
                userId: user.id,
                doctorId: doctor.id,
            }
        });

        return NextResponse.json(session);

    } catch (error) {
        console.error('[CHAT_REQUEST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
