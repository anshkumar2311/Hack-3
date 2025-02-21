'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { useState } from 'react';

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    analysis?: {
        keywords: string[];
        mood: string;
        themes: string;
    };
}

const JournalApp = () => {
    const [journalEntry, setJournalEntry] = useState('');
    const [title, setTitle] = useState('');
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!journalEntry.trim() || !title.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/journal/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: journalEntry,
                    title: title,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save journal entry');
            }

            const data = await response.json();
            const newEntry: JournalEntry = {
                ...data.journal,
                analysis: data.analysis,
            };

            setEntries([newEntry, ...entries]);
            setJournalEntry('');
            setTitle('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My AI Journal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Entry title..."
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={journalEntry}
                            onChange={(e) => setJournalEntry(e.target.value)}
                            placeholder="Write your thoughts here..."
                            className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Save & Analyze'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {entries.map(entry => (
                <Card key={entry.id}>
                    <CardContent className="space-y-4 pt-6">
                        <h3 className="font-semibold text-lg">{entry.title}</h3>
                        <p className="text-gray-600">{entry.content}</p>

                        {entry.analysis && (
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="w-4 h-4" />
                                    <span className="font-medium">Keywords:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {entry.analysis.keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Mood: {entry.analysis.mood}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Themes: {entry.analysis.themes}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {entries.length === 0 && (
                <Alert>
                    <AlertDescription>
                        No journal entries yet. Start writing to see AI analysis!
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default JournalApp;
