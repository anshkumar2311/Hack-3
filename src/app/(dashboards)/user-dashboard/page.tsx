import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ActiveChats from "./_components/ActiveChats";
import AvailableDoctors from "./_components/AvailableDoctors";

async function getUserChats(userId: string) {
    return await db.chatSession.findMany({
        where: {
            userId,
            startedAt: { not: null },
            endedAt: null
        },
        include: {
            doctor: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    speciality: true
                }
            },
            messages: {
                orderBy: { timestamp: 'desc' },
                take: 1
            }
        },
        orderBy: { startedAt: 'desc' }
    });
}

async function getPendingRequests(userId: string) {
    return await db.chatSession.findMany({
        where: {
            userId,
            startedAt: null,
            endedAt: null
        },
        include: {
            doctor: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    speciality: true
                }
            }
        },
        orderBy: { startedAt: 'desc' }
    });
}

export default async function UserDashboard() {
    const session = await auth();
    if (!session?.userId) redirect('/sign-in');

    const [activeChats, pendingRequests] = await Promise.all([
        getUserChats(session.userId),
        getPendingRequests(session.userId)
    ]);

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Chat with available doctors for a consultation. Your active and pending
                            chats will appear here.
                        </p>
                    </CardContent>
                </Card>

                {/* Active and Pending Chats */}
                <ActiveChats
                    activeChats={activeChats}
                    pendingRequests={pendingRequests}
                />

                {/* Available Doctors */}
                <AvailableDoctors />
            </div>
        </div>
    );
}
