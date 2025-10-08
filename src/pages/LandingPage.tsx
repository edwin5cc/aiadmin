"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';
import { toast } from "sonner";

const LandingPage = () => {
  const [heroVideoFileName, setHeroVideoFileName] = useState("current_video_file_name.mp4");

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setHeroVideoFileName(file.name);
      toast.success(`Video "${file.name}" uploaded successfully!`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Landing Page Management</h2>

      {/* Hero Section - Simplified */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Hero Section Video</h3>
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
          <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
            Save Hero Section Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;