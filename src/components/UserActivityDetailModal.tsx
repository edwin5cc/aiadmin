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
import { ScrollArea } from "@/components/ui/scroll-area";
import { userActivitiesApi } from '@/services/api';
import { UserActivityDetailData, UserActivityMessage } from '@/types/api';
import { showError } from '@/utils/toast';
import { Bot, User as UserIcon } from 'lucide-react';

interface UserActivity {
  id: string;
  user: string;
  type: 'chat' | 'upload';
  details: string;
  timestamp: string;
  fullContent?: string;
}

interface UserActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: UserActivity | null;
}

const UserActivityDetailModal: React.FC<UserActivityDetailModalProps> = ({ isOpen, onClose, activity }) => {
  const [details, setDetails] = useState<UserActivityDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activity) {
      loadActivityDetails();
    } else {
      setDetails(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activity]);

  const loadActivityDetails = async () => {
    if (!activity) return;

    setIsLoading(true);
    try {
      const response = await userActivitiesApi.getActivityMessages(activity.id);
      
      if (!response.error && response.data) {
        setDetails(response.data);
      } else {
        showError('Failed to load activity details');
        setDetails(null);
      }
    } catch (error) {
      console.error('Error loading activity details:', error);
      showError('Failed to load activity details');
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activity) return null;

  const getTitle = () => {
    return `Chat Session with ${activity.user}`;
  };

  const getDescription = () => {
    return `Full transcript of the conversation on ${activity.timestamp}.`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full w-full p-4">
            {isLoading ? (
              <div className="text-center py-8">Loading conversation...</div>
            ) : details?.messages && details.messages.length > 0 ? (
              <div className="space-y-4">
                {details.messages.map((msg: UserActivityMessage) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isUser 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isUser ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                            isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {msg.content}
                          </div>
                        </div>
                        {msg.tokens_used > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            {msg.tokens_used} tokens
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No messages available.
              </div>
            )}
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