"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    id: string;
    title: string;
    description: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onEdit, onDelete }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(feature.id)}>
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(feature.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-slate-700">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;