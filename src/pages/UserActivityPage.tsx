"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Upload, Clock, Eye } from 'lucide-react'; // Added Eye icon
import UserActivityDetailModal from '@/components/UserActivityDetailModal'; // New import
import { Button } from '@/components/ui/button'; // Ensure Button is imported

interface UserActivity {
  id: string;
  user: string;
  type: 'chat' | 'upload';
  details: string;
  timestamp: string;
  fullContent?: string; // Detailed content for chat or upload
}

const mockActivities: UserActivity[] = [
  {
    id: 'act-1',
    user: 'Alice',
    type: 'chat',
    details: 'Asked about course "The Complete Marketing Masterclass"',
    timestamp: '2024-08-01 10:00 AM',
    fullContent: `User: Hi, can you tell me more about "The Complete Marketing Masterclass"?
AI: Certainly! The Complete Marketing Masterclass covers digital marketing strategies, SEO, social media, email campaigns, and analytics. It's designed for entrepreneurs and small business owners.
User: What are the prerequisites?
AI: No prior marketing experience is required. It starts with the basics and progresses to advanced topics.
User: That sounds great! How long is the course?
AI: The course consists of 12 modules, with an estimated completion time of 40 hours, including practical exercises.`,
  },
  {
    id: 'act-2',
    user: 'Bob',
    type: 'upload',
    details: 'Uploaded "Business Plan Draft.pdf"',
    timestamp: '2024-08-01 10:15 AM',
    fullContent: `File Name: Business Plan Draft.pdf
File Size: 2.5 MB
Upload Date: 2024-08-01
Description: Initial draft of the business plan for a new tech startup. Contains market analysis, financial projections, and team overview.
Status: Processing complete.
Associated Project: New Venture Launch.`,
  },
  {
    id: 'act-3',
    user: 'Charlie',
    type: 'chat',
    details: 'Inquired about "Profit Radar" AI module configuration',
    timestamp: '2024-08-01 10:30 AM',
    fullContent: `User: How do I configure the "Profit Radar" AI module?
AI: To configure Profit Radar, navigate to the AI Configuration page from the sidebar. Under "AI Module Specific Prompts," expand the "Profit Radar" section.
User: What kind of prompt should I use?
AI: You can provide a prompt that specifies your industry, target metrics, and any specific market segments you want to analyze. For example: "Analyze market trends for SaaS businesses, focusing on subscription growth and churn rates in Q3."`,
  },
  {
    id: 'act-4',
    user: 'Alice',
    type: 'upload',
    details: 'Uploaded "Marketing Strategy.docx"',
    timestamp: '2024-08-01 11:00 AM',
    fullContent: `File Name: Marketing Strategy.docx
File Size: 1.8 MB
Upload Date: 2024-08-01
Description: Detailed marketing strategy document outlining Q4 campaigns, budget allocation, and target audience segmentation.
Status: Awaiting review.
Version: 1.0`,
  },
  {
    id: 'act-5',
    user: 'David',
    type: 'chat',
    details: 'Provided feedback on "Lesson Plan Creator" prompt',
    timestamp: '2024-08-01 11:45 AM',
    fullContent: `User: The "Lesson Plan Creator" prompt is working well, but I'd like to suggest an enhancement.
AI: We appreciate your feedback, David! What enhancement would you suggest?
User: It would be great if there was an option to specify the target age group for the learners, as it impacts the tone and complexity of the generated plans.
AI: That's an excellent suggestion! We'll add it to our feature request list for future updates. Thank you!`,
  },
];

const UserActivityPage: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);

  const handleViewDetails = (activity: UserActivity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const getActivityIcon = (type: 'chat' | 'upload') => {
    if (type === 'chat') {
      return <MessageSquare className="h-4 w-4 text-indigo-600" />;
    }
    return <Upload className="h-4 w-4 text-green-600" />;
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">User Activity Log</h2>

      <Card>
        <CardHeader>
          <CardTitle>Frontend Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
                <TableHead className="w-[80px] text-center">Actions</TableHead> {/* New column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {getActivityIcon(activity.type)}
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