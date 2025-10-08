import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AIModulePromptConfigProps {
  moduleName: string;
  initialPrompt: string;
}

const AIModulePromptConfig: React.FC<AIModulePromptConfigProps> = ({ moduleName, initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSave = () => {
    // In a real application, you would send this 'prompt' to your backend
    console.log(`Saving prompt for ${moduleName}:`, prompt);
    toast.success(`Prompt for ${moduleName} saved successfully!`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`prompt-${moduleName.toLowerCase().replace(/\s/g, '-')}`}>
          Prompt for {moduleName}
        </Label>
        <Textarea
          id={`prompt-${moduleName.toLowerCase().replace(/\s/g, '-')}`}
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Enter the specific prompt for the ${moduleName} AI module`}
        />
        <p className="text-sm text-slate-500">
          This prompt will be used specifically for the {moduleName} AI module.
        </p>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
          Save {moduleName} Prompt
        </Button>
      </div>
    </div>
  );
};

export default AIModulePromptConfig;