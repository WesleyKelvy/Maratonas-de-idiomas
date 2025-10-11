import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMarathon } from "@/hooks/use-marathon";
import { toast } from "@/hooks/use-toast";
import { LanguageMarathon } from "@/services/marathon.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  BookText,
  Calendar,
  Clock,
  Loader2,
  Play,
  TableOfContents,
  User,
  Users,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Navigation state interface
interface NavigationState {
  marathon?: LanguageMarathon;
  returnFilters?: {
    searchTerm: string;
    statusFilter: string;
    difficultyFilter: string;
    selectedClassroomId: string;
  };
}

const MarathonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  // const [showRulesModal, setShowRulesModal] = useState(false);

  // Get navigation state
  const navigationState = location.state as NavigationState | null;
  const passedMarathon = navigationState?.marathon;
  const returnFilters = navigationState?.returnFilters;

  // Fetch marathon data from backend (fallback if no state passed)
  const { data: fetchedMarathon, isLoading, error } = useMarathon(id || "");

  // Fetch classrooms for teacher name lookup
  // const { data: classrooms = [] } = useClassrooms();

  // Utility functions
  const getMarathonStatus = (marathon: LanguageMarathon): string => {
    const now = new Date();
    const startDate = marathon.start_date
      ? new Date(marathon.start_date)
      : null;
    const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

    if (endDate && now > endDate) return "Finalizada";
    if (startDate && now < startDate) return "Aguardando início";
    return "Aberta";
  };

  const getDifficultyDisplay = (difficulty: string): string => {
    const DIFFICULTY_DISPLAY = {
      Beginner: "Iniciante",
      Intermediate: "Intermediário",
      Advanced: "Avançado",
    } as const;
    return (
      DIFFICULTY_DISPLAY[difficulty as keyof typeof DIFFICULTY_DISPLAY] ||
      difficulty
    );
  };

  const formatDateTime = (date: string): string => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getTeacherName = (marathon: LanguageMarathon): string => {
    return marathon.classroom?.creator?.name || "Professor";
  };

  const getRules = (): string[] => {
    return [
      "Não é permitido consultar materiais externos",
      "As respostas são avaliadas automaticamente por IA",
      "Não é possível pausar a maratona uma vez iniciada",
      "Respeite o tempo limite estabelecido",
    ];
  };

  // Handle back navigation with filter preservation
  const handleBackNavigation = () => {
    if (returnFilters) {
      const params = new URLSearchParams();
      if (returnFilters.searchTerm) {
        params.set("search", returnFilters.searchTerm);
      }
      if (returnFilters.statusFilter !== "all") {
        params.set("status", returnFilters.statusFilter);
      }
      if (returnFilters.difficultyFilter !== "all") {
        params.set("difficulty", returnFilters.difficultyFilter);
      }
      if (returnFilters.selectedClassroomId) {
        params.set("classroom", returnFilters.selectedClassroomId);
      }

      const queryString = params.toString();
      navigate(`/marathons${queryString ? `?${queryString}` : ""}`);
    } else {
      navigate("/marathons");
    }
  };

  // Loading state
  if (isLoading && !passedMarathon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando detalhes da maratona...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !passedMarathon) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar maratona
            </h3>
            <p className="text-gray-600">
              Não foi possível carregar os detalhes da maratona.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Marathon not found
  if (!fetchedMarathon) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Maratona não encontrada
            </h3>
            <p className="text-gray-600">
              A maratona solicitada não foi encontrada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta":
        return "bg-green-100 text-green-800";
      case "Finalizada":
        return "bg-gray-100 text-gray-800";
      case "Aguardando início":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante":
        return "bg-blue-100 text-blue-800";
      case "Intermediário":
        return "bg-orange-100 text-orange-800";
      case "Avançado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleParticipate = () => {
    toast({
      title: "Maratona iniciada!",
      description: "Boa sorte na sua participação.",
    });
    navigate(`/marathons/${fetchedMarathon.id}/execute`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBackNavigation}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {fetchedMarathon.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">
                    {fetchedMarathon.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Código: {fetchedMarathon.code}
                    </Badge>
                    <Badge
                      className={getStatusColor(
                        getMarathonStatus(fetchedMarathon)
                      )}
                    >
                      {getMarathonStatus(fetchedMarathon)}
                    </Badge>
                    <Badge
                      className={getDifficultyColor(
                        getDifficultyDisplay(fetchedMarathon.difficulty)
                      )}
                    >
                      {getDifficultyDisplay(fetchedMarathon.difficulty)}
                    </Badge>
                  </div>
                </div>
                <BookText className="h-8 w-8 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700">{fetchedMarathon.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contexto</h3>
                <p className="text-gray-700">{fetchedMarathon.context}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 border rounded-lg">
                  <Users className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {fetchedMarathon.enrollments?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Participantes</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {fetchedMarathon.timeLimit} min
                  </div>
                  <div className="text-sm text-gray-600">Tempo Limite</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <TableOfContents className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {fetchedMarathon.number_of_questions}
                  </div>
                  <div className="text-sm text-gray-600">Questões</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <User className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">
                    {getTeacherName(fetchedMarathon)}
                  </div>
                  <div className="text-sm text-gray-600">Criador</div>
                </div>
              </div>

              {(fetchedMarathon.start_date || fetchedMarathon.end_date) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {fetchedMarathon.start_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">
                          Data de início
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(fetchedMarathon.start_date)}
                        </div>
                      </div>
                    </div>
                  )}
                  {fetchedMarathon.end_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Data de fim</div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(fetchedMarathon.end_date)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Regras da Maratona */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Regras da Maratona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {getRules().map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Botão de Participação */}
          {getMarathonStatus(fetchedMarathon) === "Aberta" &&
            user?.role === "Student" && (
              <Card>
                <CardContent className="pt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <Play className="mr-2 h-5 w-5" />
                        Participar da Maratona
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Participação</DialogTitle>
                        <DialogDescription className="space-y-4">
                          <p>
                            Você está prestes a iniciar a maratona "
                            {fetchedMarathon.title}".
                          </p>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">
                              Importante:
                            </h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              <li>
                                • A maratona tem tempo limite de{" "}
                                {fetchedMarathon.timeLimit} minutos
                              </li>
                              <li>• Você não poderá pausar uma vez iniciada</li>
                              <li>
                                • São {fetchedMarathon.number_of_questions}{" "}
                                questões no total
                              </li>
                              <li>• Leia todas as regras antes de começar</li>
                            </ul>
                          </div>
                          <p>Deseja continuar?</p>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                        <Button onClick={handleParticipate} className="flex-1">
                          Iniciar Maratona
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

          {getMarathonStatus(fetchedMarathon) !== "Aberta" && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-gray-500 mb-2">
                  {getMarathonStatus(fetchedMarathon) === "Finalizada"
                    ? "Esta maratona já foi finalizada"
                    : "Esta maratona ainda não começou"}
                </div>
                <Button disabled className="w-full">
                  Não Disponível
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarathonDetails;
