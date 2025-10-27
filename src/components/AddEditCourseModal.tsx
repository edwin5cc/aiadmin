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
import { Loader2 } from "lucide-react";
import { Course } from '@/types/api';

interface AddEditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: {
    title: string;
    description?: string;
    estimated_duration_minutes?: number;
    display_order?: number;
    is_published: boolean;
  }) => void;
  initialCourse?: Course;
  isLoading?: boolean;
}

const AddEditCourseModal: React.FC<AddEditCourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCourse,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialCourse?.title || "");
  const [description, setDescription] = useState(initialCourse?.description || "");
  const [estimatedDuration, setEstimatedDuration] = useState(initialCourse?.estimated_duration_minutes?.toString() || "");
  const [displayOrder, setDisplayOrder] = useState(initialCourse?.display_order?.toString() || "");
  const [isPublished, setIsPublished] = useState(initialCourse?.is_published || false);

  useEffect(() => {
    if (initialCourse) {
      setTitle(initialCourse.title);
      setDescription(initialCourse.description || "");
      setEstimatedDuration(initialCourse.estimated_duration_minutes?.toString() || "");
      setDisplayOrder(initialCourse.display_order?.toString() || "");
      setIsPublished(initialCourse.is_published || false);
    } else {
      setTitle("");
      setDescription("");
      setEstimatedDuration("");
      setDisplayOrder("");
      setIsPublished(false);
    }
  }, [initialCourse, isOpen]);

  const handleSubmit = () => {
    if (title.trim()) {
      const courseData = {
        title: title.trim(),
        description: description.trim() || undefined,
        estimated_duration_minutes: estimatedDuration ? parseInt(estimatedDuration) : undefined,
        display_order: displayOrder ? parseInt(displayOrder) : undefined,
        is_published: isPublished,
      };
      onSave(courseData);
      // Don't close modal here - let the parent handle it after API call completes
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isLoading) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialCourse ? `Edit Course: "${initialCourse.title}"` : "Create New Course"}</DialogTitle>
          <DialogDescription>
            {initialCourse ? "Update the course details below." : "Enter the details for your new course."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course-title" className="text-right">
              Title *
            </Label>
            <Input
              id="course-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Marketing Masterclass"
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="course-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="course-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter course description..."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimated-duration" className="text-right">
              Duration (min)
            </Label>
            <Input
              id="estimated-duration"
              type="number"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 120"
              disabled={isLoading}
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
              disabled={isLoading}
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
                  disabled={isLoading}
                />
                <span className="text-sm">Make this course visible to users</span>
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
                {initialCourse ? "Saving..." : "Creating..."}
              </>
            ) : (
              initialCourse ? "Save Changes" : "Create Course"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCourseModal;
