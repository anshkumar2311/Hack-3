import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigUp } from "lucide-react";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { timeAgo, updateLike } from "./utils";

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
// Updated interfaces to match API response
interface Commenter {
    type: 'user' | 'doctor';
    name: string;
    avatar: string | null;
    isVerified?: boolean;
    speciality?: string | null;
  }

export default function CommentThread({ comment, postId, depth = 0,liked }: { comment: Comment; postId: string; depth?: number,liked:boolean }) {
    const [hasLiked, setHasLiked] = useState(liked);
    const [likes, setLikes] = useState(comment.likesCount);
    const [isLiking, setIsLiking] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLike = async () => {
        if (isLiking) return;

        try {
            setIsLiking(true);
            setError(null);

            const newLikeCount = hasLiked ? likes - 1 : likes + 1;
            setLikes(newLikeCount);
            setHasLiked(!hasLiked);

            const action = hasLiked ? 'remove' : 'add';
            const result = await updateLike({ type: 'comment', action, id: comment.id });

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

    return (
        <div className={`pl-${depth * 4}`}>
            <div className="flex items-start space-x-2 mb-2">
                <Avatar className="w-6 h-6">
                    <AvatarImage src={comment.commenter.avatar || undefined} />
                    <AvatarFallback>{comment.commenter.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{comment.commenter.name}</span>
                        {comment.commenter.type === 'doctor' && comment.commenter.isVerified && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                                Verified Doctor
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground">• {timeAgo(new Date(comment.updatedAt||comment.createdAt))}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 ${hasLiked ? 'text-red-500' : ''}`}
                                onClick={handleLike}
                                disabled={isLiking}
                            >
                                <ArrowBigUp className="h-4 w-4" />
                            </Button>
                            <span className="text-xs min-w-[1.5rem] text-center">{likes}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                            Reply
                        </Button>
                    </div>
                    {error && <span className="text-sm text-red-500">{error}</span>}
                    {showReplyForm && (
                        <div className="mt-2">
                            <CommentForm
                                postId={postId}
                                parentId={comment.id}
                                onSuccess={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 pl-4 border-l border-border">
                    {comment.replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                            liked={reply.hasLiked}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}