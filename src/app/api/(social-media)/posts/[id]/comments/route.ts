import { NextResponse, type NextRequest } from "next/server";
import { db as prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Remove the await from params - it's already an object
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (
      await prisma.user.findUnique({
        where: { clerkId: user?.id },
        select: { id: true },
      })
    )?.id;
    if (!id) {
      return Response.json(
        { error: "Post ID is required", comments: [] },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
        parentId: null,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            isAnonymous: true,
          },
        },
        doctor: {
          select: {
            name: true,
            avatar: true,
            isVerified: true,
            speciality: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
                isAnonymous: true,
              },
            },
            doctor: {
              select: {
                name: true,
                avatar: true,
                isVerified: true,
                speciality: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const transformedComments = comments.map((comment) => {
      const baseLikes = Array.isArray(comment.likes) ? comment.likes : [];
      const baseReplies = Array.isArray(comment.replies) ? comment.replies : [];
      
      

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        likesCount: comment.likesCount,
        repliesCount: comment.repliesCount,
        hasLiked: comment.likes.some((like) => {
          console.log(userId, like.userId, like.userId === userId);
          return like.userId === userId
        }),
        likes: baseLikes,
        commenter: comment.doctor
          ? {
              type: "doctor" as const,
              name: comment.doctor.name,
              avatar: comment.doctor.avatar,
              isVerified: comment.doctor.isVerified,
              speciality: comment.doctor.speciality,
            }
          : {
              type: "user" as const,
              name: comment.user?.isAnonymous
                ? "Anonymous User"
                : comment.user?.username || "Unknown User",
              avatar: comment.user?.avatar,
            },
        replies: baseReplies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          likesCount: reply.likesCount,
          likes: Array.isArray(reply.likes) ? reply.likes : [],
          commenter: reply.doctor
            ? {
                type: "doctor" as const,
                name: reply.doctor.name,
                avatar: reply.doctor.avatar,
                isVerified: reply.doctor.isVerified,
                speciality: reply.doctor.speciality,
              }
            : {
                type: "user" as const,
                name: reply.user?.isAnonymous
                  ? "Anonymous User"
                  : reply.user?.username || "Unknown User",
                avatar: reply.user?.avatar,
              },
        })),
      };
    });
    return Response.json({
      comments: transformedComments,
      total: transformedComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json(
      { error: "Failed to fetch comments", comments: [] },
      { status: 500 }
    );
  }
}
