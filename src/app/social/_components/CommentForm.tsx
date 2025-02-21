'use client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { submitComment } from "./utils";

export default function CommentForm({ postId, parentId, onSuccess }: { postId: string; parentId?: string; onSuccess: () => void }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await submitComment({ postId, content, parentId });

      if (result) {
        setContent('');
        onSuccess();
      } else {
        setError('Failed to submit comment');
      }
    } catch (err) {
      console.log(err);
      
      setError('An error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setContent('')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
