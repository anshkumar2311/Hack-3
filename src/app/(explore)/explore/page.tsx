'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  MessageCircle,
  MessageSquare,
  PenLine,
  Phone,
  Smile,
  Video
} from "lucide-react";
import Link from "next/link";
import React, { useState } from 'react';

// Constants
const PHONE_NUMBER = "+1234567890"; // Replace with your actual phone number
const WHATSAPP_NUMBER = "1234567890"; // Replace with your actual WhatsApp number

export const projects = [
  {
    title: "Daily Tasks",
    description: "Manage anxiety symptoms and improve mental health by completing daily wellness tasks.",
    link: "/planner",
    type: "link",
    icon: CheckSquare
  },
  {
    title: "Psych Education",
    description: "Understand your mind and learn about key concepts in cognitive behavioral therapy.",
    link: "/psych",
    type: "link",
    icon: BookOpen
  },
  {
    title: "Journal Your Thoughts",
    description: "Write down your thoughts and feelings to improve mental health and self-awareness.",
    link: "/journal",
    type: "link",
    icon: PenLine
  },
  {
    title: "Chat",
    description: "Connect with a mental health professional for a private chat session.",
    link: "/chat",
    type: "link",
    icon: MessageSquare
  },
  {
    title: "Talk Now",
    description: "Schedule a phone call with a mental health professional AI for immediate support.",
    link: `tel:${PHONE_NUMBER}`,
    type: "phone",
    icon: Phone
  },
  {
    title: "Chat on WhatsApp",
    description: "Connect with a mental health professional AI for a private chat session.",
    link: `https://wa.me/${WHATSAPP_NUMBER}`,
    type: "whatsapp",
    icon: MessageCircle
  },
  {
    title: "Get Video Status",
    description: "AI helps you to get video status for your mental health.",
    link: "/video-analysis",
    type: "link",
    icon: Video
  },
  {
    title: "Boost Your Mood",
    description: "AI helps you to boost your mood.",
    link: "/mood-boost",
    type: "link",
    icon: Smile
  }
];

export default function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    type?: string;
    icon: any;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderCard = (item: typeof items[0], idx: number) => {
    if (item.type === 'phone') {
      return (
        <Dialog>
          <DialogTrigger className="w-full">
            <div
              className="relative group block p-2 h-full w-full transform-gpu transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardContent item={item} hoveredIndex={hoveredIndex} idx={idx} />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Call for Immediate Support</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <p className="mb-4">Our mental health professionals are available 24/7.</p>
              <Button asChild className="w-full">
                <a href={`tel:${PHONE_NUMBER}`} className="flex items-center justify-center gap-2">
                  <Phone size={20} />
                  {PHONE_NUMBER}
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    const LinkWrapper = item.type === 'whatsapp' ? 'a' : Link;
    return (
      <LinkWrapper
        href={item.link}
        target={item.type === 'whatsapp' ? '_blank' : undefined}
        rel={item.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
        className="relative group block p-2 h-full w-full transform-gpu transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1"
        onMouseEnter={() => setHoveredIndex(idx)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <CardContent item={item} hoveredIndex={hoveredIndex} idx={idx} />
      </LinkWrapper>
    );
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4", className)}>
      {items.map((item, idx) => (
        <div key={item.title} className="p-2 perspective-1000">
          {renderCard(item, idx)}
        </div>
      ))}
    </div>
  );
};

const CardContent = ({ item, hoveredIndex, idx }: { item: any; hoveredIndex: number | null; idx: number }) => {
  const IconComponent = item.icon;
  return (
    <>
      <AnimatePresence>
        {hoveredIndex === idx && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-slate-800 dark:to-slate-900 block rounded-3xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <Card>
        <div className="flex items-center gap-3">
          <div className="p-2 w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition-colors duration-300">
            <IconComponent className="w-6 h-6 text-zinc-100" />
          </div>
          <CardTitle>{item.title}</CardTitle>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </Card>
    </>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-gray-300/20 relative z-20",
        "before:absolute before:content-[''] before:top-0 before:right-0 before:w-24 before:h-24 before:bg-gradient-to-bl before:from-gray-800 before:to-transparent before:transform before:-translate-y-6 before:translate-x-6 before:rotate-45 before:transition-all before:duration-300",
        "after:absolute after:content-[''] after:top-0 after:right-0 after:w-24 after:h-24 after:bg-gradient-to-bl after:from-gray-700/50 after:to-transparent after:transform after:-translate-y-6 after:translate-x-6 after:rotate-45 after:opacity-0 after:transition-all after:duration-300",
        "group-hover:border-gray-400/30",
        "group-hover:before:bg-gradient-to-bl group-hover:before:from-gray-700 group-hover:before:to-transparent",
        "group-hover:after:opacity-100",
        "group-hover:bg-gradient-to-br group-hover:from-gray-900 group-hover:via-gray-800 group-hover:to-black",
        "transform-gpu transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1 group-hover:rotate-1",
        "hover:shadow-xl hover:shadow-black/30",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide group-hover:text-white transition-colors duration-300", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm group-hover:text-zinc-300 transition-colors duration-300",
        className
      )}
    >
      {children}
    </p>
  );
};
