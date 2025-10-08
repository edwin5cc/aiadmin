"use client";

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
import AddEditLessonModal from '@/components/AddEditLessonModal'; // Updated import
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  transcript?: string;
  fileName?: string;
}

interface Course {
  id: string;
  title: string;
  status: 'Published' | 'Draft';
  lessons: Lesson[];
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'course-1',
      title: 'The Complete Marketing Masterclass',
      status: 'Published',
      lessons: [
        { id: 'lesson-1', title: 'Introduction to Marketing', videoId: 'med_1a2b3c', duration: '12:34', fileName: 'intro_marketing.mp4' },
        { id: 'lesson-2', title: 'Understanding Your Customer', videoId: 'med_4d5e6f', duration: '25:10', fileName: 'customer_understanding.mp4' },
      ],
    },
    {
      id: 'course-2',
      title: 'Financial Planning for Entrepreneurs',
      status: 'Draft',
      lessons: [],
    },
  ]);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentEditingLesson, setCurrentEditingLesson] = useState<Lesson | undefined>(undefined);
  const [currentCourseIdForLesson, setCurrentCourseIdForLesson] = useState<string | undefined>(undefined);

  const handleOpenAddLessonModal = (courseId: string) => {
    setCurrentEditingLesson(undefined); // Clear for adding
    setCurrentCourseIdForLesson(courseId);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLessonModal = (courseId: string, lesson: Lesson) => {
    setCurrentEditingLesson(lesson);
    setCurrentCourseIdForLesson(courseId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
    setCurrentEditingLesson(undefined);
    setCurrentCourseIdForLesson(undefined);
  };

  const handleSaveLesson = (lessonData: Omit<Lesson, 'id'> & { id?: string }) => {
    if (!currentCourseIdForLesson) return;

    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id === currentCourseIdForLesson) {
          if (lessonData.id) {
            // Editing existing lesson
            toast.success(`Lesson "${lessonData.title}" updated successfully!`);
            return {
              ...course,
              lessons: course.lessons.map(lesson =>
                lesson.id === lessonData.id ? { ...lesson, ...lessonData } : lesson
              ),
            };
          } else {
            // Adding new lesson
            const newLesson: Lesson = {
              ...lessonData,
              id: `lesson-${Date.now()}`, // Simple ID generation
            };
            toast.success(`New lesson "${newLesson.title}" added successfully!`);
            return {
              ...course,
              lessons: [...course.lessons, newLesson],
            };
          }
        }
        return course;
      })
    );
    handleCloseLessonModal();
  };

  const handleDeleteLesson = (courseId: string, lessonId: string, lessonTitle: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, lessons: course.lessons.filter(lesson => lesson.id !== lessonId) }
          : course
      )
    );
    toast.success(`Lesson "${lessonTitle}" deleted successfully!`);
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
          {courses.map(course => (
            <AccordionItem key={course.id} value={course.id} className="border p-4 rounded-lg">
              <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
                <div className="flex-grow">
                  <h4 className="text-lg font-bold">{course.title}</h4>
                  <p className="text-sm text-slate-500">{course.lessons.length} Lessons | {course.status}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="secondary" size="sm" className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300">Edit Course</Button>
                  <Button variant="destructive" size="sm" className="text-sm bg-red-100 text-red-700 font-semibold hover:bg-red-200">Delete</Button>
                </div >
              </AccordionTrigger>
              <AccordionContent className="mt-4 pl-4 border-l-2 border-slate-200 space-y-2">
                {course.lessons.length === 0 ? (
                  <p className="text-sm text-slate-500">No lessons added yet. Click below to add one.</p>
                ) : (
                  course.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-xs text-slate-400">Video ID: {lesson.videoId} | {lesson.duration}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="link"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleOpenEditLessonModal(course.id, lesson)}
                        >
                          Edit Lesson
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLesson(course.id, lesson.id, lesson.title)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  variant="link"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-2"
                  onClick={() => handleOpenAddLessonModal(course.id)}
                >
                  + Add New Lesson
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <AddEditLessonModal
        isOpen={isLessonModalOpen}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        initialLesson={currentEditingLesson}
      />
    </div>
  );
};

export default CoursesPage;