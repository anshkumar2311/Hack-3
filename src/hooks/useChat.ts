// hooks/useChat.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from './use-toast';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderRole: 'USER' | 'DOCTOR';
    timestamp: string;
    chatSessionId: string;
}

export function useChat(sessionId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const { toast } = useToast();

    // Function to establish SSE connection
    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(`/api/chat/${sessionId}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            console.log("woring message");
            try {
                const newMessages = JSON.parse(event.data);
                setMessages(current => {
                    // If it's an array of messages (initial load)
                    if (Array.isArray(newMessages)) {
                        return [...newMessages];
                    }
                    // If it's a single new message
                    const messageArray = Array.isArray(newMessages) ? newMessages : [newMessages];
                    const uniqueMessages = messageArray.filter(
                        newMsg => !current.some(msg => msg.id === newMsg.id)
                    );
                    return [...current, ...uniqueMessages];
                });
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        };

        eventSource.onerror = (event) => {
            console.error('EventSource error:', event);
            setError('Connection error');
            setIsConnected(false);

            // Close the errored connection
            eventSource.close();

            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
                connect();
            }, 3000);

            toast({
                title: 'Connection Error',
                description: 'Attempting to reconnect...',
                variant: 'destructive',
            });
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [sessionId, toast]);

    // Initialize connection
    useEffect(() => {
        const cleanup = connect();
        return () => {
            cleanup();
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [connect]);

    // Function to send a message
    const sendMessage = async (
        content: string,
        senderId: string,
        senderRole: 'USER' | 'DOCTOR'
    ) => {
        try {
            const response = await fetch(`/api/chat/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    senderId,
                    senderRole,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            return await response.json();
        } catch (err) {
            console.error('Error sending message:', err);
            toast({
                title: 'Error',
                description: 'Failed to send message. Please try again.',
                variant: 'destructive',
            });
            throw err;
        }
    };

    return {
        messages,
        error,
        isConnected,
        sendMessage,
        reconnect: connect,
    };
}
