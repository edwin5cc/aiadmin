import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import EditLessonModal from '@/components/EditLessonModal';

const CoursesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLessonTitle, setCurrentLessonTitle] = useState('');

  const handleOpenModal = (lessonTitle: string) => {
    setCurrentLessonTitle(lessonTitle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLessonTitle('');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Courses & Lessons</h2>
        <Button className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Course</Button>
      </div>

      {/* Portal Selector */}
      <div className="mb-6">
        <label htmlFor="portal-select-courses" className="block text-sm font-medium text-slate-700 mb-1">Select Portal</label>
        <Select defaultValue="business-owner">
          <SelectTrigger id="portal-select-courses" className="w-full md:w-1/3">
            <SelectValue placeholder="Select a portal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business-owner">Business Owner Portal</SelectItem>
            <SelectItem value="founder">Founder Portal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course List */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border p-4 rounded-lg">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              <div className="flex-grow">
                <h4 className="text-lg font-bold">The Complete Marketing Masterclass</h4>
                <p className="text-sm text-slate-500">15 Lessons | Published</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="secondary" size="sm" className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300">Edit Course</Button>
                <Button variant="destructive" size="sm" className="text-sm bg-red-100 text-red-700 font-semibold hover:bg-red-200">Delete</Button>
              </div >
            </AccordionTrigger>
            <AccordionContent className="mt-4 pl-4 border-l-2 border-slate-200 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                <div>
                  <p className="font-medium">1. Introduction to Marketing</p>
                  <p className="text-xs text-slate-400">Video ID: med_1a2b3c | 12:34</p>
                </div>
                <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => handleOpenModal("Introduction to Marketing")}>Edit Lesson</Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                <div>
                  <p className="font-medium">2. Understanding Your Customer</p>
                  <p className="text-xs text-slate-400">Video ID: med_4d5e6f | 25:10</p>
                </div>
                <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => handleOpenModal("Understanding Your Customer")}>Edit Lesson</Button>
              </div>
              <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-2">+ Add New Lesson</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border p-4 rounded-lg mt-4">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
              <div className="flex-grow">
                <h4 className="text-lg font-bold">Financial Planning for Entrepreneurs</h4>
                <p className="text-sm text-slate-500">8 Lessons | Draft</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="secondary" size="sm" className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300">Edit Course</Button>
                <Button variant="destructive" size="sm" className="text-sm bg-red-100 text-red-700 font-semibold hover:bg-red-200">Delete</Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-4 pl-4 border-l-2 border-slate-200 space-y-2">
              {/* No lessons shown for draft course in example, but could be added */}
              <p className="text-sm text-slate-500">No lessons added yet. Click below to add one.</p>
              <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-2">+ Add New Lesson</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <EditLessonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lessonTitle={currentLessonTitle}
      />
    </div>
  );
};

export default CoursesPage;