import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import Markdown from 'react-markdown';
import { BeatLoader } from "react-spinners";


// Career Selection Component
export const CareerSelection = () => {
    const [selectedCareer, setSelectedCareer] = useState('Please select a condition');
    const [careerDescription, setCareerDescription] = useState('');
    const router = useRouter();

    const conditions = [
        { name: 'Anger', icon: '/icons/anger.png' },
        { name: 'Anxiety', icon: '/icons/anxiety.png' },
        { name: 'Bipolar', icon: '/icons/bipolar.png' },
        { name: 'Depression', icon: '/icons/depression.png' },
        { name: 'WeightLoss', icon: '/icons/weight-loss.png' },
        { name: 'Loneliness', icon: '/icons/loneliness.png' },
        { name: 'Fear', icon: '/icons/fear.png' },
        { name: 'Insomnia', icon: '/icons/insomnia.png' },
        { name: 'HearingVoices', icon: '/icons/listen.png' },
        { name: 'PanicAttack', icon: '/icons/panic-attack.png' },
        { name: 'Paranoia', icon: '/icons/paranoia.png' },
        { name: 'Phobia', icon: '/icons/phobia.png' },
        { name: 'Psychosis', icon: '/icons/psychosis.png' },
        { name: 'Schizophrenia', icon: '/icons/schizophrenia.png' },
        { name: 'SelfConfidence', icon: '/icons/self-confidence.png' },
        { name: 'SelfHarm', icon: '/icons/self-harm.png' },
    ];

    const handleConditionSelect = async (condition: any) => {
        toast.success(`You selected ${condition}`);
        setSelectedCareer(condition);

        try {
            const response = await fetch(`/data/career.d.json`);
            const data = await response.json();
            setCareerDescription(data[condition]);
        } catch {
            toast.error('Failed to load condition description');
        }
    };

    return (
        <div className="min-h-screen  pt-14 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-3xl font-bold text-white  sm:text-4xl">
                        Select Your Condition
                    </h1>
                    <p className="text-lg ">
                        Choose the condition you&apos;d like to learn more about
                    </p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4 mb-8">
                    {conditions.map((condition) => (
                        <button
                            key={condition.name}
                            onClick={() => handleConditionSelect(condition.name)}
                            className={cn(
                                "p-4 rounded-xl transition-all duration-200 hover:scale-105",
                                "flex flex-col items-center justify-center gap-2",
                                "border border-gray-200 hover:border-blue-500",
                                "bg-white hover:bg-blue-50",
                                selectedCareer === condition.name && "border-blue-500 bg-blue-50"
                            )}
                        >
                            <Image
                                src={condition.icon}
                                alt={condition.name}
                                width={48}
                                height={48}
                                className="transition-transform duration-200"
                            />
                            <span className="text-sm font-medium text-gray-900">
                                {condition.name.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </button>
                    ))}
                </div>

                <Card className={cn(
                    "max-w-2xl mx-auto transition-all duration-300",
                    selectedCareer === 'Please select a condition' ? 'opacity-50' : 'opacity-100'
                )}>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            {selectedCareer.replace(/([A-Z])/g, ' $1').trim()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">{careerDescription}</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={() => router.push(`/Guide-Eval/GetGuidance/${selectedCareer}`)}
                                disabled={selectedCareer === 'Please select a condition'}
                                className="flex items-center justify-center gap-2"
                            >
                                Get Guidance
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => router.push(`/Courses/${selectedCareer}`)}
                                disabled={selectedCareer === 'Please select a condition'}
                                variant="outline"
                                className="flex items-center justify-center gap-2"
                            >
                                Evaluate
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </div>
    );
};

// Guidance Page Component
export const GuidancePage = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [output, setOutput] = useState("Select 'Get Details' to learn about causes and treatments...");

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
        } catch (error: any) {
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
        <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Understanding {name?.toString().replace(/([A-Z])/g, ' $1').trim()}
                    </h1>
                    <p className="text-gray-600">
                        Learn about causes, symptoms, and treatment options
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="prose max-w-none">
                            <Markdown>{output}</Markdown>
                        </div>
                    </CardContent>
                </Card>

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
