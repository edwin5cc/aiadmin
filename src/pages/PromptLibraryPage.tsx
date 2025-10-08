import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PromptCard from '@/components/PromptCard';
import { toast } from "sonner";

interface Prompt {
  id: string;
  title: string;
  description: string;
}

const PromptLibraryPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: '1', title: 'Marketing Campaign Idea Generator', description: 'Generate creative and effective marketing campaign ideas for various products and services.' },
    { id: '2', title: 'Blog Post Outline Creator', description: 'Create detailed outlines for blog posts, including headings, subheadings, and key points for each section.' },
    { id: '3', title: 'Social Media Caption Writer', description: 'Write engaging and concise captions for social media posts across different platforms (Instagram, Facebook, X).' },
  ]);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptDescription, setNewPromptDescription] = useState('');

  const handleAddPrompt = () => {
    if (newPromptTitle.trim() && newPromptDescription.trim()) {
      const newPrompt: Prompt = {
        id: String(prompts.length + 1), // Simple ID generation
        title: newPromptTitle,
        description: newPromptDescription,
      };
      setPrompts([...prompts, newPrompt]);
      setNewPromptTitle('');
      setNewPromptDescription('');
      toast.success("New prompt added successfully!");
    } else {
      toast.error("Please enter both a title and description for the new prompt.");
    }
  };

  const handleEditPrompt = (id: string) => {
    // In a real app, this would open a modal or navigate to an edit page
    toast.info(`Editing prompt with ID: ${id}`);
    console.log("Edit prompt:", id);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    toast.success("Prompt deleted successfully!");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Prompt Library</h2>
        <Button onClick={handleAddPrompt} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Prompt</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Prompt</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            placeholder="Prompt Title (e.g., 'Email Subject Line Generator')"
            value={newPromptTitle}
            onChange={(e) => setNewPromptTitle(e.target.value)}
          />
          <Input
            placeholder="Prompt Description (e.g., 'Craft compelling subject lines for email marketing campaigns.')"
            value={newPromptDescription}
            onChange={(e) => setNewPromptDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAddPrompt} className="bg-indigo-indigo-600 text-white font-semibold hover:bg-indigo-700">
            Add Prompt
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold mb-4">Existing Prompts</h3>
        {prompts.length === 0 ? (
          <p className="text-slate-500">No prompts in the library yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                onEdit={handleEditPrompt}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptLibraryPage;