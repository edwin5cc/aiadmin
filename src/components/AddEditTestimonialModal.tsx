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

interface AddEditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: { author: string; text: string; role?: string }) => void;
  initialTestimonial?: { author: string; text: string; role?: string };
}

const AddEditTestimonialModal: React.FC<AddEditTestimonialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTestimonial,
}) => {
  const [author, setAuthor] = useState(initialTestimonial?.author || "");
  const [role, setRole] = useState(initialTestimonial?.role || "");
  const [text, setText] = useState(initialTestimonial?.text || "");

  useEffect(() => {
    if (initialTestimonial) {
      setAuthor(initialTestimonial.author);
      setRole(initialTestimonial.role || "");
      setText(initialTestimonial.text);
    } else {
      setAuthor("");
      setRole("");
      setText("");
    }
  }, [initialTestimonial, isOpen]);

  const handleSubmit = () => {
    if (author.trim() && text.trim()) {
      onSave({ author, text, role: role.trim() || undefined });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {initialTestimonial ? "Make changes to this testimonial." : "Add a new customer testimonial."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role/Company (Optional)
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="col-span-3"
              placeholder="e.g., CEO of Example Corp"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="testimonial-text" className="text-right pt-2">
              Testimonial
            </Label>
            <Textarea
              id="testimonial-text"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
              placeholder="Enter the testimonial text here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            {initialTestimonial ? "Save Changes" : "Add Testimonial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTestimonialModal;