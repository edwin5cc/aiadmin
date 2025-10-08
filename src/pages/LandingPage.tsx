import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from 'lucide-react';

const LandingPage = () => {
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

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Hero Video</h3>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <p className="font-medium mb-2">current_video_file_name.mp4</p>
          <p className="text-sm text-slate-500 mb-4">(mediaId: med_xyz789)</p>
          <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Upload New Video</Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;