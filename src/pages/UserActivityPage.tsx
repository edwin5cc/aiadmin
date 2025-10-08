"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Upload, Clock } from 'lucide-react';

interface UserActivity {
  id: string;
  user: string;
  type: 'chat' | 'upload';
  details: string;
  timestamp: string;
}

const mockActivities: UserActivity[] = [
  {
    id: 'act-1',
    user: 'Alice',
    type: 'chat',
    details: 'Asked about course "The Complete Marketing Masterclass"',
    timestamp: '2024-08-01 10:00 AM',
  },
  {
    id: 'act-2',
    user: 'Bob',
    type: 'upload',
    details: 'Uploaded "Business Plan Draft.pdf"',
    timestamp: '2024-08-01 10:15 AM',
  },
  {
    id: 'act-3',
    user: 'Charlie',
    type: 'chat',
    details: 'Inquired about "Profit Radar" AI module configuration',
    timestamp: '2024-08-01 10:30 AM',
  },
  {
    id: 'act-4',
    user: 'Alice',
    type: 'upload',
    details: 'Uploaded "Marketing Strategy.docx"',
    timestamp: '2024-08-01 11:00 AM',
  },
  {
    id: 'act-5',
    user: 'David',
    type: 'chat',
    details: 'Provided feedback on "Lesson Plan Creator" prompt',
    timestamp: '2024-08-01 11:45 AM',
  },
];

const UserActivityPage: React.FC = () => {
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityPage;