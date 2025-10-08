"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserActivity {
  id: string;
  user: string;
  type: 'chat' | 'upload';
  details: string;
  timestamp: string;
  fullContent?: string; // Detailed content for chat or upload
}

interface UserActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: UserActivity | null;
}

const UserActivityDetailModal: React.FC<UserActivityDetailModalProps> = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  const getTitle = () => {
    if (activity.type === 'chat') {
      return `Chat Session with ${activity.user}`;
    }
    return `Upload Details: ${activity.details}`;
  };

  const getDescription = () => {
    if (activity.type === 'chat') {
      return `Full transcript of the conversation on ${activity.timestamp}.`;
    }
    return `Detailed information for the upload by ${activity.user} on ${activity.timestamp}.`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full w-full p-4 border rounded-md bg-slate-50">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
              {activity.fullContent || "No detailed content available."}
            </pre>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityDetailModal;