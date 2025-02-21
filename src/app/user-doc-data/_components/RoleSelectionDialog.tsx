import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Stethoscope, UserCircle } from "lucide-react";
import { useState } from "react";
import { DoctorRegistrationForm } from "./DoctorRegistrationForm";
import { UserRegistrationForm } from "./UserRegistrationForm";

const roles = [
    {
        id: "user",
        title: "Patient",
        icon: UserCircle,
        description: "I'm looking for medical assistance",
    },
    {
        id: "doctor",
        title: "Doctor",
        icon: Stethoscope,
        description: "I'm a healthcare professional",
    },
];

export function RoleSelectionDialog() {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showDoctorForm, setShowDoctorForm] = useState(false);

    const handleContinue = () => {
        if (selectedRole === "user") {
            setShowUserForm(true);
            setOpen(false);
        } else if (selectedRole === "doctor") {
            setShowDoctorForm(true);
            setOpen(false);
        }
        console.log(`Selected role: ${selectedRole}`);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Button
                onClick={() => setOpen(true)}
                className="px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
            >
                Get Started
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden  backdrop-blur-sm">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-semibold text-center">Welcome</DialogTitle>
                        <DialogDescription className="text-center text-base">
                            Please select your role to continue
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {roles.map((role) => (
                                <Card
                                    key={role.id}
                                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${selectedRole === role.id
                                        ? "ring-2 ring-primary shadow-lg"
                                        : "hover:shadow-md"
                                        }`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <role.icon className="w-12 h-12" />
                                        <div>
                                            <h3 className="font-medium text-lg">{role.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleContinue}
                                disabled={!selectedRole}
                                className="w-full sm:w-auto gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <UserRegistrationForm open={showUserForm} onOpenChange={setShowUserForm} />
            <DoctorRegistrationForm open={showDoctorForm} onOpenChange={setShowDoctorForm} />
        </div>
    );
}
