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
import ResourceCategoryCard from '@/components/ResourceCategoryCard';
import AddEditCategoryModal from '@/components/AddEditCategoryModal';
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  type: 'link' | 'file' | 'text';
  value: string;
  fileName?: string;
}

interface ResourceCategory {
  id: string;
  name: string;
  resources: Resource[];
}

const ResourcesPage = () => {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([
    {
      id: 'cat-1',
      name: 'Marketing Templates',
      resources: [
        { id: 'res-1', name: 'Social Media Content Calendar', type: 'link', value: 'https://docs.google.com/spreadsheets/d/...' },
        { id: 'res-2', name: 'Email Campaign Checklist.pdf', type: 'file', value: 'file-upload-email-checklist.pdf', fileName: 'Email Campaign Checklist.pdf' },
      ],
    },
    {
      id: 'cat-2',
      name: 'Business Strategy Guides',
      resources: [
        { id: 'res-3', name: 'SWOT Analysis Template', type: 'text', value: 'A SWOT analysis helps identify Strengths, Weaknesses, Opportunities, and Threats...' },
      ],
    },
  ]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | undefined>(undefined);

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(undefined);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (categoryId: string, categoryName: string) => {
    setEditingCategory({ id: categoryId, name: categoryName });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string) => {
    if (editingCategory) {
      setResourceCategories(prev =>
        prev.map(cat => (cat.id === editingCategory.id ? { ...cat, name } : cat))
      );
      toast.success("Category updated successfully!");
    } else {
      const newCategory: ResourceCategory = {
        id: `cat-${Date.now()}`,
        name,
        resources: [],
      };
      setResourceCategories(prev => [...prev, newCategory]);
      toast.success("New category added successfully!");
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setResourceCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success("Category deleted successfully!");
  };

  const handleAddResource = (categoryId: string, resourceData: Omit<Resource, 'id'>) => {
    setResourceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, resources: [...cat.resources, { ...resourceData, id: `res-${Date.now()}` }] }
          : cat
      )
    );
  };

  const handleEditResource = (categoryId: string, resourceId: string, updatedResourceData: Omit<Resource, 'id'>) => {
    setResourceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              resources: cat.resources.map(res =>
                res.id === resourceId ? { ...res, ...updatedResourceData } : res
              ),
            }
          : cat
      )
    );
  };

  const handleDeleteResource = (categoryId: string, resourceId: string) => {
    setResourceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, resources: cat.resources.filter(res => res.id !== resourceId) }
          : cat
      )
    );
    toast.success("Resource deleted successfully!");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Resources</h2>
        <Button onClick={handleOpenAddCategoryModal} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Add New Category</Button>
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
        {resourceCategories.length === 0 ? (
          <p className="text-slate-500">No resource categories yet. Add one above!</p>
        ) : (
          resourceCategories.map(category => (
            <ResourceCategoryCard
              key={category.id}
              category={category}
              onEditCategory={handleOpenEditCategoryModal}
              onDeleteCategory={handleDeleteCategory}
              onAddResource={handleAddResource}
              onEditResource={handleEditResource}
              onDeleteResource={handleDeleteResource}
            />
          ))
        )}
      </div>

      <AddEditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialName={editingCategory?.name}
      />
    </div>
  );
};

export default ResourcesPage;