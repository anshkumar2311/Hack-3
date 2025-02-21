import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AvailabilityToggle from "./_components/AvailabilityToggle";
import ChatRequests from "./_components/ChatRequests";
import ChatSessionsList from "./_components/ChatSessionsList";

async function getDoctor(clerkId: string) {
    return await db.doctor.findUnique({
        where: { clerkId },
        include: {
            chatSessions: {
                where: {
                    startedAt: { not: null },
                    endedAt: null
                },
                include: {
                    user: true,
                    messages: {
                        orderBy: { timestamp: 'desc' },
                        take: 1
                    }
                },
                orderBy: { startedAt: 'desc' }
            }
        }
    });
}

export default async function DocDashboard() {
    const session = await auth();
    if (!session?.userId) redirect('/sign-in');

    const doctor = await getDoctor(session.userId);
    if (!doctor) redirect('/user-doc-data');

    return (
        <div className="container mx-auto py-8">
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Doctor Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Availability Status</h3>
                            <p className="text-sm text-gray-500">
                                Toggle to show if you are available for new chat sessions
                            </p>
                        </div>
                        <AvailabilityToggle
                            doctorId={doctor.id}
                            initialAvailability={doctor.isAvailable}
                        />
                    </CardContent>
                </Card>

                {/* Chat Requests - Now uses SSE for real-time updates */}
                <ChatRequests />

                {/* Active Chat Sessions */}
                <ChatSessionsList sessions={doctor.chatSessions} />
            </div>
        </div>
    );
}
