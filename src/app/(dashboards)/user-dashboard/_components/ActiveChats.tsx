import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatRequestStatus } from "@/hooks/useChatRequestStatus";
import type { ChatSession } from "@/types/chat";
import { format } from "date-fns";
import { Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Doctor {
    id: string;
    name: string;
    avatar: string | null;
    speciality: string | null;
}

interface ChatSessionWithDoctor extends ChatSession {
    doctor: Doctor;
}

interface ActiveChatsProps {
    activeChats: ChatSessionWithDoctor[];
    pendingRequests: ChatSessionWithDoctor[];
}

function PendingRequest({ session }: { session: ChatSessionWithDoctor }) {
    const { status, isConnecting } = useChatRequestStatus(session.id);

    // Don't show if the request is no longer pending
    if (status !== 'pending') return null;

    return (
        <Card key={session.id} className="bg-muted/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={session.doctor.avatar || undefined} />
                            <AvatarFallback>
                                {session.doctor.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium">Dr. {session.doctor.name}</h4>
                            {session.doctor.speciality && (
                                <Badge variant="secondary" className="mt-1">
                                    {session.doctor.speciality}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isConnecting ? (
                            <Badge variant="outline" className="gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Waiting for response...
                            </Badge>
                        ) : (
                            <Badge>Pending</Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ActiveChat({ session }: { session: ChatSessionWithDoctor }) {
    const lastMessage = session.messages[0];

    return (
        <Card className="bg-muted/50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={session.doctor.avatar || undefined} />
                            <AvatarFallback>
                                {session.doctor.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-medium">Dr. {session.doctor.name}</h4>
                            {session.doctor.speciality && (
                                <Badge variant="secondary" className="mt-1">
                                    {session.doctor.speciality}
                                </Badge>
                            )}
                            {lastMessage && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                    Last message: {lastMessage.content}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Link href={`/chat/${session.id}`}>
                            <Button variant="secondary" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Continue Chat
                            </Button>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            Started: {format(new Date(session.startedAt!), 'PPp')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ActiveChats({ activeChats, pendingRequests }: ActiveChatsProps) {
    const hasPending = pendingRequests.length > 0;
    const hasActive = activeChats.length > 0;

    if (!hasPending && !hasActive) {
        return null;
    }

    return (
        <div className="space-y-6">
            {hasPending && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {pendingRequests.map((request) => (
                                    <PendingRequest key={request.id} session={request} />
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {hasActive && (
                <Card>
                    <CardHeader>
                        <CardTitle>Active Chats ({activeChats.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {activeChats.map((chat) => (
                                    <ActiveChat key={chat.id} session={chat} />
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
