// hooks/useAvailableDoctors.ts
import type { Doctor } from '@/types/chat';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from './use-toast';

export function useAvailableDoctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const { toast } = useToast();

    const connect = useCallback(() => {
        if (eventSource) {
            eventSource.close();
        }

        const newEventSource = new EventSource('/api/doctor/available');

        newEventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setDoctors(data);
                setIsLoading(false);
                setError(null);
            } catch (err) {
                console.error('Error parsing doctors:', err);
                setError('Failed to process available doctors');
                setIsLoading(false);
            }
        };

        newEventSource.onerror = (event) => {
            console.error('EventSource error:', event);
            setError('Connection error. Attempting to reconnect...');
            setIsLoading(false);

            toast({
                title: 'Connection Error',
                description: 'Reconnecting to available doctors stream...',
                variant: 'destructive',
            });

            // Close the errored connection
            newEventSource.close();

            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                connect();
            }, 5000);
        };

        setEventSource(newEventSource);
    }, [toast]);

    useEffect(() => {
        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [connect]);

    const requestChat = async (doctorId: string): Promise<{ chatId: string }> => {
        try {
            const response = await fetch('/api/chat/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doctorId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to send chat request: ${response.statusText}`);
            }

            const data = await response.json();

            toast({
                title: 'Chat Request Sent',
                description: 'Waiting for doctor to accept your request...',
            });

            return data;
        } catch (error) {
            console.error('Error requesting chat:', error);
            toast({
                title: 'Error',
                description: 'Failed to send chat request. Please try again.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const reconnect = useCallback(() => {
        setError(null);
        setIsLoading(true);
        connect();
    }, [connect]);

    return {
        doctors,
        isLoading,
        error,
        requestChat,
        reconnect,
    };
}
