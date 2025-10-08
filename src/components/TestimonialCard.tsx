"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: {
    id: string;
    author: string;
    role?: string;
    text: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, onEdit, onDelete }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <Quote className="h-6 w-6 text-indigo-600 mr-3" />
          <div>
            <CardTitle className="text-lg font-semibold">{testimonial.author}</CardTitle>
            {testimonial.role && <CardDescription className="text-sm text-slate-500">{testimonial.role}</CardDescription>}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(testimonial.id)}>
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(testimonial.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 italic">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;