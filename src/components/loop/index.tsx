"use client";

import React, { useState } from 'react';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { motion } from "framer-motion";

const Loop = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const items = [
        {
            quote: "The mental health AI provides personalized support, making self-care easier than ever.",
            name: "Abhijeet Kumar",
            title: "Mental Health AI",
            photo: "/loop/abhi.jpeg",
        },
        {
            quote: "Kalidokit’s real-time facial tracking has enhanced the chatbot’s ability to understand emotions.",
            name: "Rohit",
            title: "Health Chatbot",
            photo: "/loop/rohit.jpeg",
        },
        {
            quote: "The wound analyzer helps assess injuries quickly and provides accurate healing guidance.",
            name: "Manisha Chaudhary",
            title: "Wound Analyzer",
            photo: "/loop/manisha.jpeg",
        },
        {
            quote: "The AI-driven guidance system ensures I get tailored health recommendations anytime.",
            name: "Somesh Biswal",
            title: "Health Guidance",
            photo: "/loop/sanu.jpeg",
        },
    ];

    const items2 = [
        {
            quote: "I now have access to real-time emotional analysis, making mental well-being a priority.",
            name: "Nisita Subramani",
            title: "Mental Health AI",
            photo: "/loop/nishita.jpeg",
        },
        {
            quote: "The chatbot’s AI-driven Kalidokit integration makes interactions feel more human and natural.",
            name: "Punit Kumar",
            title: "Health Chatbot",
            photo: "/loop/punit.jpeg",
        },
        {
            quote: "AI-powered wound detection ensures faster diagnosis and better treatment suggestions.",
            name: "Himant Yadav",
            title: "Wound Analyzer",
            photo: "/loop/himant.jpeg",
        },
        {
            quote: "The AI health assistant gives me personalized guidance based on real-time health data.",
            name: "Kushagra Chaudhary",
            title: "Health Guidance",
            photo: "/loop/kushagra.jpeg",
        },
        {
            quote: "Mental health tracking has never been this easy. The AI truly understands and supports me.",
            name: "Nainsi Sharma",
            title: "Mental Health AI",
            photo: "/loop/nainsi.jpeg",
        },
    ];

    const items3 = [
        {
            quote: "The AI assistant helps me track my emotions and provides calming exercises.",
            name: "Subham Kumar",
            title: "Mental Health AI",
            photo: "/loop/subham.jpeg",
        },
        {
            quote: "The chatbot’s Kalidokit-powered facial tracking helps create meaningful interactions.",
            name: "Himant Yadav",
            title: "Health Chatbot",
            photo: "/loop/himant.jpeg",
        },
        {
            quote: "The AI wound analyzer detects injuries with precision and suggests immediate care solutions.",
            name: "Sriti Sareen",
            title: "Wound Analyzer",
            photo: "/loop/sriti.jpeg",
        },
        {
            quote: "With AI-driven guidance, I receive step-by-step health recommendations tailored to my needs.",
            name: "Radha Raman",
            title: "Health Guidance",
            photo: "/loop/radha.jpeg",
        },
    ];


    const letterContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
            }
        }
    };

    const letterAnimation = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10
            }
        }
    };

    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden ">
            {/* Animated Header */}
            <motion.div
                className="relative z-10 text-center mb-16 w-full max-w-4xl px-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    variants={letterContainer}
                    initial="hidden"
                    animate="show"
                    className="mb-6"
                >
                    <h2 className="text-6xl font-bold mb-2">
                        {"Voice of Our Users".split("").map((letter, index) => (
                            <motion.span
                                key={index}
                                variants={letterAnimation}
                                whileHover={{
                                    y: -8,
                                    scale: 1.1,
                                    color: index % 2 ? '#ec4899' : '#a855f7',
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 10
                                    }
                                }}
                                className="inline-block transition-all duration-200 text-white cursor-pointer"
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </h2>
                    <motion.div
                        className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-4"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    />
                </motion.div>

                <motion.p
                    className="text-xl text-zinc-400 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Discover what our community has achieved with our platform
                </motion.p>
            </motion.div>

            {/* First Card Set */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <InfiniteMovingCards
                    items={items}
                    direction="left"
                    speed="normal"
                    pauseOnHover={true}
                    className="mt-4"
                />
            </motion.div>

            {/* Second Card Set */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <InfiniteMovingCards
                    items={items2}
                    direction="right"
                    speed="normal"
                    pauseOnHover={true}
                    className="mt-10"
                />
            </motion.div>

            {/* Third Card Set */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <InfiniteMovingCards
                    items={items3}
                    direction="left"
                    speed="normal"
                    pauseOnHover={true}
                    className="mt-10"
                />
            </motion.div>

            {/* Bottom Decorative Line */}
            <motion.div
                className="w-24 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mt-16"
                initial={{ width: 0 }}
                animate={{ width: '6rem' }}
                transition={{ delay: 1.2, duration: 0.8 }}
            />
        </main>
    );
};

export default Loop;
