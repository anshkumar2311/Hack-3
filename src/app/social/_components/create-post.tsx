'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PostCategory } from '@prisma/client';

// type PostCategory = 'GENERAL' | 'QUESTION' | 'EXPERIENCE' | 'ADVICE_REQUEST' | 'SUCCESS_STORY' | 'MEDICAL_INFO';

interface FormState {
  title: string;
  content: string;
  category: PostCategory | '';
  isPrivate: boolean;
  media: string[];
}

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    content: '',
    category: '',
    isPrivate: false,
    media: [],
  });
  const { user } = useUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64Files = await Promise.all(files.map(file => toBase64(file)));
    setForm(prev => ({
      ...prev,
      media: [...base64Files],
    }));
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (!form.title.trim()) {
      toast.error('Please enter a title.');
      return;
    }

    if (!form.category) {
      toast.error('Please select a category.');
      return;
    }

    try {
      const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      isPrivate: form.isPrivate,
      userId: user.id,
      media: form.media,
      };
      console.log(payload);
      

      if (!payload){
      throw new Error('Missing required fields');
      }

      const response = await fetch('/api/add-post', {
      method: 'POST',
      headers:{
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      });

      if (!response.ok) {
      throw new Error('Failed to create post');
      }

      toast.success('Post created successfully!');
      setIsOpen(false);
      setForm({
      title: '',
      content: '',
      category: '',
      isPrivate: false,
      media: [],
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="right-4 bottom-4 fixed">
        <Button size="lg" className="hidden md:inline-flex w-12 h-12 px-2 py-2 rounded-full">
          <Plus className="h-full w-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          />

          <Select
            value={form.category}
            onValueChange={(value: PostCategory) => 
              setForm(prev => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={PostCategory.GENERAL}>General</SelectItem>
                <SelectItem value="QUESTION">Question</SelectItem>
                <SelectItem value="EXPERIENCE">Experience</SelectItem>
                <SelectItem value="ADVICE_REQUEST">Advice Request</SelectItem>
                <SelectItem value="SUCCESS_STORY">Success Story</SelectItem>
                <SelectItem value="MEDICAL_INFO">Medical Info</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="What's on your mind?"
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
            className="min-h-[100px]"
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="private-mode"
              checked={form.isPrivate}
              onCheckedChange={(checked) => 
                setForm(prev => ({ ...prev, isPrivate: checked }))
              }
            />
            <Label htmlFor="private-mode">Private post</Label>
          </div>

          <div className="space-y-2 max-h-[40%] overflow-y-auto">
            <Label htmlFor="media-upload">Add Media</Label>
            <div className="flex flex-wrap gap-2">
              {form.media.map((file, index) => (
                <div key={index} className="relative inline-block">
                  <div className="p-2 border rounded flex items-center">
                    <span className="text-sm truncate max-w-[150px]">
                        <img src={file} alt={`media-${index}`} className="w-24 h-24 object-cover rounded" />
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <Input
                id="media-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media-upload')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}