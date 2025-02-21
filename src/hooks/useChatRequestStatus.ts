'use client'

import type { RequestStatus } from '@/types/chat';
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

export function useChatRequestStatus(requestId: string) {
    const [status, setStatus] = useState<RequestStatus>('pending');
    const [error, setError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        let isSubscribed = true;
        let retryCount = 0;
        const maxRetries = 3;

        function connect() {
            if (!isSubscribed) return;

            setIsConnecting(true);
            setError(null);

            const eventSource = new EventSource(`/api/chat/request/${requestId}/status`);

            eventSource.onmessage = (event) => {
                if (!isSubscribed) return;

                try {
                    const data = JSON.parse(event.data);

                    if (data.error) {
                        setError(data.error);
                        eventSource.close();
                        return;
                    }

                    if (data.status) {
                        setStatus(data.status);

                        // Show notification for status changes
                        if (data.status === 'accepted') {
                            toast({
                                title: 'Chat Request Accepted',
                                description: 'The doctor has accepted your chat request',
                            });
                        } else if (data.status === 'rejected') {
                            toast({
                                title: 'Chat Request Rejected',
                                description: 'The doctor has rejected your chat request',
                                variant: 'destructive',
                            });
                        }

                        // Close connection if we have a final status
                        if (data.status !== 'pending') {
                            eventSource.close();
                        }
                    }
                } catch (err) {
                    console.error('Error parsing status:', err);
                    setError('Failed to process status update');
                }
            };

            eventSource.onopen = () => {
                if (!isSubscribed) return;
                setIsConnecting(false);
                retryCount = 0; // Reset retry count on successful connection
            };

            eventSource.onerror = (err) => {
                if (!isSubscribed) return;
                console.error('Status stream error:', err);

                eventSource.close();
                setIsConnecting(false);

                if (retryCount < maxRetries) {
                    retryCount++;
                    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);

                    toast({
                        title: 'Connection Error',
                        description: `Reconnecting in ${delay/1000} seconds...`,
                        variant: 'destructive',
                    });

                    setTimeout(connect, delay);
                } else {
                    setError('Failed to connect after multiple attempts');
                    toast({
                        title: 'Connection Error',
                        description: 'Could not connect to status stream',
                        variant: 'destructive',
                    });
                }
            };

            return () => {
                eventSource.close();
            };
        }

        const cleanup = connect();

        return () => {
            isSubscribed = false;
            cleanup?.();
        };
    }, [requestId, toast]);

    const reconnect = () => {
        setError(null);
        setIsConnecting(true);
        // The useEffect will automatically reconnect
    };

    return {
        status,
        error,
        isConnecting,
        reconnect
    };
}
