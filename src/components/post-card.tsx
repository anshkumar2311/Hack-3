'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, MessageSquare, Share2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CommentForm from '@/app/social/_components/CommentForm';
import CommentThread from '@/app/social/_components/comment-thread';
import { timeAgo, updateLike } from '@/app/social/_components/utils';

// Updated interfaces to match API response
interface Commenter {
  type: 'user' | 'doctor';
  name: string;
  avatar: string | null;
  isVerified?: boolean;
  speciality?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  repliesCount: number;
  likes: Array<{ userId: string }>;
  commenter: Commenter;
  replies: Comment[];
  hasLiked: boolean;
}

interface PostCardProps {
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
  media?: string[];
}

export function PostCard({
  id,
  title,
  content,
  author,
  createdAt,
  likesCount: initialLikes,
  commentsCount,
  hasLiked: initialHasLiked = false,
  media,
}: PostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setError(null);

      const newLikeCount = hasLiked ? likes - 1 : likes + 1;
      setLikes(newLikeCount);
      setHasLiked(!hasLiked);

      const action = hasLiked ? 'remove' : 'add';
      const result = await updateLike({ type: 'post', action, id });

      if (!result) {
        setLikes(likes);
        setHasLiked(hasLiked);
        setError('Failed to update like');
      }
    } catch (err) {
      setLikes(likes);
      setHasLiked(hasLiked);
      setError('An error occurred');
    } finally {
      setIsLiking(false);
    }
  };

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments); // Updated to match API response structure
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      loadComments();
    }
  };

  return (
    <Card className="mb-4 hover:bg-accent/50 transition-colors">
      {/* Rest of the PostCard JSX remains the same */}
      <CardHeader className="flex flex-row items-start space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{author.username}</span>
            <span className="text-sm text-muted-foreground">• {timeAgo(new Date(createdAt))}</span>
          </div>
          <h3 className="text-lg font-semibold mt-1">{title}</h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start">Save</Button>
              <Button variant="ghost" className="justify-start">Report</Button>
              <Button variant="ghost" className="justify-start">Hide</Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
        {media && media.length > 0 && (
            <div className="flex flex-wrap mt-4">
            {media.map((image, index) => (
              <img
              key={index}
              src={image}
              alt={`media-${index}`}
              className="w-1/3 h-auto object-cover m-1"
              />
            ))}
            </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex items-center space-x-4 w-full">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${hasLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <span className="min-w-[2rem] text-center">{likes}</span>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
          <Button
            variant="ghost"
            size="sm"
            className="space-x-2"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="space-x-2"
            onClick={handleToggleComments}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{commentsCount}</span>
            {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
        {showCommentForm && (
          <div className="w-full mt-4">
            <CommentForm postId={id} onSuccess={() => loadComments()} />
          </div>
        )}
        {showComments && (
          <div className="w-full mt-4">
            <ScrollArea className="h-[300px] w-full pr-4">
              {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} postId={id} liked={comment.hasLiked} />
              ))}
              {isLoading && (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}