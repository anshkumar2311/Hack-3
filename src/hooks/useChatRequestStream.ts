import type { ChatSessionWithUser } from '@/types/chat';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

export function useChatRequestStream() {
    const [requests, setRequests] = useState<ChatSessionWithUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        let isSubscribed = true;
        const eventSource = new EventSource('/api/chat/requests');

        eventSource.onmessage = (event) => {
            if (!isSubscribed) return;

            try {
                const newRequests = JSON.parse(event.data) as ChatSessionWithUser[];
                setRequests(newRequests);

                // Show notification for new requests
                if (newRequests.length > 0) {
                    const currentIds = new Set(requests.map(r => r.id));
                    const newRequestsCount = newRequests.filter(r => !currentIds.has(r.id)).length;

                    if (newRequestsCount > 0) {
                        toast({
                            title: 'New Chat Request',
                            description: `You have ${newRequestsCount} new chat request${newRequestsCount > 1 ? 's' : ''}`,
                        });
                    }
                }
            } catch (err) {
                console.error('Error parsing chat requests:', err);
                setError('Failed to process chat requests');
            }
        };

        eventSource.onerror = () => {
            if (!isSubscribed) return;

            setError('Connection error. Reconnecting...');

            // The browser will automatically try to reconnect
            toast({
                title: 'Connection Error',
                description: 'Reconnecting to chat request stream...',
                variant: 'destructive',
            });
        };

        return () => {
            isSubscribed = false;
            eventSource.close();
        };
    }, [requests, toast]);

    const reconnect = () => {
        setError(null);
        // The useEffect will automatically re-run and create a new connection
    };

    return {
        requests,
        error,
        reconnect
    };
}
