// /app/api/journal/analyze/route.ts
import { db } from '@/lib/db';
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to extract JSON from AI response
const extractJSONFromText = (text: string) => {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {
            keywords: ['reflection'],
            mood: 'neutral',
            themes: text.slice(0, 100)
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
            keywords: ['reflection'],
            mood: 'neutral',
            themes: 'Analysis unavailable'
        };
    }
};

export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user from our database using clerkId
        const dbUser = await db.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { content, title } = await req.json();

        // Analyze content with Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `You are an AI journal analyzer. Analyze the following journal entry and provide the analysis in strict JSON format. Do not include any additional text, only return the JSON object.

Journal entry: "${content}"

Return your analysis in this exact format:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "mood": "overall mood",
  "themes": "key themes and insights"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        const analysis = extractJSONFromText(responseText);

        // Save journal entry to database
        try {
            const journal = await db.journal.create({
                data: {
                    title,
                    content,
                    userId: dbUser.id,  // Changed from id to userId
                }
            });

            return NextResponse.json({
                journal,
                analysis,
            });
        } catch (dbError) {
            console.error('Database error details:', dbError);
            throw dbError;
        }

    } catch (error) {
        console.error('Error processing journal entry:', error);
        return NextResponse.json(
            {
                error: 'Failed to process journal entry',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
