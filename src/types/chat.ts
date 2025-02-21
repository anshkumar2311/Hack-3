export interface ChatUser {
    id: string;
    username: string | null;
    avatar: string | null;
}

export interface Doctor {
    id: string;
    name: string;
    clerkId: string;
    isAvailable: boolean;
    speciality: string | null;
    avatar: string | null;
    bio: string | null;
}

export interface ChatMessage {
    id: string;
    content: string;
    senderId: string;
    senderRole: 'USER' | 'DOCTOR';
    timestamp: Date;
    chatSessionId: string;
}

export interface ChatSession {
    id: string;
    startedAt: Date | null;
    endedAt: Date | null;
    userId: string;
    doctorId: string;
    messageCount: number;
}

export interface ChatSessionWithUser extends ChatSession {
    user: ChatUser;
    messages: ChatMessage[];
}

export interface ChatSessionWithDoctor extends ChatSession {
    doctor: {
        id: string;
        name: string;
        avatar: string | null;
        speciality: string | null;
    };
    messages: ChatMessage[];
}

export interface ChatRequest extends ChatSession {
    createdAt: Date;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface DoctorWithAvailability extends Doctor {
    isAvailable: boolean;
    activeSessionsCount: number;
}
