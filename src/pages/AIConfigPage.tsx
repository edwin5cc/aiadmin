import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AIModulePromptConfig from '@/components/AIModulePromptConfig';

const AIConfigPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">AI Configuration</h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">General AI Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ai-model">Default AI Model</Label>
            <Select defaultValue="gpt-4o">
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (Creativity)</Label>
            <Input id="temperature" type="number" defaultValue="0.7" step="0.1" min="0" max="1" />
            <p className="text-sm text-slate-500">Controls randomness: lower for more focused, higher for more creative.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="system-prompt">Global System Prompt</Label>
          <Textarea
            id="system-prompt"
            rows={5}
            defaultValue="You are a helpful assistant for an online learning platform. Provide concise and accurate information, and always maintain a professional and encouraging tone."
            placeholder="Enter a global system prompt for the AI"
          />
          <p className="text-sm text-slate-500">This prompt will be prepended to all AI requests unless overridden by a specific tool.</p>
        </div>

        <div className="flex justify-end">
          <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Save General AI Settings</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">AI Module Specific Prompts</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="module-1" className="border p-4 rounded-lg mb-2">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              Profit Radar
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <AIModulePromptConfig
                moduleName="Profit Radar"
                initialPrompt="Analyze market trends and provide actionable insights for maximizing profit margins, focusing on e-commerce businesses."
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="module-2" className="border p-4 rounded-lg mb-2">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              Content Generator
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <AIModulePromptConfig
                moduleName="Content Generator"
                initialPrompt="Generate engaging and SEO-friendly content for blog posts, social media, and email newsletters, tailored to a target audience of small business owners."
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="module-3" className="border p-4 rounded-lg mb-2">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              Customer Support Bot
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <AIModulePromptConfig
                moduleName="Customer Support Bot"
                initialPrompt="Provide polite, accurate, and helpful responses to common customer inquiries, escalating complex issues to human support when necessary."
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="module-4" className="border p-4 rounded-lg">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              Lesson Plan Creator
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <AIModulePromptConfig
                moduleName="Lesson Plan Creator"
                initialPrompt="Develop structured and comprehensive lesson plans for online courses, including learning objectives, activities, and assessment methods, for adult learners."
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AIConfigPage;