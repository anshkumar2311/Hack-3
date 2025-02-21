'use client'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatRequest } from "@/hooks/useChatRequest";
import { useChatRequestStatus } from "@/hooks/useChatRequestStatus";
import { useChatRequestStream } from "@/hooks/useChatRequestStream";
import type { ChatSessionWithUser } from "@/types/chat";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RequestItemProps {
    request: ChatSessionWithUser;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

function RequestItem({ request, onAccept, onReject }: RequestItemProps) {
    const { status, isConnecting } = useChatRequestStatus(request.id);

    // Don't show if the request is no longer pending
    if (status !== 'pending') return null;

    return (
        <Card className="bg-muted/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">
                            {request.user.username || 'Anonymous User'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Requested at: {new Date(request.startedAt || '').toLocaleString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => onReject(request.id)}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Reject'
                            )}
                        </Button>
                        <Button
                            onClick={() => onAccept(request.id)}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Accept'
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ChatRequests() {
    const { requests, error: streamError, reconnect } = useChatRequestStream();
    const { updateRequestStatus } = useChatRequest();
    const router = useRouter();
    const [processingIds] = useState(new Set<string>());

    const handleAccept = async (requestId: string) => {
        if (processingIds.has(requestId)) return;

        processingIds.add(requestId);
        try {
            await updateRequestStatus(requestId, 'accepted');
            router.push(`/chat/${requestId}`);
        } finally {
            processingIds.delete(requestId);
        }
    };

    const handleReject = async (requestId: string) => {
        if (processingIds.has(requestId)) return;

        processingIds.add(requestId);
        try {
            await updateRequestStatus(requestId, 'rejected');
        } finally {
            processingIds.delete(requestId);
        }
    };

    // Show connection error if any
    if (streamError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {streamError}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={reconnect}
                        className="ml-2"
                    >
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    // Filter out requests that are already handled
    const pendingRequests = requests.filter(
        req => !req.startedAt && !req.endedAt
    );

    // Show empty state if no requests
    if (pendingRequests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Chat Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        No pending chat requests
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Chat Requests ({pendingRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingRequests.map((request) => (
                        <RequestItem
                            key={request.id}
                            request={request}
                            onAccept={handleAccept}
                            onReject={handleReject}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
