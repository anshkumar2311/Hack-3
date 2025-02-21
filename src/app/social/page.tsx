'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { PostCard } from '@/components/post-card';
import CreatePost from '@/app/social/_components/create-post';
import Navbar from '../_components/Navbar';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  hasLiked?: boolean;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reference for the last post element
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;

    // Disconnect the previous observer if it exists
    if (observer.current) observer.current.disconnect();

    // Create a new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchPosts = async (pageNumber: number) => {
    try {
      const response = await fetch(`/api/posts?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();

      const formattedPosts = data.posts.map((post: any) => ({
        title: post.title,
        content: post.content ?? '',
        author: {
          id: post.author?.id || post.doctor?.id || '',
          username: post.user?.username || post.doctor?.name || 'Anonymous',
          avatar: post.user?.avatar || post.doctor?.avatar
        },
        createdAt: post.createdAt,
        votes: post.likesCount,
        comments: post.commentsCount,
        id: post.id,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        hasLiked: post.hasLiked,
        media: post.media
      }));

      setHasMore(data.hasMore);
      setPosts(prev => pageNumber === 1 ? formattedPosts : [...prev, ...formattedPosts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts(page);
  }, [page]);

  return (
    <div className="min-h-full bg-black">
      <main className="max-w-2xl mx-auto p-4">
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : undefined}
              className="bg-black text-white p-4 rounded-lg"
            >
              <PostCard {...post} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center text-gray-500 p-4">
              No more posts to load
            </div>
          )}
        </div>
      </main>
      <CreatePost />
    </div>
  );
}
