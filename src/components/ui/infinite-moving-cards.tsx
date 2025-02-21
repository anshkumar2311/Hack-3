/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string;
        name: string;
        title: string;
        photo: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLUListElement>(null);
    const [start, setStart] = useState(false);

    // Initialize animation
    useEffect(() => {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            // Duplicate items to create infinite scroll effect
            scrollerContent.forEach((item) => {
                scrollerRef.current?.appendChild(item.cloneNode(true));
            });

            // Apply direction and speed settings
            setScrollerStyle();
            setStart(true);
        }
    }, [direction, speed]);

    // Set scroll direction and speed
    const setScrollerStyle = () => {
        if (containerRef.current) {
            containerRef.current.style.setProperty(
                "--animation-direction",
                direction === "left" ? "forwards" : "reverse"
            );

            const speedMap = {
                fast: "20s",
                normal: "40s",
                slow: "80s",
            };

            containerRef.current.style.setProperty(
                "--animation-duration",
                speedMap[speed] || "40s"
            );
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        key={idx} // Use idx for uniqueness
                        className="w-[300px] max-w-full relative rounded-2xl border border-gray-800 px-6 py-5 md:w-[400px]  text-white hover:scale-105 transition-all duration-300 transform hover:shadow-lg"
                        style={{
                            boxShadow:
                                "0px 4px 8px rgba(255, 255, 255, 0.1), 0px 0px 15px rgba(255, 255, 255, 0.05)",
                        }}
                    >
                        <blockquote className="relative z-20">
                            <div className="relative z-20 mt-4 flex items-center gap-4">
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                />
                                <span className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-300">
                                        {item.name}
                                    </span>
                                    <span className="text-sm text-gray-400 font-light">
                                        {item.title}
                                    </span>
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-white font-bold">{item.quote}</p>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};
