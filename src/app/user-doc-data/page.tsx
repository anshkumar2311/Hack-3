'use client';

import { checkDocInDB, checkUserInDB } from '@/actions/user-data'; // Import the server action
import { useUser as newUser } from "@/hooks/UserContext";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { DoctorRegistrationForm } from "./_components/DoctorRegistrationForm";
import { RoleSelectionDialog } from "./_components/RoleSelectionDialog";
import { UserRegistrationForm } from "./_components/UserRegistrationForm";

const UserData = () => {
    const { role, setRole } = newUser();

    const [loading, setLoading] = useState(true);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        const verifyUser = async () => {
            if (!user) return;

            try {
                const userExists = await checkUserInDB(user.id);
                const docExist = await checkDocInDB(user.id);
                if (userExists) {
                    setRole("user")
                    router.push('/user-dashboard');  // Redirect to the desired page
                }
                else if (docExist) {
                    setRole("doc")
                    router.push('/doc-dashboard');  // Redirect to the desired page
                }
                else {
                    setLoading(false);  // Show registration forms if user doesn't exist
                }
            } catch (error) {
                console.error("Error checking user:", error);
                setLoading(false);
            }
        };

        verifyUser();
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <RoleSelectionDialog />
            <UserRegistrationForm open={showUserForm} onOpenChange={setShowUserForm} />
            <DoctorRegistrationForm open={showDoctorForm} onOpenChange={setShowDoctorForm} />
        </div>
    );
};

export default UserData;
