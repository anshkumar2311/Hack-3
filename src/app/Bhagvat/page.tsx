'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Clock } from '@/components/Clock';
import { ChatMessage } from '@/components/ChatMessage';
import { quotes } from '@/data/bhagvad-gita';
import { Message } from '@/types';

const API_KEY = "AIzaSyDdxS5w-Rqua9jEqnPB9B79HsNhUcsGKvw";

// Check if window is defined to prevent SSR issues
const isBrowser = typeof window !== 'undefined';
const SpeechRecognition = 
  isBrowser && (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "👋 Hi! I'm Neurowell, your AI assistant powered by ancient wisdom. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

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
          recognition.current.lang = 'en-US';
          recognition.current.interimResults = false;
          
          recognition.current.onresult = (event: any) => {
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
  }, []);

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
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `${message}\n\nBhagavad Gita says: ${
                  quotes.find(q => q.quote)?.quote || 
                  "You have the right to work, but never to the fruit of work."
                }` 
              }] 
            }]
          })
        }
      );

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    } catch (error) {
      console.error('Error:', error);
      return "Error connecting to AI.";
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    const response = await getAIResponse(text);
    setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <>
      <video autoPlay muted loop className="video-background">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-lines-background-12916-large.mp4" type="video/mp4" />
      </video>

      <ThemeToggle />

      <main className="chat-container">
        <div className="chat-header">
          <h1>Neurowell</h1>
          <p>AI Assistant with Ancient Wisdom</p>
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Ask for wisdom..."
            aria-label="Chat input"
            disabled={isLoading}
          />
          <button
            id="mic-button"
            onClick={toggleVoiceInput}
            className={isListening ? 'listening' : ''}
            aria-label="Voice input"
            disabled={isLoading || !SpeechRecognition}
          >
            <Mic size={20} />
          </button>
          <button
            onClick={() => handleSendMessage(inputValue)}
            aria-label="Send message"
            disabled={isLoading}
            className="send-button"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </main>
    </>
  );
}