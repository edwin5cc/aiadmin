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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from 'lucide-react';

interface AddEditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: { name: string; type: string; value: string; fileName?: string }) => void;
  initialResource?: { name: string; type: string; value: string; fileName?: string };
}

const AddEditResourceModal: React.FC<AddEditResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialResource,
}) => {
  const [resourceName, setResourceName] = useState(initialResource?.name || "");
  const [resourceType, setResourceType] = useState(initialResource?.type || "link");
  const [resourceValue, setResourceValue] = useState(initialResource?.value || "");
  const [fileName, setFileName] = useState(initialResource?.fileName || "");

  useEffect(() => {
    if (initialResource) {
      setResourceName(initialResource.name);
      setResourceType(initialResource.type);
      setResourceValue(initialResource.value);
      setFileName(initialResource.fileName || "");
    } else {
      setResourceName("");
      setResourceType("link");
      setResourceValue("");
      setFileName("");
    }
  }, [initialResource, isOpen]);

  const handleSubmit = () => {
    if (resourceName.trim() && resourceValue.trim()) {
      onSave({ name: resourceName, type: resourceType, value: resourceValue, fileName });
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      setResourceValue(`file-upload-${file.name}`); // Placeholder for file content/ID
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          <DialogDescription>
            {initialResource ? "Make changes to your resource here." : "Add a new resource to this category."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource-name" className="text-right">
              Resource Name
            </Label>
            <Input
              id="resource-name"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Social Media Content Calendar"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resource-type" className="text-right">
              Type
            </Label>
            <Select value={resourceType} onValueChange={setResourceType}>
              <SelectTrigger id="resource-type" className="col-span-3">
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="text">Text Content</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {resourceType === "link" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resource-url" className="text-right">
                URL
              </Label>
              <Input
                id="resource-url"
                value={resourceValue}
                onChange={(e) => setResourceValue(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/your-resource"
              />
            </div>
          )}

          {resourceType === "file" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                File
              </Label>
              <div className="col-span-3 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                {fileName && <p className="text-sm text-slate-600 mt-2">{fileName}</p>}
                <div className="flex text-sm text-slate-600 mt-2">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span>{fileName ? "Upload new file" : "Upload a file"}</span>
                    <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {resourceType === "text" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="resource-content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="resource-content"
                rows={6}
                value={resourceValue}
                onChange={(e) => setResourceValue(e.target.value)}
                className="col-span-3"
                placeholder="Enter the text content for this resource..."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            {initialResource ? "Save Changes" : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditResourceModal;