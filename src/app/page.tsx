// 'use client';
import { ArrowRight, Clock, MessageCircle, Shield } from "lucide-react";
import Link from "next/link";
import Features from '@/components/home/Features';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DialogHeader } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import Spline from '@splinetool/react-spline';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeartPulse } from 'lucide-react';
import { Orbitron } from 'next/font/google';
// import { useRouter } from 'next/navigation';
// import { useEffect, useRef, useState } from 'react';
import Main from "@/components/Main";
import About from "@/components/About";
import FloatingImage from "@/components/home/Story";
import { Footer } from "@/components/footer/footer";
import { Teamates } from "@/components/teamates";
import Loop from "@/components/loop";

export default function Home() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Safe & Secure",
      description:
        "Your health data is protected with enterprise-grade security",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "24/7 Available",
      description: "Get instant responses any time, day or night",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      title: "Smart Conversations",
      description: "Natural dialogue with advanced AI understanding",
    },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Static decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      {/* Navigation in a container */}
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Full-width content container */}
        <div className="flex justify-between items-center min-h-[calc(100vh)] mx-auto ml-20">
          {/* Left side - Text Content (pushed to left edge) */}
          <div className="w-[45%] pl-4 lg:pl-8">
            <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
              <span className="text-blue-400 text-sm font-semibold flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                AI-Powered Healthcare Support
              </span>
            </div>

            <h1 className="text-white font-bold text-7xl leading-tight mb-4">
              Feel Sick?{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Ask SUKOON
              </span>
            </h1>

            <h2 className="text-white/90 text-4xl font-medium mb-6">
              Your AI Health Buddy,{" "}
              <span className="text-blue-400">Always Ready.</span>
            </h2>

            <p className="text-gray-400 text-xl mb-8 max-w-xl">
              Get instant health guidance and support, 24/7. Your personal AI
              health companion is here to help you make informed decisions about
              your well-being.
            </p>

            <Link
              href={"/chat"}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg w-fit hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              Start Chatting Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Enhanced feature cards */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="mb-4 bg-blue-500/10 p-3 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Spline Component (pushed to right edge) */}
          <div className="w-[55%] h-screen relative flex items-center justify-end">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-2xl" />
            <div className="relative w-full h-[800px] scale-x-[-1] -mt-24 ">
              <Main />
            </div>
          </div>
        </div>
      </div>
      <div>
        <About />
      </div>
      <div>
        <Features />
      </div>
      <div>
        <Loop />
      </div>
      <div>
        <FloatingImage/>
      </div>
      <div>
        <Teamates />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
