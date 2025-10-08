"use client";

import React, { useState } from 'react';
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
import { Upload } from 'lucide-react';
import TestimonialCard from '@/components/TestimonialCard';
import AddEditTestimonialModal from '@/components/AddEditTestimonialModal';
import FeatureCard from '@/components/FeatureCard';
import AddEditFeatureModal from '@/components/AddEditFeatureModal';
import { toast } from "sonner";

interface Testimonial {
  id: string;
  author: string;
  role?: string;
  text: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
}

const LandingPage = () => {
  const [heroVideoFileName, setHeroVideoFileName] = useState("current_video_file_name.mp4");
  const [heroTitle, setHeroTitle] = useState("Unlock Your Business Potential");
  const [heroDescription, setHeroDescription] = useState("Our comprehensive courses and AI tools empower entrepreneurs to achieve unprecedented growth.");
  const [ctaText, setCtaText] = useState("Get Started Today");
  const [ctaLink, setCtaLink] = useState("/signup");

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    { id: 'test-1', author: 'Alice Johnson', role: 'CEO, Innovate Solutions', text: 'This platform transformed our marketing strategy!' },
    { id: 'test-2', author: 'Bob Williams', text: 'Incredible value and easy to use.' },
  ]);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>(undefined);

  const [features, setFeatures] = useState<Feature[]>([
    { id: 'feat-1', title: 'AI-Powered Insights', description: 'Leverage advanced AI to gain deep market understanding and predict trends.' },
    { id: 'feat-2', title: 'Comprehensive Course Library', description: 'Access a vast collection of courses designed for every stage of your business journey.' },
  ]);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setHeroVideoFileName(file.name);
      toast.success(`Video "${file.name}" uploaded successfully!`);
    }
  };

  const handleSaveHeroSection = () => {
    console.log("Saving Hero Section:", { heroTitle, heroDescription, ctaText, ctaLink });
    toast.success("Hero section content saved!");
  };

  // Testimonial Handlers
  const handleOpenAddTestimonialModal = () => {
    setEditingTestimonial(undefined);
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonialModal = (id: string) => {
    const testimonialToEdit = testimonials.find(t => t.id === id);
    setEditingTestimonial(testimonialToEdit);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (testimonialData: Omit<Testimonial, 'id'>) => {
    if (editingTestimonial) {
      setTestimonials(prev =>
        prev.map(t => (t.id === editingTestimonial.id ? { ...t, ...testimonialData } : t))
      );
      toast.success("Testimonial updated successfully!");
    } else {
      const newTestimonial: Testimonial = {
        id: `test-${Date.now()}`,
        ...testimonialData,
      };
      setTestimonials(prev => [...prev, newTestimonial]);
      toast.success("New testimonial added successfully!");
    }
    setIsTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast.success("Testimonial deleted successfully!");
  };

  // Feature Handlers
  const handleOpenAddFeatureModal = () => {
    setEditingFeature(undefined);
    setIsFeatureModalOpen(true);
  };

  const handleOpenEditFeatureModal = (id: string) => {
    const featureToEdit = features.find(f => f.id === id);
    setEditingFeature(featureToEdit);
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = (featureData: Omit<Feature, 'id'>) => {
    if (editingFeature) {
      setFeatures(prev =>
        prev.map(f => (f.id === editingFeature.id ? { ...f, ...featureData } : f))
      );
      toast.success("Feature updated successfully!");
    } else {
      const newFeature: Feature = {
        id: `feat-${Date.now()}`,
        ...featureData,
      };
      setFeatures(prev => [...prev, newFeature]);
      toast.success("New feature added successfully!");
    }
    setIsFeatureModalOpen(false);
  };

  const handleDeleteFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
    toast.success("Feature deleted successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Landing Page Management</h2>

      {/* Portal Selector */}
      <div className="mb-6">
        <label htmlFor="portal-select-landing" className="block text-sm font-medium text-slate-700 mb-1">Select Portal</label>
        <Select defaultValue="business-owner">
          <SelectTrigger id="portal-select-landing" className="w-full md:w-1/3">
            <SelectValue placeholder="Select a portal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business-owner">Business Owner Portal</SelectItem>
            <SelectItem value="founder">Founder Portal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
        <div className="space-y-2">
          <Label htmlFor="hero-title">Hero Title</Label>
          <Input
            id="hero-title"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Enter hero title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero-description">Hero Description</Label>
          <Textarea
            id="hero-description"
            rows={3}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            placeholder="Enter hero description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-text">Call-to-Action Button Text</Label>
          <Input
            id="cta-text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="e.g., Learn More"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta-link">Call-to-Action Button Link</Label>
          <Input
            id="cta-link"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="e.g., /courses"
          />
        </div>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <p className="font-medium mb-2">{heroVideoFileName}</p>
          <p className="text-sm text-slate-500 mb-4">(mediaId: med_xyz789)</p>
          <label htmlFor="hero-video-upload" className="relative cursor-pointer bg-indigo-600 text-white font-semibold hover:bg-indigo-700 px-4 py-2 rounded-md">
            <span>Upload New Video</span>
            <Input id="hero-video-upload" name="hero-video-upload" type="file" className="sr-only" onChange={handleVideoUpload} />
          </label>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveHeroSection} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            Save Hero Section
          </Button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <Button onClick={handleOpenAddTestimonialModal} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Testimonial</Button>
        </div>
        {testimonials.length === 0 ? (
          <p className="text-slate-500">No testimonials added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map(testimonial => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={() => handleOpenEditTestimonialModal(testimonial.id)}
                onDelete={() => handleDeleteTestimonial(testimonial.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <Button onClick={handleOpenAddFeatureModal} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Feature</Button>
        </div>
        {features.length === 0 ? (
          <p className="text-slate-500">No features added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onEdit={() => handleOpenEditFeatureModal(feature.id)}
                onDelete={() => handleDeleteFeature(feature.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AddEditTestimonialModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onSave={handleSaveTestimonial}
        initialTestimonial={editingTestimonial}
      />

      <AddEditFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onSave={handleSaveFeature}
        initialFeature={editingFeature}
      />
    </div>
  );
};

export default LandingPage;