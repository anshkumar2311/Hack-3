import type { ChatRequest } from '@/types/chat';
import { useState } from 'react';
import { useToast } from './use-toast';

type RequestStatus = 'accepted' | 'rejected';

export function useChatRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const updateRequestStatus = async (requestId: string, status: RequestStatus): Promise<ChatRequest> => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/chat/request/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update request: ${response.statusText}`);
            }

            const data = await response.json();

            toast({
                title: `Chat Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
                description: status === 'accepted'
                    ? 'You can now start chatting with the patient'
                    : 'The chat request has been rejected',
            });

            return data;
        } catch (error) {
            console.error('Error updating chat request:', error);
            toast({
                title: 'Error',
                description: 'Failed to update chat request status',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getRequestStatus = (request: ChatRequest): RequestStatus | 'pending' => {
        if (request.startedAt) return 'accepted';
        if (request.endedAt) return 'rejected';
        return 'pending';
    };

    return {
        updateRequestStatus,
        getRequestStatus,
        isLoading,
    };
}

export type { ChatRequest, RequestStatus };
