"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const handleThemeToggle = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            className="relative h-10 w-10 top-2 left-2 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
            <div className="relative h-full w-full">
                {/* Sun icon */}
                <Sun
                    className={`absolute left-1/2 top-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-300 ease-in-out
                        ${theme === "dark"
                            ? "-rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                        }
                        `}
                />

                {/* Moon icon */}
                <Moon
                    className={`absolute left-1/2 top-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-300 ease-in-out
                        ${theme === "light"
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                        }
                        text-slate-900 dark:text-slate-100`}
                />

                {/* Background effect */}
                <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out
                        ${theme === "light"
                            ? "bg-gradient-to-br from-sky-100 to-sky-50 opacity-0"
                            : ""
                        }`}
                />
            </div>

            {/* Hover ring effect */}
            <div
                className={`absolute inset-0 rounded-full transition-all duration-300
                    ${theme === "light"
                        ? "ring-2 ring-sky-200 ring-opacity-0 hover:ring-opacity-100"
                        : "ring-2 ring-slate-700 ring-opacity-0 hover:ring-opacity-100"
                    }`}
            />

            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export default ModeToggle
