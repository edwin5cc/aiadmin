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
import ResourceCategoryCard from '@/components/ResourceCategoryCard';
import AddEditCategoryModal from '@/components/AddEditCategoryModal';
import { toast } from "sonner";
import { usePortals, useResources, useCategories, categoriesApi, resourcesApi, ApiError } from '@/hooks/useApi';
import { Portal, Category, ResourceCard } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: 'url' | 'file' | 'text';
  value: string;
  description?: string;
  fileName?: string;
  thumbnail_url?: string;
  file?: File;
}

interface ResourceCategory {
  id: string;
  name: string;
  resources: Resource[];
}

const ResourcesPage = () => {
  const [selectedPortalSlug, setSelectedPortalSlug] = useState<string>('business-owner');
  const [selectedPortalId, setSelectedPortalId] = useState<string>('');
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | undefined>(undefined);
  
  // Specific loading states for better UX
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isCreatingResource, setIsCreatingResource] = useState(false);
  const [isUpdatingResource, setIsUpdatingResource] = useState(false);
  const [isDeletingResource, setIsDeletingResource] = useState(false);

  // Get authentication status
  const { isAuthenticated, user } = useAuth();
  
  // Debug authentication
  useEffect(() => {
    console.log('Authentication status:', isAuthenticated);
    console.log('User data:', user);
  }, [isAuthenticated, user]);

  // Fetch portals
  const { data: portalsData, isLoading: portalsLoading, error: portalsError } = usePortals();
  
  // Fetch categories for selected portal
  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories(selectedPortalId);
  
  // Debug categories data
  useEffect(() => {
    console.log('=== CATEGORIES DEBUG ===');
    console.log('Selected portal slug:', selectedPortalSlug);
    console.log('Selected portal ID:', selectedPortalId);
    console.log('Categories data:', categoriesData);
    console.log('Categories loading:', categoriesLoading);
    console.log('========================');
  }, [categoriesData, categoriesLoading, selectedPortalId, selectedPortalSlug]);
  
  // Fetch resources for selected portal
  const { data: resourcesData, isLoading: resourcesLoading, refetch: refetchResources } = useResources({
    portal_id: selectedPortalId,
  });

  // Update selected portal ID when portal slug changes
  useEffect(() => {
    if (portalsData?.portals) {
      const selectedPortal = portalsData.portals.find((portal: Portal) => portal.slug === selectedPortalSlug);
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
  }, [selectedPortalSlug, portalsData]);

  // Transform backend data to frontend format
  useEffect(() => {
    if (categoriesData?.categories) {
      console.log('=== DATA TRANSFORMATION DEBUG ===');
      console.log('Categories from API:', categoriesData.categories);
      console.log('Expected portal ID:', selectedPortalId);
      
      // Filter categories by portal_id on frontend (backend not filtering properly)
      const filteredCategories = categoriesData.categories.filter((category: any) => {
        const matches = category.portal_id === selectedPortalId;
        console.log(`Category "${category.name}" portal_id: ${category.portal_id}, matches: ${matches}`);
        return matches;
      });
      
      console.log('Filtered categories:', filteredCategories);
      
      // Check if categories have portal_id field
      filteredCategories.forEach((category: Category, index: number) => {
        console.log(`Filtered Category ${index}:`, category);
        if ('portal_id' in category) {
          console.log(`Filtered Category ${index} portal_id:`, (category as any).portal_id);
        }
      });
      
      // Create a map of category IDs to names
      const categoryMap = new Map<string, string>();
      filteredCategories.forEach((category: Category) => {
        categoryMap.set(category.id, category.name);
      });
      
      // Group resources by category
      const categoriesMap = new Map<string, ResourceCategory>();
      
      // First, create categories from the filtered categories API (even if they have no resources)
      filteredCategories.forEach((category: Category) => {
        categoriesMap.set(category.id, {
          id: category.id,
          name: category.name,
          resources: []
        });
      });
      
      // Then, add resources to their respective categories
      if (resourcesData?.resources) {
        resourcesData.resources.forEach((resource: ResourceCard) => {
          const categoryId = resource.category_id || 'uncategorized';
          
          // If resource has no category, create an uncategorized one
          if (!resource.category_id) {
            if (!categoriesMap.has('uncategorized')) {
              categoriesMap.set('uncategorized', {
                id: 'uncategorized',
                name: 'Uncategorized',
                resources: []
              });
            }
          }
          
          const category = categoriesMap.get(categoryId);
          if (category) {
            // Determine the resource type and value based on the ResourceCard data
            let resourceType: 'url' | 'file' | 'text' = 'url';
            let resourceValue = '';
            
            if (resource.type === 'url' && resource.url) {
              resourceType = 'url';
              resourceValue = resource.url;
            } else if (resource.type === 'text' && resource.text_content) {
              resourceType = 'text';
              resourceValue = resource.text_content;
            } else if (resource.type === 'file' && resource.file_url) {
              resourceType = 'file';
              resourceValue = resource.file_url;
            }
            
            category.resources.push({
              id: resource.id,
              name: resource.title,
              type: resourceType,
              value: resourceValue,
              description: resource.description,
              thumbnail_url: resource.thumbnail_url,
            });
          }
        });
      }
      
      const finalCategories = Array.from(categoriesMap.values());
      console.log('Final resource categories:', finalCategories);
      console.log('=====================================');
      setResourceCategories(finalCategories);
    }
  }, [resourcesData, categoriesData, selectedPortalId]);

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(undefined);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (categoryId: string, categoryName: string) => {
    setEditingCategory({ id: categoryId, name: categoryName });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string) => {
    if (!selectedPortalId) {
      toast.error("Please select a portal first");
      return;
    }

    if (editingCategory) {
      setIsUpdatingCategory(true);
      toast.loading("Updating category...", { id: "update-category" });
    } else {
      setIsCreatingCategory(true);
      toast.loading("Creating category...", { id: "create-category" });
    }

    try {
      if (editingCategory) {
        // Update existing category
        await categoriesApi.updateCategory(editingCategory.id, { 
          portal_id: selectedPortalId,
          name 
        });
        toast.success("✅ Category updated successfully!", { 
          id: "update-category",
          duration: 4000,
          description: "The category has been updated."
        });
      } else {
        // Create new category
        await categoriesApi.createCategory({ 
          portal_id: selectedPortalId,
          name 
        });
        toast.success("✅ Category created successfully!", { 
        id: "create-category",
        duration: 4000,
        description: "The category has been added to your portal."
      });
      }
      
      // Refresh categories and resources to show updated data
      refetchCategories();
      refetchResources();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || "Failed to save category";
      toast.error(`❌ ${errorMessage}`, { 
        id: editingCategory ? "update-category" : "create-category",
        duration: 5000,
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      if (editingCategory) {
        setIsUpdatingCategory(false);
      } else {
        setIsCreatingCategory(false);
      }
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    console.log('=== DELETE CATEGORY DEBUG ===');
    console.log('Category ID:', categoryId);
    console.log('Selected Portal ID:', selectedPortalId);
    console.log('Authentication status:', isAuthenticated);
    console.log('=============================');
    
    setIsDeletingCategory(true);
    toast.loading("Deleting category...", { id: "delete-category" });
    
    try {
      console.log('Calling categoriesApi.deleteCategory with ID:', categoryId);
      const result = await categoriesApi.deleteCategory(categoryId);
      console.log('Delete category result:', result);
      
      toast.success("✅ Category deleted successfully!", { 
        id: "delete-category",
        duration: 4000,
        description: "The category and all its resources have been removed."
      });
      refetchCategories();
      refetchResources();
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Category deletion error:', apiError);
      console.error('Error status:', apiError.status);
      console.error('Error response:', apiError.response);
      console.error('Error message:', apiError.message);
      
      let errorMessage = apiError.message || "Failed to delete category";
      
      // Handle specific error cases
      if (apiError.status === 400) {
        errorMessage = "Cannot delete category that is being used by resources";
      } else if (apiError.status === 404) {
        errorMessage = "Category not found";
      } else if (apiError.status === 403) {
        errorMessage = "You don't have permission to delete this category";
      }
      
      toast.error(`❌ ${errorMessage}`, { 
        id: "delete-category",
        duration: 5000,
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleAddResource = async (categoryId: string, resourceData: Omit<Resource, 'id'>) => {
    console.log('handleAddResource called with:', { categoryId, resourceData, selectedPortalId });
    
    if (!selectedPortalId) {
      console.error('No portal selected! selectedPortalId:', selectedPortalId);
      toast.error("Please select a portal first");
      return;
    }

    setIsCreatingResource(true);
    toast.loading("Adding resource...", { id: "add-resource" });

    try {
      // Validate based on resource type
      if (resourceData.type === 'url' && resourceData.value) {
        try {
          new URL(resourceData.value);
        } catch {
          toast.error("❌ Please enter a valid URL (e.g., https://example.com)", { id: "add-resource" });
          setIsCreatingResource(false);
          return;
        }
      } else if (resourceData.type === 'text' && !resourceData.value.trim()) {
        toast.error("❌ Please enter text content", { id: "add-resource" });
        setIsCreatingResource(false);
        return;
      } else if (resourceData.type === 'file' && !resourceData.value) {
        toast.error("❌ Please select a file to upload", { id: "add-resource" });
        setIsCreatingResource(false);
        return;
      } else if (resourceData.type === 'file' && !resourceData.file) {
        toast.error("❌ File object is missing", { id: "add-resource" });
        setIsCreatingResource(false);
        return;
      }

      const resourcePayload: any = {
        portal_id: selectedPortalId,
        title: resourceData.name,
        description: resourceData.description,
        type: resourceData.type,
        display_order: 1,
        is_published: true,
      };

      // Add type-specific fields
      if (resourceData.type === 'url') {
        resourcePayload.url = resourceData.value;
      } else if (resourceData.type === 'text') {
        resourcePayload.text_content = resourceData.value;
      } else if (resourceData.type === 'file' && resourceData.file) {
        resourcePayload.file = resourceData.file;
      }

      // Only add category_id if it's not uncategorized
      if (categoryId !== 'uncategorized') {
        resourcePayload.category_id = categoryId;
      }

      // Add thumbnail_url if provided (for future enhancement)
      if (resourceData.thumbnail_url) {
        resourcePayload.thumbnail_url = resourceData.thumbnail_url;
      }

      console.log('Creating resource with payload:', resourcePayload);
      console.log('Resource type:', resourceData.type);
      console.log('Selected portal ID:', selectedPortalId);
      console.log('File object:', resourceData.file);
      console.log('File name:', resourceData.fileName);
      console.log('Resource data keys:', Object.keys(resourceData));
      console.log('Resource payload keys:', Object.keys(resourcePayload));
      
      const result = await resourcesApi.createResource(resourcePayload);
      
      toast.success("✅ Resource added successfully!", { 
        id: "add-resource",
        duration: 4000,
        description: "The resource has been added to the category."
      });
      refetchResources();
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Resource creation error:', apiError);
      console.error('Error response:', apiError.response);
      
      let errorMessage = apiError.message || "Failed to add resource";
      
      // Handle specific validation errors
      if (apiError.response?.validation) {
        console.log('Validation errors:', apiError.response.validation);
        const validationErrors = apiError.response.validation
          .map((v: any) => `${v.field}: ${v.message}`)
          .join(', ');
        errorMessage = `Validation failed: ${validationErrors}`;
      }
      
      toast.error(`❌ ${errorMessage}`, { 
        id: "add-resource",
        duration: 5000,
        description: "Please check your input and try again."
      });
    } finally {
      setIsCreatingResource(false);
    }
  };

  const handleEditResource = async (categoryId: string, resourceId: string, updatedResourceData: Omit<Resource, 'id'>) => {
    setIsUpdatingResource(true);
    toast.loading("Updating resource...", { id: "update-resource" });
    
    try {
      // Validate based on resource type
      if (updatedResourceData.type === 'url' && updatedResourceData.value) {
        try {
          new URL(updatedResourceData.value);
        } catch {
          toast.error("❌ Please enter a valid URL (e.g., https://example.com)", { id: "update-resource" });
          setIsUpdatingResource(false);
          return;
        }
      } else if (updatedResourceData.type === 'text' && !updatedResourceData.value.trim()) {
        toast.error("❌ Please enter text content", { id: "update-resource" });
        setIsUpdatingResource(false);
        return;
      }

      const updatePayload: any = {
        title: updatedResourceData.name,
        description: updatedResourceData.description,
        type: updatedResourceData.type,
        is_published: true, // Default to published
      };

      // Add type-specific fields
      if (updatedResourceData.type === 'url') {
        updatePayload.url = updatedResourceData.value;
      } else if (updatedResourceData.type === 'text') {
        updatePayload.text_content = updatedResourceData.value;
      } else if (updatedResourceData.type === 'file') {
        updatePayload.file_url = updatedResourceData.value;
      }

      // Only add category_id if it's not uncategorized
      if (categoryId !== 'uncategorized') {
        updatePayload.category_id = categoryId;
      }
      
      await resourcesApi.updateResource(resourceId, updatePayload);
      
      toast.success("✅ Resource updated successfully!", { 
        id: "update-resource",
        duration: 4000,
        description: "The resource has been updated."
      });
      refetchResources();
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Resource update error:', apiError);
      
      let errorMessage = apiError.message || "Failed to update resource";
      
      // Handle specific validation errors
      if (apiError.response?.validation) {
        const validationErrors = apiError.response.validation
          .map((v: any) => `${v.field}: ${v.message}`)
          .join(', ');
        errorMessage = `Validation failed: ${validationErrors}`;
      }
      
      toast.error(`❌ ${errorMessage}`, { 
        id: "update-resource",
        duration: 5000,
        description: "Please check your input and try again."
      });
    } finally {
      setIsUpdatingResource(false);
    }
  };

  const handleDeleteResource = async (categoryId: string, resourceId: string) => {
    // Check if resourceId is valid
    if (!resourceId || resourceId === 'undefined' || resourceId === 'null') {
      toast.error("❌ Invalid resource ID", { id: "delete-resource" });
      return;
    }
    
    setIsDeletingResource(true);
    toast.loading("Deleting resource...", { id: "delete-resource" });
    
    try {
      await resourcesApi.deleteResource(resourceId);
      
      toast.success("✅ Resource deleted successfully!", { 
        id: "delete-resource",
        duration: 4000,
        description: "The resource has been removed from the category."
      });
      refetchResources();
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Resource deletion error:', apiError);
      
      let errorMessage = apiError.message || "Failed to delete resource";
      
      // Handle specific error cases
      if (apiError.status === 404) {
        errorMessage = "Resource not found";
      } else if (apiError.status === 403) {
        errorMessage = "You don't have permission to delete this resource";
      } else if (apiError.status === 400) {
        errorMessage = "Invalid request - resource cannot be deleted";
      } else if (apiError.status === 401) {
        errorMessage = "Authentication failed - please login again";
      }
      
      toast.error(`❌ ${errorMessage}`, { 
        id: "delete-resource",
        duration: 5000,
        description: "Please try again or contact support if the issue persists."
      });
    } finally {
      setIsDeletingResource(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Resources</h2>
        <Button 
          onClick={handleOpenAddCategoryModal} 
          className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          disabled={isCreatingCategory || isUpdatingCategory || isDeletingCategory || isCreatingResource || isUpdatingResource || isDeletingResource || !selectedPortalId}
        >
          {isCreatingCategory ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Category...
            </>
          ) : isUpdatingCategory ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Category...
            </>
          ) : isDeletingCategory ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting Category...
            </>
          ) : (
            "Add New Category"
          )}
        </Button>
      </div>

      {/* Portal Selector */}
      <div className="mb-6">
        <label htmlFor="portal-select-resources" className="block text-sm font-medium text-slate-700 mb-1">Select Portal</label>
        <Select value={selectedPortalSlug} onValueChange={setSelectedPortalSlug}>
          <SelectTrigger id="portal-select-resources" className="w-full md:w-1/3">
            <SelectValue placeholder={portalsLoading ? "Loading portals..." : "Select a portal"} />
          </SelectTrigger>
          <SelectContent>
            {portalsLoading ? (
              <SelectItem value="loading" disabled>Loading portals...</SelectItem>
            ) : portalsError ? (
              <>
                <SelectItem value="business-owner">Business Owner Portal</SelectItem>
                <SelectItem value="founder">Founder Portal</SelectItem>
              </>
            ) : portalsData?.portals?.length > 0 ? (
              portalsData.portals.map((portal: Portal) => (
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

      {/* Resource List */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {resourcesLoading || categoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-indigo-600" />
            <p className="text-slate-500">Loading resources and categories...</p>
          </div>
        ) : resourceCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No resource categories yet.</p>
            <p className="text-sm text-slate-400">Add a category above to get started!</p>
          </div>
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
              isLoading={{
                isCreatingCategory,
                isUpdatingCategory,
                isDeletingCategory,
                isCreatingResource,
                isUpdatingResource,
                isDeletingResource
              }}
            />
          ))
        )}
      </div>

      <AddEditCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialName={editingCategory?.name}
        isLoading={isCreatingCategory || isUpdatingCategory}
        isEditing={!!editingCategory}
      />
    </div>
  );
};

export default ResourcesPage;