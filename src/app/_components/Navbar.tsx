'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import GradientButton from "./GradientButton";

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className }: NavbarProps) {
    // interface User {
    //     id: string;
    //     name: string;
    //     age: string;
    //     gender: "male" | "female";
    //     username: string;
    //     type: "doctor" | "user";
    // }
    return (
        <nav className={`flex justify-between p-4 gap-4 ${className} w-full h-[10vh] px-10`}>
            <div className="h-full"><img src="/loo.png" alt="" className="h-full" /></div>
            <div className="flex gap-4">
                <GradientButton className="rounded-xl border-gray-500 border" link="/">Home</GradientButton>
                {/* <GradientButton className="rounded-xl border-gray-500 border" link='/doc-dashboard'>Zen Space</GradientButton> */}
                <GradientButton className="rounded-xl border-gray-500 border" link='/Sukku'>Sukku</GradientButton>
                <GradientButton className="rounded-xl border-gray-500 border" link="/Bhagvat">AI Bhagvat</GradientButton>
                <GradientButton className="rounded-xl border-gray-500 border" link="/social">Community</GradientButton>
                {/* <GradientButton className="rounded-xl border-gray-500 border" link='/doctors'>Sessions</GradientButton> */}
                <GradientButton className="rounded-xl border-gray-500 border" link='/Wound'>Heal AI</GradientButton>
                <GradientButton className="rounded-xl border-gray-500 border" link="/Guide-Eval">Guidance</GradientButton>
                <GradientButton className="rounded-xl border-gray-500 border" link="/explore">Explore</GradientButton>
            </div>
            <div>
                <SignedOut >
                    <div className='px-3 py-2 w-fit h-fit bg-white text-black rounded-lg'>
                        <SignInButton />
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserButton
                        userProfileProps={{
                            additionalOAuthScopes: {
                                google: [
                                    "https://www.googleapis.com/auth/fitness.activity.read",
                                    "https://www.googleapis.com/auth/fitness.blood_glucose.read",
                                    "https://www.googleapis.com/auth/fitness.blood_pressure.read",
                                    "https://www.googleapis.com/auth/fitness.body.read",
                                    "https://www.googleapis.com/auth/fitness.heart_rate.read",
                                    "https://www.googleapis.com/auth/fitness.body_temperature.read",
                                    "https://www.googleapis.com/auth/fitness.location.read",
                                    "https://www.googleapis.com/auth/fitness.nutrition.read",
                                    "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
                                    "https://www.googleapis.com/auth/fitness.sleep.read"
                                ],
                            },
                        }}
                    />
                </SignedIn>
            </div>
        </nav>
    )
}
