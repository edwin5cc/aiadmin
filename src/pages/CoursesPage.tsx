"use client";

import React, { useState, useEffect } from 'react';
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
import AddEditLessonModal from '@/components/AddEditLessonModal';
import AddEditCourseModal from '@/components/AddEditCourseModal';
import { toast } from "sonner";
import { Trash2, Loader2 } from 'lucide-react';
import { coursesApi, lessonsApi, portalsApi, Portal } from '@/services/api';
import { Course, Lesson } from '@/types/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [selectedPortalSlug, setSelectedPortalSlug] = useState<string>('business-owner');
  const [selectedPortalId, setSelectedPortalId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState<string | null>(null);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState<string | null>(null);
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentEditingLesson, setCurrentEditingLesson] = useState<Lesson | undefined>(undefined);
  const [currentCourseIdForLesson, setCurrentCourseIdForLesson] = useState<string | undefined>(undefined);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [isUpdatingLesson, setIsUpdatingLesson] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState<string | null>(null);

  // Load portals and courses on component mount
  useEffect(() => {
    loadPortals();
  }, []);

  // Update selected portal ID when portal slug changes
  useEffect(() => {
    if (portals.length > 0) {
      const selectedPortal = portals.find((portal: Portal) => portal.slug === selectedPortalSlug);
      if (selectedPortal) {
        setSelectedPortalId(selectedPortal.id);
      }
    } else {
      // Fallback to hardcoded portal IDs if API fails
      const fallbackPortals = [
        { slug: 'business-owner', id: 'ad917aff-a9d7-11f0-9178-5254da9a0f0a', title: 'Business Owner Portal' },
        { slug: 'founder', id: '17816878-834d-4d4d-9591-6f3b82116200', title: 'Founder Portal' }
      ];
      
      const selectedPortal = fallbackPortals.find(portal => portal.slug === selectedPortalSlug);
      if (selectedPortal) {
        setSelectedPortalId(selectedPortal.id);
      }
    }
  }, [selectedPortalSlug, portals]);

  useEffect(() => {
    if (selectedPortalId) {
      loadCourses();
    }
  }, [selectedPortalId]);

  const loadPortals = async () => {
    try {
      const response = await portalsApi.getPortals();
      if (!response.error) {
        setPortals(response.portals);
      }
    } catch (error) {
      console.error('Error loading portals:', error);
      toast.error('Failed to load portals');
    }
  };

  const loadCourses = async () => {
    if (!selectedPortalId) return;
    
    setIsLoading(true);
    try {
      const response = await coursesApi.getCourses({
        portal_id: selectedPortalId,
        include_lessons: true
      });
      if (!response.error) {
        setCourses(response.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateCourseModal = () => {
    if (!selectedPortalId) {
      toast.error('Please select a portal first');
      return;
    }
    setEditingCourse(undefined);
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setEditingCourse(undefined);
  };

  const handleSaveCourse = async (courseData: any) => {
    if (!selectedPortalId) {
      toast.error('Please select a portal first');
      return;
    }

    // Set the correct loading state based on whether we're creating or updating
    if (editingCourse) {
      setIsUpdatingCourse(editingCourse.id);
    } else {
      setIsCreatingCourse(true);
    }

    try {
      if (editingCourse) {
        // Update existing course
        const response = await coursesApi.updateCourse(editingCourse.id, courseData);
        if (!response.error) {
          toast.success('Course updated successfully!');
          loadCourses();
        }
      } else {
        // Create new course
        const response = await coursesApi.createCourse({
          portal_id: selectedPortalId,
          ...courseData,
          display_order: courseData.display_order || courses.length + 1,
        });
        
        if (!response.error) {
          toast.success('Course created successfully!');
          loadCourses();
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(editingCourse ? 'Failed to update course' : 'Failed to create course');
    } finally {
      // Reset the correct loading state
      if (editingCourse) {
        setIsUpdatingCourse(null);
      } else {
        setIsCreatingCourse(false);
      }
      handleCloseCourseModal();
    }
  };

  const handleOpenEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    setIsDeletingCourse(courseId);
    try {
      const response = await coursesApi.deleteCourse(courseId);
      if (!response.error) {
        toast.success(`Course deleted successfully! ${response.deleted_lessons_count} lesson(s) were also deleted.`);
        loadCourses(); // Reload courses
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setIsDeletingCourse(null);
    }
  };

  const handleToggleCourseStatus = async (courseId: string, isPublished: boolean) => {
    setIsUpdatingCourse(courseId);
    try {
      const response = await coursesApi.updateCourse(courseId, {
        is_published: isPublished
      });
      
      if (!response.error) {
        toast.success(`Course ${isPublished ? 'published' : 'unpublished'} successfully!`);
        loadCourses(); // Reload courses
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setIsUpdatingCourse(null);
    }
  };

  const handleOpenAddLessonModal = (courseId: string) => {
    setCurrentEditingLesson(undefined);
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

  const handleSaveLesson = async (lessonData: any) => {
    if (!currentCourseIdForLesson) return;

    if (lessonData.id) {
      // Editing existing lesson
      setIsUpdatingLesson(true);
      try {
        // Check if a file was selected for upload
        if (lessonData.file) {
          // Upload video and update lesson in one operation (this endpoint updates the lesson automatically)
          const uploadResponse = await lessonsApi.uploadVideoAndUpdateLesson(lessonData.id, lessonData.file);
          if (!uploadResponse.error) {
            // The video is now uploaded and lesson has the video_url updated
            // Now update the other lesson fields
            const response = await lessonsApi.updateLesson(lessonData.id, {
              title: lessonData.title,
              description: lessonData.description,
              duration_seconds: lessonData.duration_seconds,
              transcript: lessonData.transcript,
              lesson_number: lessonData.lesson_number,
              display_order: lessonData.display_order,
              is_published: lessonData.is_published
            });
            
            if (!response.error) {
              toast.success(`Lesson "${lessonData.title}" updated successfully with video!`);
              loadCourses();
            }
          }
        } else {
          // No file upload, just update lesson metadata
          const response = await lessonsApi.updateLesson(lessonData.id, {
            title: lessonData.title,
            description: lessonData.description,
            video_url: lessonData.video_url,
            video_provider: lessonData.video_provider || 's3',
            duration_seconds: lessonData.duration_seconds,
            transcript: lessonData.transcript,
            lesson_number: lessonData.lesson_number,
            display_order: lessonData.display_order,
            is_published: lessonData.is_published
          });
          
          if (!response.error) {
            toast.success(`Lesson "${lessonData.title}" updated successfully!`);
            loadCourses();
          }
        }
      } catch (error) {
        console.error('Error updating lesson:', error);
        toast.error('Failed to update lesson');
      } finally {
        setIsUpdatingLesson(false);
        handleCloseLessonModal();
      }
    } else {
      // Adding new lesson
      setIsCreatingLesson(true);
      try {
        let videoUrl = lessonData.video_url;
        let videoProvider = lessonData.video_provider || 's3';

        // If a file was selected, upload it first
        if (lessonData.file) {
          const uploadResponse = await lessonsApi.uploadVideo(lessonData.file);
          if (!uploadResponse.error) {
            videoUrl = uploadResponse.video_url;
            videoProvider = uploadResponse.video_provider;
          }
        }

        // Create the lesson with video info
        const response = await lessonsApi.createLesson({
          course_id: currentCourseIdForLesson,
          title: lessonData.title,
          description: lessonData.description,
          video_url: videoUrl,
          video_provider: videoProvider,
          duration_seconds: lessonData.duration_seconds,
          transcript: lessonData.transcript,
          lesson_number: lessonData.lesson_number || 1,
          display_order: lessonData.display_order || 1,
          is_published: lessonData.is_published || false
        });
        
        if (!response.error) {
          toast.success(`New lesson "${lessonData.title}" added successfully!`);
          loadCourses();
        }
      } catch (error) {
        console.error('Error creating lesson:', error);
        toast.error('Failed to create lesson');
      } finally {
        setIsCreatingLesson(false);
        handleCloseLessonModal();
      }
    }
  };

  const handleDeleteLesson = async (courseId: string, lessonId: string, lessonTitle: string) => {
    setIsDeletingLesson(lessonId);
    try {
      const response = await lessonsApi.deleteLesson(lessonId);
      if (!response.error) {
        toast.success(`Lesson "${lessonTitle}" deleted successfully!`);
        loadCourses(); // Reload courses to reflect deletion
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    } finally {
      setIsDeletingLesson(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Courses & Lessons</h2>
        <Button 
          onClick={handleOpenCreateCourseModal}
          disabled={isCreatingCourse || !selectedPortalId}
          className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Add New Course
        </Button>
      </div>

      {/* Portal Selector */}
      <div className="mb-6">
        <label htmlFor="portal-select-courses" className="block text-sm font-medium text-slate-700 mb-1">Select Portal</label>
        <Select value={selectedPortalSlug} onValueChange={setSelectedPortalSlug}>
          <SelectTrigger id="portal-select-courses" className="w-full md:w-1/3">
            <SelectValue placeholder="Select a portal" />
          </SelectTrigger>
          <SelectContent>
            {portals.length > 0 ? (
              portals.map((portal: Portal) => (
                <SelectItem key={portal.id} value={portal.slug}>
                  {portal.slug === 'business-owner' ? 'Business Owner Portal' : 
                   portal.slug === 'founder' ? 'Founder Portal' : 
                   portal.title}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="business-owner">Business Owner Portal</SelectItem>
                <SelectItem value="founder">Founder Portal</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-slate-600">Loading courses...</span>
        </div>
      ) : (
        /* Course List */
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {courses.map(course => (
              <AccordionItem key={course.id} value={course.id} className="border p-4 rounded-lg">
                <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold">{course.title}</h4>
                    <p className="text-sm text-slate-500">
                      {course.lessons_count || 0} Lessons | {course.is_published ? 'Published' : 'Draft'}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                      onClick={() => handleOpenEditCourseModal(course)}
                      disabled={isUpdatingCourse === course.id}
                    >
                      Edit Course
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-sm bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300"
                      onClick={() => handleToggleCourseStatus(course.id, !course.is_published)}
                      disabled={isUpdatingCourse === course.id}
                    >
                      {isUpdatingCourse === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        course.is_published ? 'Unpublish' : 'Publish'
                      )}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="text-sm bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={isDeletingCourse === course.id}
                    >
                      {isDeletingCourse === course.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-4 pl-4 border-l-2 border-slate-200 space-y-2">
                  {course.lessons && course.lessons.length === 0 ? (
                    <p className="text-sm text-slate-500">No lessons added yet. Click below to add one.</p>
                  ) : (
                    course.lessons?.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-xs text-slate-400">
                            {lesson.video_provider || 'Unknown'} | {lesson.duration_seconds ? `${Math.floor(lesson.duration_seconds / 60)}:${(lesson.duration_seconds % 60).toString().padStart(2, '0')}` : 'No duration'}
                          </p>
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
                            disabled={isDeletingLesson === lesson.id}
                          >
                            {isDeletingLesson === lesson.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-600" />
                            )}
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
      )}

      <AddEditCourseModal
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        onSave={handleSaveCourse}
        initialCourse={editingCourse}
        isLoading={isCreatingCourse || (editingCourse && isUpdatingCourse === editingCourse.id)}
      />

      <AddEditLessonModal
        isOpen={isLessonModalOpen}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        initialLesson={currentEditingLesson}
        isLoading={isCreatingLesson || isUpdatingLesson}
      />
    </div>
  );
};

export default CoursesPage;