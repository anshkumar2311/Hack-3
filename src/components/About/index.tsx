'use client'
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    useGSAP(() => {
        const clipAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: "#clip",
                start: "center center",
                end: "+=800 center",
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
            },
        });

        clipAnimation.to(".mask-clip-path", {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
        });
    });

    return (
        <div id="about" className="min-h-screen w-screen">
            <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
                <p className="font-general text-sm uppercase md:text-[10px]">
                    Welcome to Sukoon – The AI Chat Boy
                </p>

                <AnimatedTitle
                    title="<b>Embark</b> on a <b>Journey</b> Through <b>Time</b> – The <b>Ultimate</b> Time Travel <b>Adventure!</b>"
                    containerClass="mt-5 !text-black text-center"
                />

                <div className="about-subtext">
                    <p>Welcome to a journey of health and wellness, where every step brings you closer to a better you.</p>
                    <p className="text-gray-500">Explore the realms of physical fitness, mental well-being, and nutritional excellence, all designed to help you achieve your healthiest self.</p>
                </div>
            </div>

            <div className="h-dvh w-screen" id="clip">
                <div className="mask-clip-path about-image">
                    {/* <img
                        src="img/about.webp"
                        alt="Background"
                        className="absolute left-0 top-0 size-full object-cover"
                    /> */}
                    <video
                        src="videos/video.mp4"
                        autoPlay
                        loop
                        muted
                        className="absolute left-0 top-0 size-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
