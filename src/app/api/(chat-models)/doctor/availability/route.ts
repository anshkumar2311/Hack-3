import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { isAvailable } = await req.json();

        const doctor = await db.doctor.update({
            where: {
                clerkId: userId,
            },
            data: {
                isAvailable,
            },
        });
        console.log(doctor);

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('[DOCTOR_AVAILABILITY]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
