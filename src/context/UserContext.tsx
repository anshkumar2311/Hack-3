'use client';
import { createContext, useState, Dispatch, SetStateAction, ReactNode, useContext } from "react";

// Define full User type
interface User {
  id: string;
  name: string;
  age: string;
  gender: "male" | "female";
  username: string;
  type: "doctor" | "user";
}

// Define context type with correct setUser type
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Create the context with a default value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for safe usage
export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export default UserContext;