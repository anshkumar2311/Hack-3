// import { Message } from '../types';

import { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const messageClass = message.sender === 'user' ? 'user-message' : 'bot-message';
  
  return (
    <div className={messageClass}>
      {message.text}
    </div>
  );
}