import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatSessionWithUser } from "@/types/chat";
import { format } from "date-fns";
import Link from "next/link";

interface ChatSessionsListProps {
    sessions: ChatSessionWithUser[];
}

export default function ChatSessionsList({ sessions }: ChatSessionsListProps) {
    if (sessions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        No active chat sessions
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Sessions ({sessions.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <Card key={session.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-medium">
                                                {session.user.username || 'Anonymous User'}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {session.startedAt && (
                                                    <>Started: {format(new Date(session.startedAt), 'PPp')}</>
                                                )}
                                            </p>
                                        </div>
                                        <Link href={`/chat/${session.id}`}>
                                            <Button variant="secondary">
                                                Continue Chat
                                            </Button>
                                        </Link>
                                    </div>
                                    {session.messages[0] && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            Last message: {session.messages[0].content}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
