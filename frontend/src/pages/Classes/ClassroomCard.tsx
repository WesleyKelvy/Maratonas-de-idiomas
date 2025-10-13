import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ClassroomCard = ({ classroom, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const marathonCount = classroom.marathons?.length || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{classroom.name}</CardTitle>
          <Users className="h-6 w-6 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          {marathonCount} maratona(s) vinculada(s)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/classes/${classroom.id}`)}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
