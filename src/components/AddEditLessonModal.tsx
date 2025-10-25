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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from 'lucide-react';
import { Lesson } from '@/types/api';

interface AddEditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: any) => void;
  initialLesson?: Lesson;
  isLoading?: boolean;
}

const AddEditLessonModal: React.FC<AddEditLessonModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialLesson,
  isLoading = false 
}) => {
  const [title, setTitle] = useState(initialLesson?.title || "");
  const [description, setDescription] = useState(initialLesson?.description || "");
  const [videoUrl, setVideoUrl] = useState(initialLesson?.video_url || "");
  const [videoProvider, setVideoProvider] = useState(initialLesson?.video_provider || "s3");
  const [durationSeconds, setDurationSeconds] = useState(initialLesson?.duration_seconds?.toString() || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialLesson?.thumbnail_url || "");
  const [transcript, setTranscript] = useState(initialLesson?.transcript || "");
  const [lessonNumber, setLessonNumber] = useState(initialLesson?.lesson_number?.toString() || "");
  const [displayOrder, setDisplayOrder] = useState(initialLesson?.display_order?.toString() || "");
  const [isPublished, setIsPublished] = useState(initialLesson?.is_published || false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialLesson) {
      setTitle(initialLesson.title);
      setDescription(initialLesson.description || "");
      setVideoUrl(initialLesson.video_url || "");
      setVideoProvider(initialLesson.video_provider || "s3");
      setDurationSeconds(initialLesson.duration_seconds?.toString() || "");
      setThumbnailUrl(initialLesson.thumbnail_url || "");
      setTranscript(initialLesson.transcript || "");
      setLessonNumber(initialLesson.lesson_number?.toString() || "");
      setDisplayOrder(initialLesson.display_order?.toString() || "");
      setIsPublished(initialLesson.is_published || false);
    } else {
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setVideoProvider("s3");
      setDurationSeconds("");
      setThumbnailUrl("");
      setTranscript("");
      setLessonNumber("");
      setDisplayOrder("");
      setIsPublished(false);
    }
    setSelectedFile(null);
  }, [initialLesson, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Set video URL to file name for now - will be updated after upload
      setVideoUrl(file.name);
    }
  };

  const handleSubmit = () => {
    if (title.trim()) {
      const lessonData = {
        id: initialLesson?.id,
        title: title.trim(),
        description: description.trim() || undefined,
        video_url: videoUrl.trim() || undefined,
        video_provider: videoProvider,
        duration_seconds: durationSeconds ? parseInt(durationSeconds) : undefined,
        thumbnail_url: thumbnailUrl.trim() || undefined,
        transcript: transcript.trim() || undefined,
        lesson_number: lessonNumber ? parseInt(lessonNumber) : undefined,
        display_order: displayOrder ? parseInt(displayOrder) : undefined,
        is_published: isPublished,
        file: selectedFile
      };
      onSave(lessonData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialLesson ? `Edit Lesson: "${initialLesson.title}"` : "Add New Lesson"}</DialogTitle>
          <DialogDescription>
            {initialLesson ? "Make changes to your lesson here." : "Fill in the details for the new lesson."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lesson-title" className="text-right">
              Lesson Title *
            </Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Introduction to Marketing"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lesson-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="lesson-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter lesson description..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-provider" className="text-right">
              Video Provider
            </Label>
            <Select value={videoProvider} onValueChange={setVideoProvider}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select video provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="s3">S3</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="wistia">Wistia</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video-url" className="text-right">
              Video URL
            </Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Video File
            </Label>
            <div className="col-span-3 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              {selectedFile && <p className="text-sm text-slate-600 mt-2">{selectedFile.name}</p>}
              <div className="flex text-sm text-slate-600 mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>{selectedFile ? "Upload a new file" : "Upload a file"}</span>
                  <Input id="file-upload" name="file-upload" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration-seconds" className="text-right">
              Duration (seconds)
            </Label>
            <Input
              id="duration-seconds"
              type="number"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 1800"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lesson-number" className="text-right">
              Lesson Number
            </Label>
            <Input
              id="lesson-number"
              type="number"
              value={lessonNumber}
              onChange={(e) => setLessonNumber(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="display-order" className="text-right">
              Display Order
            </Label>
            <Input
              id="display-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail-url" className="text-right">
              Thumbnail URL
            </Label>
            <Input
              id="thumbnail-url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lesson-transcript" className="text-right pt-2">
              Transcript
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is-published" className="text-right">
              Published
            </Label>
            <div className="col-span-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Make this lesson visible to users</span>
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !title.trim()}
            className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialLesson ? "Saving..." : "Creating..."}
              </>
            ) : (
              initialLesson ? "Save Changes" : "Add Lesson"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLessonModal;