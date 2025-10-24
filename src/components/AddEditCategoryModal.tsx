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
import { Loader2 } from "lucide-react";

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
  isLoading?: boolean;
  isEditing?: boolean;
}

const AddEditCategoryModal: React.FC<AddEditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  isLoading = false,
  isEditing = false,
}) => {
  const [categoryName, setCategoryName] = useState(initialName);

  useEffect(() => {
    setCategoryName(initialName);
  }, [initialName, isOpen]);

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onSave(categoryName);
      setCategoryName("");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add New Category"}
            {isLoading && (
              <div className="flex items-center mt-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-indigo-600" />
                <span className="text-sm text-slate-600">
                  {isEditing ? "Updating category..." : "Creating category..."}
                </span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to your category here." : "Add a new resource category."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              Category Name
            </Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Marketing Templates"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            disabled={isLoading || !categoryName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Save Changes" : "Add Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryModal;