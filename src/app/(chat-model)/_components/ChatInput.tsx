import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  maxLength = 1000,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-focus input on mount for desktop
  useEffect(() => {
    if (!("ontouchstart" in window)) {
      inputRef.current?.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!message.trim() || disabled) return;
    onSendMessage(message.trim());
    setMessage("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Don't submit if using IME (for languages like Chinese, Japanese, Korean)
    if (isComposing) return;

    // Submit on Enter (but Shift+Enter doesn't submit)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 sm:gap-3 rounded-xl bg-white/5 p-2 sm:p-3 backdrop-blur-lg border border-white/20 transition-all duration-300 focus-within:bg-white/10 hover:border-white/30"
    >
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="flex-1 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white outline-none placeholder:text-white/50 focus:outline-none disabled:opacity-50"
        aria-label="Message input"
      />
      {maxLength && message.length > maxLength * 0.8 && (
        <div className="absolute right-14 sm:right-16 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-white/50">
          {message.length}/{maxLength}
        </div>
      )}
      <button
        type="submit"
        className="rounded-lg bg-indigo-500/90 p-2 sm:p-2.5 text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        disabled={!message.trim() || disabled}
        aria-label="Send message"
      >
        <Send
          size={16}
          className="sm:w-[18px] sm:h-[18px] transition-transform group-active:translate-x-1"
        />
      </button>
    </form>
  );
};
