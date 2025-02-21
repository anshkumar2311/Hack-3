import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import {currentUser as auth} from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, action, id } = body;
    const  userId  = (await auth())?.id;

    // Check authentication
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    if (!type || !action || !id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type !== 'post' && type !== 'comment') {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      );
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json(
        { error: 'Invalid action specified' },
        { status: 400 }
      );
    }

    // Get the user's internal ID from clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (type === 'post') {
      // Handle post likes
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          likes: {
            where: {
              userId: user.id
            }
          }
        }
      });

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      const existingLike = post.likes.length > 0;

      if ((action === 'add' && existingLike) || (action === 'remove' && !existingLike)) {
        return NextResponse.json(
          { error: 'Invalid like operation' },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.post.update({
          where: { id },
          data: {
            likesCount: {
              increment: action === 'add' ? 1 : -1
            }
          }
        }),
        action === 'add'
          ? prisma.like.create({
              data: {
                post: { connect: { id } },
                user: { connect: { id: user.id } }
              }
            })
          : prisma.like.delete({
              where: {
                postId_userId: {
                  postId: id,
                  userId: user.id
                }
              }
            })
      ]);
    } else {
      // Handle comment likes
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          likes: {
            where: {
              userId: user.id
            }
          }
        }
      });

      if (!comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }

      const existingLike = comment.likes.length > 0;

      if ((action === 'add' && existingLike) || (action === 'remove' && !existingLike)) {
        return NextResponse.json(
          { error: 'Invalid like operation' },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.comment.update({
          where: { id },
          data: {
            likesCount: {
              increment: action === 'add' ? 1 : -1
            }
          }
        }),
        action === 'add'
          ? prisma.commentLike.create({
              data: {
                comment: { connect: { id } },
                user: { connect: { id: user.id } }
              }
            })
          : prisma.commentLike.delete({
              where: {
                commentId_userId: {
                  commentId: id,
                  userId: user.id
                }
              }
            })
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}