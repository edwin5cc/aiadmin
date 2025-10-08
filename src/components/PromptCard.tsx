import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from 'lucide-react';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ id, title, description, onEdit, onDelete }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-slate-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default PromptCard;