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

interface AddEditFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feature: { title: string; description: string }) => void;
  initialFeature?: { title: string; description: string };
}

const AddEditFeatureModal: React.FC<AddEditFeatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFeature,
}) => {
  const [title, setTitle] = useState(initialFeature?.title || "");
  const [description, setDescription] = useState(initialFeature?.description || "");

  useEffect(() => {
    if (initialFeature) {
      setTitle(initialFeature.title);
      setDescription(initialFeature.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialFeature, isOpen]);

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSave({ title, description });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialFeature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
          <DialogDescription>
            {initialFeature ? "Make changes to this feature." : "Add a new feature to your landing page."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feature-title" className="text-right">
              Title
            </Label>
            <Input
              id="feature-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Advanced Analytics"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="feature-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="feature-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe the benefits of this feature..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            {initialFeature ? "Save Changes" : "Add Feature"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditFeatureModal;