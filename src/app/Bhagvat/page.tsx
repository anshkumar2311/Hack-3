'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Clock } from '@/components/Clock';
import { ChatMessage } from '@/components/ChatMessage';
import { quotes } from '@/data/bhagvad-gita';
import { Message } from '@/types';

const API_KEY = "AIzaSyDdxS5w-Rqua9jEqnPB9B79HsNhUcsGKvw";

const isBrowser = typeof window !== 'undefined';
const SpeechRecognition =
  isBrowser && (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "🌟 Welcome to Neurowell! I'm your AI guide to ancient wisdom and modern well-being. How may I assist you today?",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    try {
      if (!recognition.current) {
        recognition.current = new SpeechRecognition();
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
    } catch (error) {
      console.error("Error initializing SpeechRecognition:", error);
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleVoiceInput = () => {
    if (!recognition.current) return;
    isListening ? recognition.current.stop() : recognition.current.start();
    setIsListening(!isListening);
  };

  const getAIResponse = async (message: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${message}\n\nBhagavad Gita says: ${quotes.find(q => q.quote)?.quote || "You have the right to work, but never to the fruit of work."}`
              }]
            }]
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't process that request.";
    } catch (error) {
      console.error('Error:', error);
      return "I'm having trouble connecting at the moment. Please try again.";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      <div className="relative z-10">
        <ThemeToggle />
        <main className="w-full max-w-[900px] mx-auto bg-white/10 dark:bg-gray-900/30 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col">
          <div className="p-6 border-b border-white/20 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl font-bold text-white">Neurowell</h1>
            </div>
            <p className="text-center text-gray-300">Ancient Wisdom Meets Modern AI</p>
            <Clock />
          </div>
          <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-4" ref={chatBoxRef}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <ChatMessage message={message} />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/20 dark:border-gray-700 flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Seek wisdom..."
              className="flex-1 px-6 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              disabled={isLoading}
            />
            <button onClick={toggleVoiceInput} className="p-3 rounded-full bg-red-500 text-white">
              <Mic className="w-6 h-6" />
            </button>
            <button onClick={() => handleSendMessage(inputValue)} className="p-3 rounded-full bg-blue-500 text-white">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
