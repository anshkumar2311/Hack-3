
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
}

export const MessageBubble = ({ message, isUser = false, timestamp }: MessageBubbleProps) => {
    console.log("Message", message, isUser, timestamp)
  return (
    <div
      className={cn(
        "flex z-[999] w-full animate-message-in ",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%]  sm:max-w-[80%] rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
          isUser
            ? "bg-indigo-500/80 text-white backdrop-blur-lg"
            : "bg-white/10 text-white backdrop-blur-lg"
        )}
      >
        <p className="text-xs sm:text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <span className="mt-1 sm:mt-2 block text-[8px] sm:text-[10px] opacity-50">{timestamp}</span>
        )}
      </div>
    </div>
  );
};
