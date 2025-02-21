'use client'

import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AvailabilityToggleProps {
    doctorId: string;
    initialAvailability: boolean;
}

export default function AvailabilityToggle({
    doctorId,
    initialAvailability,
}: AvailabilityToggleProps) {
    const [isAvailable, setIsAvailable] = useState(initialAvailability);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const toggleAvailability = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch('/api/doctor/availability', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId,
                    isAvailable: !isAvailable,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update availability');
            }

            setIsAvailable(!isAvailable);
            toast({
                title: 'Status Updated',
                description: !isAvailable
                    ? 'You are now available for chat sessions'
                    : 'You are now unavailable for chat sessions',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to update availability status',
                variant: 'destructive',
            });
            // Revert the state if the request failed
            setIsAvailable(isAvailable);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isAvailable}
                onCheckedChange={toggleAvailability}
                disabled={isUpdating}
                aria-label="Toggle availability"
            />
            <div className="flex items-center gap-2">
                <span
                    className={
                        isAvailable ? "text-green-500" : "text-gray-500"
                    }
                >
                    {isUpdating
                        ? "Updating..."
                        : isAvailable
                            ? "Available"
                            : "Unavailable"}
                </span>
                {isUpdating && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>
        </div>
    );
}
