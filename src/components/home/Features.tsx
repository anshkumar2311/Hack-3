'use client'
import { MoveLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export const BentoTilt = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {

    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event) => {
        if (!itemRef.current) return;

        const { left, top, width, height } =
            itemRef.current.getBoundingClientRect();

        const relativeX = (event.clientX - left) / width;
        const relativeY = (event.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
        setTransformStyle(newTransform);
    };

    const handleMouseLeave = () => {
        setTransformStyle("");
    };

    return (
        <div
            ref={itemRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle }}
        >
            {children}
        </div>
    );
};

interface BentoCardProps {
    src: string;
    title: React.ReactNode;
    description?: string;
    isComingSoon?: boolean;
    func?: () => void;
}

export const BentoCard = ({ src, title, description, isComingSoon, func }: BentoCardProps) => {

    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverButtonRef = useRef(null);

    const handleMouseMove = (event) => {
        if (!hoverButtonRef.current) return;
        const rect = hoverButtonRef.current.getBoundingClientRect();

        setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handleMouseEnter = () => setHoverOpacity(1);
    const handleMouseLeave = () => setHoverOpacity(0);

    return (
        <div className="relative size-full ">
            <video
                src={src}
                loop
                muted
                autoPlay
                className="absolute top-0 mx-auto right-0 left-0 h-full object-cover"
            />

            <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
                <div>
                    <h1 className="bento-title special-font">{title}</h1>
                    {description && (
                        <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
                    )}
                </div>

                {isComingSoon && (
                    <div
                        ref={hoverButtonRef}
                        onClick={isComingSoon ? func : null}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
                    >
                        {/* Radial gradient hover effect */}
                        <div
                            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                            style={{
                                opacity: hoverOpacity,
                                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
                            }}
                        />
                        <MoveLeftIcon className="relative z-20" />
                        <p className="relative z-20">Play Now</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Features = () => {
    const router = useRouter();

    return (

        <section className="bg-black">
            <div className="container mx-auto px-3 md:px-10">
                <div className="px-5 py-32">
                    <p className="font-circular-web text-lg text-blue-50">
                        Into the AI-Powered Future
                    </p>
                    <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
                        Explore cutting-edge AI solutions that analyze emotions, provide anonymous
                        mental health support, and offer personalized assistance through custom-trained models.
                    </p>
                </div>

                <div onClick={() => router.push("/Games/DnaGame")}>
                    <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
                        <BentoCard
                            src="videos/feature-1.mp4"
                            title={
                                <>
                                    AI<b> Bhagavad Gita Chatbot</b>
                                </>
                            }
                            description="Gain wisdom and guidance from the sacred teachings of the Bhagavad Gita through AI-powered conversations."
                            isComingSoon={true}
                        />
                    </BentoTilt>
                </div>

                <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7" onClick={() => router.push("/Games/Predictions")} >
                    <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
                        <BentoCard
                            src="videos/feature-2.webm"
                            title={
                                <>
                                    AI<b> Sukku - The Kalido Chat</b>
                                </>
                            }
                            description="An interactive AI chat experience designed to engage, support, and assist users in a dynamic and colorful way."
                            isComingSoon
                        />
                    </BentoTilt>
                    <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
                        <BentoCard
                            src="videos/feature-4.mp4"
                            title={
                                <>
                                    AI<b> Heal</b>
                                </>
                            }
                            description="A custom-trained AI model designed to provide mental health support and emotional well-being guidance."
                            isComingSoon
                        />
                    </BentoTilt>
                </div>
            </div>
        </section>


    )
};

export default Features;
