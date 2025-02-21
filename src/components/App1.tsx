"use client";
import { quotes } from "@/data/bhagvad-gita";
import { Message } from "@/types";
import { Mic } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clock } from "./Clock";
import { ChatMessage } from "./teamates/ChatMessage";
import { ThemeToggle } from "./ThemeToggle";

// Function to strip markdown formatting but preserve paragraph structure
function stripMarkdown(text: string): string {
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');

    // Remove inline code
    text = text.replace(/`([^`]+)`/g, '$1');

    // Remove headers
    text = text.replace(/#{1,6}\s?([^\n]+)/g, '$1');

    // Remove bold/italic formatting
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');

    // Replace bullet points with paragraph breaks
    text = text.replace(/^\s*[-*+]\s+/gm, '\n');

    // Replace numbered lists with paragraph breaks
    text = text.replace(/^\s*\d+\.\s+/gm, '\n');

    // Remove blockquotes
    text = text.replace(/^\s*>\s+/gm, '');

    // Remove horizontal rules
    text = text.replace(/^\s*[-*_]{3,}\s*$/gm, '');

    // Remove link formatting
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

    // Ensure proper paragraph separation
    text = text.replace(/\n{3,}/g, '\n\n');

    // Ensure each point has its own paragraph
    text = text.split('\n').map(line => line.trim()).join('\n\n');

    return text.trim();
}

const API_KEY = "AIzaSyDdxS5w-Rqua9jEqnPB9B79HsNhUcsGKvw";

// Check if window is defined to prevent SSR issues
const isBrowser = typeof window !== "undefined";
const SpeechRecognition =
    isBrowser && (window.SpeechRecognition || window.webkitSpeechRecognition);

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { text: "👋 Hi! I'm Neurowell, your AI assistant. How can I help you today?", sender: "bot" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const recognition = useRef<typeof SpeechRecognition extends null ? null : InstanceType<typeof SpeechRecognition>>(null);

    // Memoized function to prevent unnecessary re-renders
    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        setMessages((prev) => [...prev, { text, sender: "user" }]);
        setInputValue("");
        setIsLoading(true);

        const response = await getAIResponse(text);
        setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
        setIsLoading(false);
    }, [isLoading]);

    useEffect(() => {
        // Exit early if SpeechRecognition is not supported
        if (!SpeechRecognition) {
            console.warn("SpeechRecognition is not supported in this browser.");
            return;
        }

        try {
            // Initialize recognition only if it's not already initialized
            if (!recognition.current) {
                recognition.current = new SpeechRecognition();

                // Only set properties if we successfully created the recognition instance
                if (recognition.current) {
                    recognition.current.continuous = false;
                    recognition.current.lang = "en-US";
                    recognition.current.interimResults = false;

                    recognition.current.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        setInputValue(transcript);
                        handleSendMessage(transcript);
                    };

                    recognition.current.onend = () => setIsListening(false);
                }
            }
        } catch (error) {
            console.error("Error initializing SpeechRecognition:", error);
        }

        return () => {
            if (recognition.current) {
                try {
                    // Cleanup event listeners when component unmounts
                    recognition.current.onresult = null;
                    recognition.current.onend = null;
                } catch (error) {
                    console.error("Error cleaning up speech recognition:", error);
                }
            }
        };
    }, [handleSendMessage]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleVoiceInput = () => {
        if (!recognition.current) {
            console.warn("SpeechRecognition is not supported or not initialized.");
            return;
        }

        try {
            if (!isListening) {
                recognition.current.start();
                setIsListening(true);
            } else {
                recognition.current.stop();
                setIsListening(false);
            }
        } catch (error) {
            console.error("Error starting/stopping speech recognition:", error);
            setIsListening(false);
        }
    };

    const getAIResponse = async (message: string) => {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `${message}\n\nPlease format your response with clear paragraph breaks after each point. If you're listing multiple points, make sure each point is on a new line with a blank line in between. Bhagavad Gita says: ${quotes.find((q) => q.quote)?.quote ||
                                            "You have the right to work, but never to the fruit of work."
                                            }`,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        }
                    }),
                }
            );

            const data = await response.json();
            const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't understand that.";

            // Process the response to remove markdown formatting but preserve paragraphs
            return stripMarkdown(rawResponse);
        } catch (error) {
            console.error("Error:", error);
            return "Error connecting to AI.";
        }
    };

    return (
        <>
            <video autoPlay muted loop className="video-background">
                <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-lines-background-12916-large.mp4"
                    type="video/mp4"
                />
            </video>

            <ThemeToggle />

            <main className="chat-container">
                <div className="chat-header">
                    <h1>Neurowell</h1>
                    <p>Your AI Assistant</p>
                    <Clock />
                </div>

                <div className="chat-box" ref={chatBoxRef}>
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                        placeholder="Ask Neurowell anything..."
                        aria-label="Chat input"
                        disabled={isLoading}
                    />
                    <button
                        id="mic-button"
                        onClick={toggleVoiceInput}
                        className={isListening ? "listening" : ""}
                        aria-label="Voice input"
                        disabled={!SpeechRecognition || isLoading}
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        onClick={() => handleSendMessage(inputValue)}
                        aria-label="Send message"
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            </main>
        </>
    );
}

export default App;
