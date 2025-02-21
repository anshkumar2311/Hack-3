'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play } from 'lucide-react';
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import Markdown from 'react-markdown';
import { BeatLoader } from "react-spinners";
import mentalHealthData from './session.json';

const GuidancePage = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [output, setOutput] = useState("Select 'Get Details' to learn about causes and treatments...");
    const conditionData = mentalHealthData[name as string];

    const getGuidance = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/career/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userPrompt: `What is ${name} and what are the possible treatments for it?`,
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);
            if (!data.text) throw new Error("No response received");

            setResponse(data.text);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!response) return;

        setOutput("");
        const typeWriter = async () => {
            for (let i = 0; i < response.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 10));
                setOutput(prev => prev + response[i]);
            }
        };
        typeWriter();
    }, [response]);

    return (
        <div className="min-h-screenpt-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Understanding {name?.toString().replace(/([A-Z])/g, ' $1').trim()}
                    </h1>
                    <p className="text-gray-600">
                        {conditionData?.description || "Learn about causes, symptoms, and treatment options"}
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="prose max-w-none">
                            <Markdown>{output}</Markdown>
                        </div>
                    </CardContent>
                </Card>

                {conditionData?.videos && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Educational Videos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {conditionData.videos.map((video) => (
                                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-0">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                                <a
                                                    href={video.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Button variant="secondary" size="icon" className="rounded-full">
                                                        <Play className="h-6 w-6" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h3 className="font-medium text-sm line-clamp-2 mb-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs line-clamp-2">
                                            {video.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <Button
                        onClick={getGuidance}
                        disabled={loading}
                        className="min-w-[150px]"
                    >
                        {loading ? <BeatLoader color="white" size={8} /> : "Get Details"}
                    </Button>
                </div>
            </div>
            <Toaster />
        </div>
    );
};


export default GuidancePage;
