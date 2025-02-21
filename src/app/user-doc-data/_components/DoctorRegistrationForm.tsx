'use client';

import { createDoc } from '@/actions/user-data';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useState } from "react";


export function DoctorRegistrationForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        speciality: "",
        bio: "",
        isAvailable: false,
        avatar: "",
    });

    // Handle text input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle file upload for avatar
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file.name }));
        }
    };

    // Handle availability toggle
    const handleAvailabilityChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isAvailable: checked }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createDoc({
                docdata: formData
            });
            router.push("/doc-dashboard")
            onOpenChange(false);  // Close dialog after successful submission
        } catch (error) {
            console.error('Failed to create doctor profile:', error);
            // Here you might want to show an error message to the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Doctor Registration</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="speciality">Speciality</Label>
                        <Input
                            id="speciality"
                            placeholder="Enter your medical speciality"
                            value={formData.speciality}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about your experience and expertise"
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-sm text-gray-500">Upload a professional photo of yourself</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onCheckedChange={handleAvailabilityChange}
                        />
                        <Label htmlFor="isAvailable">Available for Consultations</Label>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !formData.name}
                    >
                        {loading ? "Creating Profile..." : "Submit Registration"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
