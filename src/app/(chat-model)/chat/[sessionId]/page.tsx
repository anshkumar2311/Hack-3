"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HomeTest } from "../../_components/Avatar3D";
import { ChatInterface } from "../../_components/ChatInterface";

interface ChatSession {
  id: string;
  userId: string;
  doctorId: string;
  startedAt: Date;
  messageCount: number;
  user: {
    id: string;
    username: string;
  };
  doctor: {
    id: string;
    name: string;
  };
}

const ChatPage = () => {
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const sessionId = params.sessionId as string;

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat/${sessionId}?init=true`);
      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`);
      }
      const data = await response.json();
      setSession(data);
    } catch (error) {
      console.error("Error fetching session:", error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
      setTimeout(() => router.push("/"), 500);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast, router]);

  useEffect(() => {
    if (!sessionId || session) return;
    fetchSession();
  }, [sessionId, fetchSession, session]);

  if (isLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="p-8 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <p className="text-gray-300 text-lg">Loading chat session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="p-8 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 shadow-xl">
          <p className="text-gray-300 text-lg">Session not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6">
        {/* Avatar Section */}
        <div className="w-full lg:w-5/12 h-[400px] lg:h-full">
          <div className="h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <HomeTest />
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-7/12 h-[500px] lg:h-full">
          <div className="h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <ChatInterface
              sessionId={sessionId}
              senderId={user.id}
              senderRole={session.userId === user.id ? "USER" : "DOCTOR"}
              onAvatarSpeaking={setIsAvatarSpeaking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
