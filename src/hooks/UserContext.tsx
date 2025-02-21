'use client'
import React, { createContext, ReactNode, useContext, useState } from 'react';


export type UserRole = 'user' | 'doc';

export interface UserContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
}

// UserContext.tsx

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [role, setRole] = useState<UserRole>('user');

    return (
        <UserContext.Provider value={{ role, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};
