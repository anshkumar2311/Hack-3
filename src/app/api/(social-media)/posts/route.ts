// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';


export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = (await prisma.user.findUnique({
        where: { clerkId: user.id },
        select: { id: true }
    }))?.id;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 10;
    
    // Get total count for determining if there are more posts
    const totalPosts = await prisma.post.count();
    
    const data = await prisma.post.findMany({
      include: {
        user: true,
        doctor: true,
        likes: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const postsWithHasLiked = data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.user?.id || post.doctor?.id || '',
        username: post.user?.username,
        avatar: post.user?.avatar || null
      },
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      hasLiked: post.likes.some(like => like.userId === userId),
      media: post.media
    }));

    return NextResponse.json({
      posts: postsWithHasLiked,
      hasMore: totalPosts > page * pageSize
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}