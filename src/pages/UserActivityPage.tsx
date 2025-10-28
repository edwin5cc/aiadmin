"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, Eye } from 'lucide-react';
import UserActivityDetailModal from '@/components/UserActivityDetailModal';
import { Button } from '@/components/ui/button';
import { userActivitiesApi } from '@/services/api';
import { UserActivity as APIUserActivity } from '@/types/api';
import { showError } from '@/utils/toast';

interface UserActivity {
  id: string;
  user: string;
  type: 'chat' | 'upload';
  details: string;
  timestamp: string;
  fullContent?: string;
}

const UserActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  // Load activities on mount
  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const response = await userActivitiesApi.getUserActivities({
        page: currentPage,
        limit: 20,
      });

      if (!response.error) {
        // Map API response to UI format
        const mappedActivities: UserActivity[] = response.data.map((activity: APIUserActivity) => ({
          id: activity.id,
          user: activity.user_name,
          type: 'chat' as const,
          details: activity.action_summary,
          timestamp: new Date(activity.create_at).toLocaleString(),
        }));

        setActivities(mappedActivities);
        setPagination(response.pagination);
      } else {
        showError('Failed to load user activities');
      }
    } catch (error) {
      console.error('Error loading user activities:', error);
      showError('Failed to load user activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (activity: UserActivity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const getActivityIcon = () => {
    return <MessageSquare className="h-4 w-4 text-indigo-600" />;
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">User Activity Log</h2>

      <Card>
        <CardHeader>
          <CardTitle>Frontend Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">No activities found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {getActivityIcon()}
                      </TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell className="text-right text-slate-500 text-sm">
                        <div className="flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(activity)}
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                    disabled={currentPage === pagination.total_pages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  );
};

export default UserActivityPage;