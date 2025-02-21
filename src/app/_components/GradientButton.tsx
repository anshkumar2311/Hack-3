"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface NavGradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    link?: string;
    icon?: React.ReactNode;
}

const NavGradientButton: React.FC<NavGradientButtonProps> = ({
    children,
    className,
    link,
    icon,
    ...props
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = link && pathname === link;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (link) {
            e.preventDefault();
            router.push(link);
        }
        props.onClick?.(e);
    };

    return (
        <button
            className={cn(
                // Base styles
                "relative group px-4 py-2 rounded-lg font-medium transition-all duration-200",
                "hover:scale-105 active:scale-100",

                // Default state
                "bg-gradient-to-bl from-gray-900 via-black to-gray-900",
                "text-gray-300 hover:text-white",

                // Active state
                isActive && "from-black to-black text-white shadow-lg",

                // Backdrop blur and border
                "backdrop-blur-sm border border-white/10",
                "hover:border-white/20",

                // Focus states
                "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-0",

                // Group hover effect for gradient
                "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-white/5 before:to-transparent",
                "before:opacity-0 hover:before:opacity-100 before:transition-opacity",

                // Custom classes
                className
            )}
            onClick={handleClick}
            {...props}
        >
            <div className="relative flex items-center gap-2">
                {icon && <span className="text-gray-400 group-hover:text-white transition-colors">{icon}</span>}
                <span className="relative">
                    {children}
                    {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-white/60 to-transparent" />
                    )}
                </span>
            </div>
        </button>
    );
};

export default NavGradientButton;
