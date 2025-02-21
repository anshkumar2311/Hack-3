import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { currentUser as auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const clerkUser  = await auth();
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, postId, parentId, media } = body;
    console.log(content, postId, parentId);
    
    if (!content || !postId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's internal ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If this is a reply, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }
    
    // Create the comment/reply in a transaction
    
    const result = await prisma.$transaction(async (tx) => {
      
      const comment = await tx.comment.create({
        data: {
          content,
          postId,
          userId: user.id,
          ...(parentId ? { parentId } : {}),
        },
      });      
      if (parentId) {
        await tx.comment.update({
          where: { id: parentId },
          data: {
            repliesCount: {
              increment: 1
            }
          }
        });
      }
        console.log('here3');

      // Increment post's comment count
      await tx.post.update({
        where: { id: postId },
        data: {
          commentsCount: {
            increment: 1
          }
        }
      });

      return comment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}