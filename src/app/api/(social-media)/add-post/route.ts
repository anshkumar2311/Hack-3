import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { PostCategory } from "@prisma/client";

// type PostCategory = 'GENERAL' | 'QUESTION' | 'EXPERIENCE' | 'ADVICE_REQUEST' | 'SUCCESS_STORY' | 'MEDICAL_INFO';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title, content, category, isPrivate, media } = await req.json();
    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category: category,
        isPrivate: isPrivate as boolean,
        userId: user.id,
        ...(media ? { media } : {}),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
