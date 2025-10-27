import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { chatbotsApi } from '@/services/api';
import { Chatbot } from '@/types/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AIModulePromptConfigProps {
  chatbot: Chatbot | null;
  portalId: string | null;
  onUpdate: () => void;
}

const AIModulePromptConfig: React.FC<AIModulePromptConfigProps> = ({ chatbot, portalId, onUpdate }) => {
  const [name, setName] = useState(chatbot?.name || '');
  const [description, setDescription] = useState(chatbot?.description || '');
  const [prompt, setPrompt] = useState(chatbot?.system_prompt || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = async () => {
    if (!chatbot || !portalId) {
      toast.error('Missing chatbot or portal information');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a chatbot name');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a system prompt');
      return;
    }

    setIsSaving(true);
    try {
      await chatbotsApi.updateChatbot(chatbot.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        system_prompt: prompt.trim(),
      });
      toast.success(`Chatbot ${name} saved successfully!`);
      onUpdate(); // Refresh the chatbots list
    } catch (error: any) {
      console.error('Failed to save chatbot:', error);
      toast.error(error.message || 'Failed to save chatbot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!chatbot) return;
    
    setIsDeleting(true);
    try {
      await chatbotsApi.deleteChatbot(chatbot.id);
      toast.success(`Chatbot ${chatbot.name} deleted successfully!`);
      onUpdate(); // Refresh the chatbots list
    } catch (error: any) {
      console.error('Failed to delete chatbot:', error);
      toast.error(error.message || 'Failed to delete chatbot');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Update form fields when chatbot changes
  React.useEffect(() => {
    setName(chatbot?.name || '');
    setDescription(chatbot?.description || '');
    setPrompt(chatbot?.system_prompt || '');
  }, [chatbot]);

  if (!chatbot) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">No chatbot configured for this module.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${chatbot.slug}`}>
            Chatbot Name
          </Label>
          <Input
            id={`name-${chatbot.slug}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter chatbot name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${chatbot.slug}`}>
            Description (Optional)
          </Label>
          <Textarea
            id={`description-${chatbot.slug}`}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the chatbot's purpose"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`prompt-${chatbot.slug}`}>
            System Prompt
          </Label>
          <Textarea
            id={`prompt-${chatbot.slug}`}
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the system prompt for this AI chatbot"
          />
          <p className="text-sm text-slate-500">
            This system prompt defines how the chatbot behaves and responds to users.
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? 'Deleting...' : 'Delete Chatbot'}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the chatbot "{chatbot.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AIModulePromptConfig;