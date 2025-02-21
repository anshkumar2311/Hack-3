'use client';

import { createUser } from '@/actions/user-data';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export function UserRegistrationForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        age: "",
        gender: "",
        lifestyle: {
            smoking: false,
            alcohol: false,
            exerciseLevel: "",
            sleepHours: "",
            dietType: "",
            stressLevel: "",
            otherHabit: [] as string[],
        },
        medicalHistory: {
            condition: "",
            diagnosedAt: new Date(),
            treatment: [] as string[],
            notes: "",
        },
    });

    const totalSteps = 3;

    const handleInputChange = (field: string, value: any) => {
        const [category, subfield] = field.split('.');
        if (subfield) {
            setFormData((prev) => ({
                ...prev,
                [category]: {
                    // @ts-except-ignore
                    ...prev[category as keyof typeof prev],
                    [subfield]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createUser({
                // @ts-except-ignore
                userdata: {
                    ...formData,
                    age: parseInt(formData.age, 10),
                    isAnonymous: false,
                }
            });
            router.push("/user-dashboard");
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create user:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="smoking"
                                checked={formData.lifestyle.smoking}
                                onCheckedChange={(checked) =>
                                    handleInputChange("lifestyle.smoking", checked)}
                            />
                            <Label htmlFor="smoking">Smoking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="alcohol"
                                checked={formData.lifestyle.alcohol}
                                onCheckedChange={(checked) =>
                                    handleInputChange("lifestyle.alcohol", checked)}
                            />
                            <Label htmlFor="alcohol">Alcohol</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exerciseLevel">Exercise Level</Label>
                            <Select
                                value={formData.lifestyle.exerciseLevel}
                                onValueChange={(value) => handleInputChange("lifestyle.exerciseLevel", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select exercise level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="very_active">Very Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sleepHours">Sleep Hours</Label>
                            <Input
                                id="sleepHours"
                                type="number"
                                placeholder="Hours of sleep per night"
                                value={formData.lifestyle.sleepHours}
                                onChange={(e) => handleInputChange("lifestyle.sleepHours", parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dietType">Diet Type</Label>
                            <Select
                                value={formData.lifestyle.dietType}
                                onValueChange={(value) => handleInputChange("lifestyle.dietType", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select diet type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="omnivore">Omnivore</SelectItem>
                                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                    <SelectItem value="vegan">Vegan</SelectItem>
                                    <SelectItem value="keto">Keto</SelectItem>
                                    <SelectItem value="paleo">Paleo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stressLevel">Stress Level</Label>
                            <Select
                                value={formData.lifestyle.stressLevel}
                                onValueChange={(value) => handleInputChange("lifestyle.stressLevel", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stress level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="condition">Medical Condition</Label>
                            <Input
                                id="condition"
                                placeholder="Enter medical condition"
                                value={formData.medicalHistory.condition}
                                onChange={(e) => handleInputChange("medicalHistory.condition", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diagnosedAt">Diagnosis Date</Label>
                            <Input
                                id="diagnosedAt"
                                type="date"
                                value={formData.medicalHistory.diagnosedAt.toISOString().split('T')[0]}
                                onChange={(e) => handleInputChange("medicalHistory.diagnosedAt", new Date(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="treatment">Treatments</Label>
                            <Input
                                id="treatment"
                                placeholder="Enter treatments (comma-separated)"
                                value={formData.medicalHistory.treatment.join(', ')}
                                onChange={(e) => handleInputChange("medicalHistory.treatment", e.target.value.split(',').map(t => t.trim()))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional medical notes"
                                className="min-h-[120px]"
                                value={formData.medicalHistory.notes || ''}
                                onChange={(e) => handleInputChange("medicalHistory.notes", e.target.value)}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded">
                        <div
                            className="h-full bg-primary rounded transition-all duration-300"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="mt-6">{renderStep()}</div>

                <div className="flex justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                        disabled={step === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => {
                            if (step < totalSteps) {
                                setStep((prev) => prev + 1);
                            } else {
                                handleSubmit();
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : step === totalSteps ? "Submit" : "Next"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
