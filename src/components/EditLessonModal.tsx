import React from 'react';
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

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({ isOpen, onClose, lessonTitle }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Lesson: "{lessonTitle}"</DialogTitle>
          <DialogDescription>
            Make changes to your lesson here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lesson-title" className="text-right">
              Lesson Title
            </Label>
            <Input id="lesson-title" defaultValue={lessonTitle} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Video File
            </Label>
            <div className="col-span-3 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <p className="text-sm text-slate-600 mt-2">current_video_file.mp4</p>
              <div className="flex text-sm text-slate-600 mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload a new file</span>
                  <Input id="file-upload" name="file-upload" type="file" className="sr-only" />
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
              defaultValue="This is the transcript for the introductory video..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonModal;