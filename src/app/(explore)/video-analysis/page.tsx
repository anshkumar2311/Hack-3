// app/video-analysis/page.tsx
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';

interface AnalysisResult {
    issues: string[];
    remarks: string;
    solutions: string[];
}

export default function VideoAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a video file');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // First, upload the file to your server
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload video');
            }

            const { filePath } = await uploadResponse.json();

            // Then, process the video
            const processResponse = await fetch('/api/process-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video_path: filePath }),
            });

            if (!processResponse.ok) {
                throw new Error('Failed to process video');
            }

            const analysisResult = await processResponse.json();
            setResult(analysisResult.raw_response ? JSON.parse(analysisResult.raw_response) : analysisResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Video Analysis</CardTitle>
                    <CardDescription>
                        Upload a video to analyze emotions and mental health patterns
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="video-upload"
                        />
                        <label
                            htmlFor="video-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">
                                {file ? file.name : 'Click to upload or drag and drop'}
                            </span>
                        </label>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Analyze Video'
                        )}
                    </Button>

                    {/* Results Section */}
                    {result && (
                        <div className="space-y-6 mt-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Identified Issues</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {result.issues.map((issue, index) => (
                                        <li key={index} className="">{issue}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                                <p className="">{result.remarks}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Recommended Solutions</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {result.solutions.map((solution, index) => (
                                        <li key={index} className="">{solution}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
