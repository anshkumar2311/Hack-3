'use client'

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAvailableDoctors } from "@/hooks/useAvailableDoctors";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AvailableDoctors() {
    const { doctors, isLoading, error, requestChat, reconnect } = useAvailableDoctors();
    const [requestingIds, setRequestingIds] = useState(new Set<string>());
    const router = useRouter();

    const handleChatRequest = async (doctorId: string) => {
        if (requestingIds.has(doctorId)) return;

        setRequestingIds(new Set([...requestingIds, doctorId]));
        try {
            const session = await requestChat(doctorId);
            router.push(`/chat/${session.id}`);
        } finally {
            setRequestingIds(new Set([...requestingIds].filter(id => id !== doctorId)));
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {error}
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

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-6">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading available doctors...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (doctors.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Available Doctors</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        No doctors are available at the moment
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Available Doctors ({doctors.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                        {doctors.map((doctor) => (
                            <Card key={doctor.id} className="bg-muted/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={doctor.avatar || undefined} />
                                                <AvatarFallback>
                                                    {doctor.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">Dr. {doctor.name}</h4>
                                                {doctor.speciality && (
                                                    <Badge variant="secondary" className="mt-1">
                                                        {doctor.speciality}
                                                    </Badge>
                                                )}
                                                {doctor.bio && (
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                        {doctor.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleChatRequest(doctor.id)}
                                            disabled={requestingIds.has(doctor.id)}
                                            className="gap-2"
                                        >
                                            {requestingIds.has(doctor.id) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <MessageSquare className="h-4 w-4" />
                                            )}
                                            {requestingIds.has(doctor.id) ? 'Requesting...' : 'Start Chat'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
