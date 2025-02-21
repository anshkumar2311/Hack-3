
export async function updateLike({
  type,
  action,
  id,
}: {
  type: "comment" | "post";
  action: "add" | "remove";
  id: string;
}) {
  try {
    const response = await fetch("/api/update-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, action, id }),
    });

    if (!response.ok) {
      throw new Error("Failed to update like");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating like:", error);
    return null;
  }
}

export async function submitComment({
  postId,
  content,
  parentId,
}: {
  postId: string;
  content: string;
  parentId?: string;
}) {
  try {
    console.log(postId, content, parentId);

    const response = await fetch("/api/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, content, parentId }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting comment:", error);
    return null;
  }
}

export function timeAgo(date: Date): string {
  const now = new Date();
  date.getTime();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}