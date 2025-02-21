"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, Brain, Dumbbell, Heart, Lightbulb, PenTool } from "lucide-react";
import { useState } from "react";

// Educational content data
const LEARNING_CONCEPTS = [
  {
    id: 1,
    question: "What is Cognitive Behavioral Therapy (CBT)?",
    answer: "CBT is a type of psychotherapy that helps people identify and change negative thought patterns and behaviors. It focuses on the connection between thoughts, feelings, and actions.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 2,
    question: "What are cognitive distortions?",
    answer: "Cognitive distortions are patterns of thinking that can lead to inaccurate or unhelpful conclusions. Common examples include all-or-nothing thinking, overgeneralization, and catastrophizing.",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: 3,
    question: "How does mindfulness work?",
    answer: "Mindfulness is the practice of being present and fully engaged with whatever we're doing at the moment. It helps reduce stress and anxiety by focusing our attention on the present rather than worrying about the past or future.",
    icon: <Lightbulb className="w-5 h-5" />,
  },
];

const PRACTICE_EXERCISES = [
  {
    id: 1,
    title: "Quick Breathing Exercise",
    description: "Practice this 4-7-8 breathing technique:",
    steps: [
      "Inhale quietly through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale completely through your mouth for 8 counts",
    ],
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Thought Challenge",
    description: "Identify a negative thought and answer these questions:",
    steps: [
      "What evidence supports this thought?",
      "What evidence contradicts it?",
      "What would you tell a friend in this situation?",
    ],
    icon: <Dumbbell className="w-5 h-5" />,
  },
];

const TAB_DATA = [
  {
    value: "learn",
    label: "Learn",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    value: "practice",
    label: "Practice",
    icon: <Dumbbell className="w-4 h-4" />,
  },
  {
    value: "reflect",
    label: "Reflect",
    icon: <PenTool className="w-4 h-4" />,
  },
];

const PsychEducation = () => {
  const [showAnswer, setShowAnswer] = useState<{ [key: number]: boolean }>({});
  const [currentMoodLog, setCurrentMoodLog] = useState("");
  const [moodLogs, setMoodLogs] = useState<{ text: string; timestamp: string }[]>([]);

  const toggleAnswer = (id: number) => {
    setShowAnswer((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addMoodLog = () => {
    if (currentMoodLog.trim()) {
      setMoodLogs((prev) => [
        {
          text: currentMoodLog,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      setCurrentMoodLog("");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold ">Understanding Your Mind</h1>
          <p className="">Explore, learn, and grow with guided mental health education</p>
        </header>

        <Tabs defaultValue="learn" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            {TAB_DATA.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="learn">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-500" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEARNING_CONCEPTS.map((concept) => (
                    <div
                      key={concept.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleAnswer(concept.id)}
                      >
                        <h3 className="font-medium flex items-center gap-2">
                          {concept.icon}
                          {concept.question}
                        </h3>
                        <Lightbulb className={`w-5 h-5 transition-transform ${showAnswer[concept.id] ? "rotate-180" : ""
                          }`} />
                      </div>
                      {showAnswer[concept.id] && (
                        <p className="mt-3  pl-7">{concept.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice">
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-green-500" />
                  Practice Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {PRACTICE_EXERCISES.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {exercise.icon}
                        <h3 className="font-medium">{exercise.title}</h3>
                      </div>
                      <p className="mb-4 text-gray-600">{exercise.description}</p>
                      <ol className="space-y-2 pl-4">
                        {exercise.steps.map((step, index) => (
                          <li key={index} className="text-gray-700">
                            {index + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflect">
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-purple-500" />
                  Mood Journal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentMoodLog}
                      onChange={(e) => setCurrentMoodLog(e.target.value)}
                      placeholder="How are you feeling right now?"
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      onKeyPress={(e) => e.key === "Enter" && addMoodLog()}
                    />
                    <Button onClick={addMoodLog} className="bg-purple-500 hover:bg-purple-600">
                      Log
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {moodLogs.map((log, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <p className=" text-sm mb-1">{log.timestamp}</p>
                        <p className="">{log.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PsychEducation;
