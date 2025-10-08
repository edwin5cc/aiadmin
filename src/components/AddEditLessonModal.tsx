"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from 'lucide-react';

interface LessonData {
  id?: string; // Optional for new lessons
  title: string;
  videoId: string;
  duration: string;
  transcript?: string;
  fileName?: string; // For uploaded video file name
}

interface AddEditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: LessonData) => void;
  initialLesson?: LessonData; // Optional for adding new lessons
}

const AddEditLessonModal: React.FC<AddEditLessonModalProps> = ({ isOpen, onClose, onSave, initialLesson }) => {
  const [lessonTitle, setLessonTitle] = useState(initialLesson?.title || "");
  const [videoId, setVideoId] = useState(initialLesson?.videoId || "");
  const [duration, setDuration] = useState(initialLesson?.duration || "");
  const [transcript, setTranscript] = useState(initialLesson?.transcript || "");
  const [fileName, setFileName] = useState(initialLesson?.fileName || "");

  useEffect(() => {
    if (initialLesson) {
      setLessonTitle(initialLesson.title);
      setVideoId(initialLesson.videoId);
      setDuration(initialLesson.duration);
      setTranscript(initialLesson.transcript || "");
      setFileName(initialLesson.fileName || "");
    } else {
      setLessonTitle("");
      setVideoId("");
      setDuration("");
      setTranscript("");
      setFileName("");
    }
  }, [initialLesson, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      // In a real app, you'd upload the file and get a video ID
      setVideoId(`temp_video_id_${Date.now()}`); // Placeholder
    }
  };

  const handleSubmit = () => {
    if (lessonTitle.trim() && videoId.trim() && duration.trim()) {
      onSave({
        id: initialLesson?.id, // Keep existing ID if editing
        title: lessonTitle,
        videoId: videoId,
        duration: duration,
        transcript: transcript.trim() || undefined,
        fileName: fileName || undefined,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialLesson ? `Edit Lesson: "${initialLesson.title}"` : "Add New Lesson"}</DialogTitle>
          <DialogDescription>
            {initialLesson ? "Make changes to your lesson here." : "Fill in the details for the new lesson."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lesson-title" className="text-right">
              Lesson Title
            </Label>
            <Input
              id="lesson-title"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Introduction to Marketing"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-id" className="text-right">
              Video ID
            </Label>
            <Input
              id="video-id"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="col-span-3"
              placeholder="e.g., med_1a2b3c"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 12:34"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Video File
            </Label>
            <div className="col-span-3 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              {fileName && <p className="text-sm text-slate-600 mt-2">{fileName}</p>}
              <div className="flex text-sm text-slate-600 mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>{fileName ? "Upload a new file" : "Upload a file"}</span>
                  <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lesson-transcript" className="text-right pt-2">
              Transcript (optional)
            </Label>
            <Textarea
              id="lesson-transcript"
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="col-span-3"
              placeholder="Enter the transcript for the lesson video..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            {initialLesson ? "Save Changes" : "Add Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLessonModal;