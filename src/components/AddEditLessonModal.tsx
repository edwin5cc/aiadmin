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
import { Upload, Loader2, Eye, Play, X } from 'lucide-react';
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
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState<string>('');

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
    setShowVideoPlayer(false);
    setVideoToPlay('');
  }, [initialLesson, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Set video URL to file name for now - will be updated after upload
      setVideoUrl(file.name);
    }
  };

  const handleViewVideo = (url?: string) => {
    const urlToPlay = url || videoUrl || initialLesson?.video_url;
    if (urlToPlay) {
      setVideoToPlay(urlToPlay);
      setShowVideoPlayer(true);
    }
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
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
            <div className="col-span-3 flex gap-2">
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
                placeholder="https://example.com/video.mp4"
              />
              {videoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleViewVideo()}
                  title="View Video"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Video File
            </Label>
            <div className="col-span-3 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              {/* Video Player Section */}
              {showVideoPlayer && videoToPlay ? (
                <div className="w-full max-w-3xl">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseVideoPlayer}
                      className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <video
                      src={videoToPlay}
                      controls
                      className="w-full h-auto rounded-lg"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              ) : selectedFile ? (
                // When a new file is selected
                <div className="flex flex-col items-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="text-sm text-slate-600 mt-2">{selectedFile.name}</p>
                </div>
              ) : initialLesson?.video_url ? (
                // When there's an existing video - show play button
                <div className="mt-2 text-center w-full">
                  <p className="text-sm text-slate-600 mb-4">Current video:</p>
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-xs text-slate-500 truncate max-w-[300px]">{initialLesson.video_url}</p>
                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      onClick={() => handleViewVideo()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Play Video
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty state
                <div className="flex flex-col items-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 mt-2">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <Input id="file-upload" name="file-upload" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              )}
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