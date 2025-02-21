// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to a temporary directory
        const uploadDir = join(process.cwd(), '/tmp');
        const filePath = join(uploadDir, file.name);
        await writeFile(filePath, buffer);
        console.log("test")

        return NextResponse.json({ filePath });
    } catch {
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
