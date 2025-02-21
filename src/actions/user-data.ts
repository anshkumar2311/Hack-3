'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

type DoctorRegistrationData = {
    name: string;
    speciality?: string;
    bio?: string;
    isAvailable: boolean;
    avatar?: string;
}

type UserRegistrationData = {
    username: string;
    age: number;
    gender: string;
    lifestyle: {
        smoking: boolean;
        alcohol: boolean;
        exerciseLevel: string;
        sleepHours: number;
        dietType: string;
        stressLevel: string;
        otherHabit: string[];
    };
    medicalHistory: {
        condition: string;
        diagnosedAt: Date;
        treatment: string[];
        notes?: string;
    };
    isAnonymous: boolean;
}

export const createUser = async ({ userdata }: { userdata: UserRegistrationData }) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const user = await db.$transaction(async (tx) => {
            // Create the main user record with relations
            const newUser = await tx.user.create({
                data: {
                    clerkId: userId,
                    username: userdata.username,
                    age: userdata.age,
                    gender: userdata.gender,
                    isAnonymous: userdata.isAnonymous,
                    // Create lifestyle info
                    lifestyle: {
                        create: {
                            smoking: userdata.lifestyle.smoking,
                            alcohol: userdata.lifestyle.alcohol,
                            exerciseLevel: userdata.lifestyle.exerciseLevel,
                            sleepHours: userdata.lifestyle.sleepHours,
                            dietType: userdata.lifestyle.dietType,
                            stressLevel: userdata.lifestyle.stressLevel,
                            otherHabit: userdata.lifestyle.otherHabit,
                        }
                    },
                    // Create medical history
                    medicalHistory: {
                        create: {
                            condition: userdata.medicalHistory.condition,
                            diagnosedAt: userdata.medicalHistory.diagnosedAt,
                            treatment: userdata.medicalHistory.treatment,
                            notes: userdata.medicalHistory.notes,
                        }
                    }
                },
                include: {
                    lifestyle: true,
                    medicalHistory: true,
                }
            });
            return newUser;
        });

        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

export const createDoc = async ({ docdata }: { docdata: DoctorRegistrationData }) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const doctor = await db.doctor.create({
            data: {
                clerkId: userId,
                name: docdata.name,
                speciality: docdata.speciality,
                bio: docdata.bio,
                isAvailable: docdata.isAvailable,
                avatar: docdata.avatar,
            }
        });

        return doctor;
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw new Error('Failed to create doctor');
    }
}



export async function checkUserInDB(clerkId: string) {
    try {
        const user = await db.user.findUnique({
            where: { clerkId }
        });

        return !!user;  // Returns true if user exists, false otherwise
    } catch (error) {
        console.error("DB Error:", error);
        return false;
    }
}
export async function checkDocInDB(clerkId: string) {
    try {


        const user2 = await db.doctor.findUnique({
            where: { clerkId }
        });

        return !!user2;  // Returns true if user exists, false otherwise
    } catch (error) {
        console.error("DB Error:", error);
        return false;
    }
}
