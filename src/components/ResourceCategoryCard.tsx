"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Link, FileText, Text } from 'lucide-react';
import AddEditResourceModal from './AddEditResourceModal';
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  type: 'link' | 'file' | 'text';
  value: string; // URL, file ID/name, or text content
  fileName?: string; // Only for type 'file'
}

interface ResourceCategoryCardProps {
  category: {
    id: string;
    name: string;
    resources: Resource[];
  };
  onEditCategory: (categoryId: string, newName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddResource: (categoryId: string, resource: Omit<Resource, 'id'>) => void;
  onEditResource: (categoryId: string, resourceId: string, updatedResource: Omit<Resource, 'id'>) => void;
  onDeleteResource: (categoryId: string, resourceId: string) => void;
}

const ResourceCategoryCard: React.FC<ResourceCategoryCardProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddResource,
  onEditResource,
  onDeleteResource,
}) => {
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);

  const handleOpenAddResourceModal = () => {
    setEditingResource(undefined);
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResourceModal = (resource: Resource) => {
    setEditingResource(resource);
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = (resourceData: Omit<Resource, 'id'>) => {
    if (editingResource) {
      onEditResource(category.id, editingResource.id, resourceData);
      toast.success("Resource updated successfully!");
    } else {
      onAddResource(category.id, resourceData);
      toast.success("Resource added successfully!");
    }
    setIsResourceModalOpen(false);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <Link className="h-4 w-4 mr-2 text-slate-500" />;
      case 'file':
        return <FileText className="h-4 w-4 mr-2 text-slate-500" />;
      case 'text':
        return <Text className="h-4 w-4 mr-2 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEditCategory(category.id, category.name)}>
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDeleteCategory(category.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
          <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={handleOpenAddResourceModal}>
            + Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pl-4 border-l-2 border-slate-200 space-y-2">
        {category.resources.length === 0 ? (
          <p className="text-sm text-slate-500">No resources in this category yet.</p>
        ) : (
          category.resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
              <div className="flex items-center">
                {getResourceIcon(resource.type)}
                <div>
                  <p className="font-medium">{resource.name}</p>
                  <p className="text-xs text-slate-400">
                    {resource.type === 'link' && `URL: ${resource.value.substring(0, 30)}...`}
                    {resource.type === 'file' && `File: ${resource.fileName || resource.value}`}
                    {resource.type === 'text' && `Content: ${resource.value.substring(0, 30)}...`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="link" className="text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => handleOpenEditResourceModal(resource)}>Edit</Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteResource(category.id, resource.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <AddEditResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSave={handleSaveResource}
        initialResource={editingResource ? { ...editingResource, fileName: editingResource.fileName } : undefined}
      />
    </Card>
  );
};

export default ResourceCategoryCard;