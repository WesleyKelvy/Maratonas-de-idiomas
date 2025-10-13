import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatDateTime,
  getDifficultyColor,
  getDifficultyDisplay,
  getMarathonStatus,
  getStatusColor,
  MARATHON_STATUS,
} from "@/utils/marathonUtils";
import {
  BookText,
  Clock,
  Eye,
  Play,
  TableOfContents,
  Trophy,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MarathonCard = ({ marathon, classrooms }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const marathonStatus = getMarathonStatus(marathon);
  const classroomName =
    classrooms.find((c) => c.id === marathon.classroom_id)?.name ||
    "Turma não encontrada";

  return (
    <Card className="hover:shadow-lg transition-shadow h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{marathon.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Código: {marathon.code}</Badge>
              <Badge className={getStatusColor(marathonStatus)}>
                {marathonStatus}
              </Badge>
              <Badge className={getDifficultyColor(marathon.difficulty)}>
                {getDifficultyDisplay(marathon.difficulty)}
              </Badge>
            </div>
          </div>
          <BookText className="h-6 w-6 text-gray-500 flex-shrink-0" />
        </div>
        <CardDescription className="text-sm pt-2">
          {marathon.description || "Sem descrição"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{marathon.enrollments?.length || 0} participante(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{marathon.timeLimit} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gray-500" />
            <span>{marathon.number_of_questions} questões</span>
          </div>
          <div className="text-gray-600">{classroomName}</div>
        </div>
        {(marathon.start_date || marathon.end_date) && (
          <div className="text-xs text-gray-500">
            {marathon.start_date && (
              <p>Início: {formatDateTime(marathon.start_date)}</p>
            )}
            {marathon.end_date && (
              <p>Fim: {formatDateTime(marathon.end_date)}</p>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/marathons/${marathon.id}`)}
            className="flex-1"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>
          {marathonStatus === MARATHON_STATUS.OPEN &&
            user?.role === "Student" && (
              <Button
                size="sm"
                onClick={() => navigate("/marathon-enrollment")}
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                Participar
              </Button>
            )}
          {user?.role === "Professor" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`question-management/${marathon.id}`)}
              className="flex-1"
            >
              <TableOfContents className="mr-2 h-4 w-4" />
              Gerenciar Questões
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
