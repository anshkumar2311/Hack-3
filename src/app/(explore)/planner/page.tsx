'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Task = {
  id: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  isCompleted: boolean;
  completedOn: string | null;
};

type DailyTasks = {
  id: string;
  date: string;
  userId: string;
  tasks: Task[];
  completedTasks: Task[];
};

const TaskManager = () => {
  const [dailyTasks, setDailyTasks] = useState<DailyTasks[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyTasks = async () => {
      try {
        const response = await fetch('/api/daily');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setDailyTasks(data);
      } catch (error) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyTasks();
  }, []);

  // Get today's tasks
  const todayTasks = dailyTasks.length > 0 ? dailyTasks[0].tasks : [];
  const currentTask = todayTasks[currentTaskIndex];

  const handleTaskComplete = async () => {
    if (!currentTask) return;

    try {
      // Here you would typically make an API call to update the task status
      // For now, we'll just update the local state
      const updatedTasks = [...todayTasks];
      updatedTasks[currentTaskIndex] = {
        ...currentTask,
        isCompleted: true,
        completedOn: new Date().toISOString(),
      };

      setDailyTasks(dailyTasks.map(day => ({
        ...day,
        tasks: updatedTasks,
        completedTasks: [...day.completedTasks, currentTask]
      })));

      if (currentTaskIndex < todayTasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }
    } catch (error) {
      setError('Failed to complete task. Please try again.');
      console.error('Error completing task:', error);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="text-center p-4">Loading tasks...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Alert className="bg-purple-900 border-purple-500 text-purple-100">
        <AlertCircle className="h-4 w-4 text-purple-400" />
        <AlertTitle>Managing Anxiety</AlertTitle>
        <AlertDescription>
          Complete these daily tasks to help manage anxiety symptoms
        </AlertDescription>
      </Alert>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Your Daily Wellness Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {todayTasks.map((task, index) => (
              <div
                key={task.id}
                className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                  index === currentTaskIndex
                    ? 'bg-gray-800 shadow-lg scale-105 border border-purple-500'
                    : 'bg-gray-900 opacity-50'
                }`}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">Task {index + 1}</h3>
                  <p className="text-gray-400">{task.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Time: {formatTime(task.timeFrom)} - {formatTime(task.timeTo)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {task.isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-700" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {currentTask && !currentTask.isCompleted && (
            <Button
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleTaskComplete}
            >
              Complete Current Task
            </Button>
          )}

          {todayTasks.every(task => task.isCompleted) && (
            <div className="text-center mt-6 p-4 bg-green-900 rounded-lg border border-green-700">
              <p className="text-green-100 font-semibold">
                Congratulations! You've completed all tasks for today! 🎉
              </p>
              <p className="text-green-200 text-sm mt-2">
                Remember, every small step counts towards better mental health.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;