import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResourcesPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Resources</h2>
        <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Category</Button>
      </div>

      {/* Portal Selector */}
      <div className="mb-6">
        <label htmlFor="portal-select-resources" className="block text-sm font-medium text-slate-700 mb-1">Select Portal</label>
        <Select defaultValue="business-owner">
          <SelectTrigger id="portal-select-resources" className="w-full md:w-1/3">
            <SelectValue placeholder="Select a portal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business-owner">Business Owner Portal</SelectItem>
            <SelectItem value="founder">Founder Portal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resource List */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="border p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-bold">Marketing Templates</h4>
            <div>
              <Button variant="secondary" size="sm" className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300">Edit Category</Button>
              <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 ml-2">+ Add Resource</Button>
            </div>
          </div>
          <div className="pl-4 border-l-2 border-slate-200 space-y-2">
            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50">
              <div>
                <p className="font-medium">🔗 Social Media Content Calendar</p>
                <p className="text-xs text-slate-400">Link to Google Sheet</p>
              </div>
              <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50">
              <div>
                <p className="font-medium">📄 Email Campaign Checklist.pdf</p>
                <p className="text-xs text-slate-400">File Upload</p>
              </div>
              <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;