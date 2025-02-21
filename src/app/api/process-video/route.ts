// app/api/process-video/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { video_path } = await request.json();

        const response = await fetch('http://localhost:8000/process-video/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ video_path }),
        });

        if (!response.ok) {
            throw new Error('Failed to process video');
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch  {
        return NextResponse.json(
            { error: 'Failed to process video' },
            { status: 500 }
        );
    }
}
