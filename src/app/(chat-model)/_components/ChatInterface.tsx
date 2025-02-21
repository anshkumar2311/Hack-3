// components/ChatInterface.tsx
import { useChat } from '@/hooks/useChat';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
    sessionId: string;
    senderId: string;
    senderRole: 'USER' | 'DOCTOR';
    onAvatarSpeaking?: (isSpeaking: boolean) => void;
}

export const ChatInterface = ({
    sessionId,
    senderId,
    senderRole,
    onAvatarSpeaking
}: ChatInterfaceProps) => {
    const { messages, error, isConnected, sendMessage } = useChat(sessionId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (onAvatarSpeaking) {
            onAvatarSpeaking(true);
        }

        try {
            await sendMessage(text, senderId, senderRole);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setTimeout(() => {
                if (onAvatarSpeaking) {
                    onAvatarSpeaking(false);
                }
            }, 1000);
        }
    };

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                    </div>
                </div>
            )}
            <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto p-3 sm:p-6 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message.content}
                        isUser={message.senderId === senderId}
                        timestamp={new Date(message.timestamp).toLocaleTimeString()}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-white/10 p-3 sm:p-6">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};
