"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Link, FileText, Text, Loader2 } from 'lucide-react';
import AddEditResourceModal from './AddEditResourceModal';
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  type: 'url' | 'file' | 'text';
  value: string; // URL, file ID/name, or text content
  description?: string; // New optional description field
  fileName?: string; // Only for type 'file'
  thumbnail_url?: string;
  file?: File;
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
  isLoading?: {
    isCreatingCategory: boolean;
    isUpdatingCategory: boolean;
    isDeletingCategory: boolean;
    isCreatingResource: boolean;
    isUpdatingResource: boolean;
    isDeletingResource: boolean;
  };
}

const ResourceCategoryCard: React.FC<ResourceCategoryCardProps> = ({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddResource,
  onEditResource,
  onDeleteResource,
  isLoading = {
    isCreatingCategory: false,
    isUpdatingCategory: false,
    isDeletingCategory: false,
    isCreatingResource: false,
    isUpdatingResource: false,
    isDeletingResource: false,
  },
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
    } else {
      onAddResource(category.id, resourceData);
    }
    setIsResourceModalOpen(false);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'url':
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEditCategory(category.id, category.name)}
            disabled={isLoading.isUpdatingCategory || isLoading.isDeletingCategory || isLoading.isCreatingResource || isLoading.isUpdatingResource || isLoading.isDeletingResource}
          >
            {isLoading.isUpdatingCategory ? (
              <Loader2 className="h-4 w-4 text-slate-600 animate-spin" />
            ) : (
              <Edit className="h-4 w-4 text-slate-600" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              console.log('Delete category button clicked for category:', category.id);
              onDeleteCategory(category.id);
            }}
            disabled={isLoading.isUpdatingCategory || isLoading.isDeletingCategory || isLoading.isCreatingResource || isLoading.isUpdatingResource || isLoading.isDeletingResource}
          >
            {isLoading.isDeletingCategory ? (
              <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-600" />
            )}
          </Button>
          <Button 
            variant="link" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800" 
            onClick={handleOpenAddResourceModal}
            disabled={isLoading.isUpdatingCategory || isLoading.isDeletingCategory || isLoading.isCreatingResource || isLoading.isUpdatingResource || isLoading.isDeletingResource}
          >
            {isLoading.isCreatingResource ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Adding...
              </>
            ) : (
              "+ Add Resource"
            )}
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
                  {resource.description && <p className="text-xs text-slate-500">{resource.description}</p>} {/* Display description */}
                  <p className="text-xs text-slate-400">
                    {resource.type === 'url' && `URL: ${resource.value.substring(0, 30)}...`}
                    {resource.type === 'file' && `File: ${resource.fileName || resource.value}`}
                    {resource.type === 'text' && `Content: ${resource.value.substring(0, 30)}...`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {resource.type === 'file' && resource.value ? (
                  <Button 
                    variant="link" 
                    className="text-sm font-medium text-green-600 hover:text-green-800" 
                    onClick={() => window.open(resource.value, '_blank')}
                  >
                    View File
                  </Button>
                ) : null}
                <Button 
                  variant="link" 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800" 
                  onClick={() => handleOpenEditResourceModal(resource)}
                  disabled={isLoading.isUpdatingCategory || isLoading.isDeletingCategory || isLoading.isCreatingResource || isLoading.isUpdatingResource || isLoading.isDeletingResource}
                >
                  {isLoading.isUpdatingResource ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Edit"
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDeleteResource(category.id, resource.id)}
                  disabled={isLoading.isUpdatingCategory || isLoading.isDeletingCategory || isLoading.isCreatingResource || isLoading.isUpdatingResource || isLoading.isDeletingResource}
                >
                  {isLoading.isDeletingResource ? (
                    <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-600" />
                  )}
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