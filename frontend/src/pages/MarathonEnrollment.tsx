import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  useCreateEnrollment,
  useUserEnrollments,
} from "@/hooks/use-enrollment";
import { useMarathonByCode } from "@/hooks/use-marathon";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MarathonEnrollment = () => {
  const { user } = useAuth();
  const [marathonCode, setMarathonCode] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Hooks
  const {
    data: marathon,
    isLoading: marathonLoading,
    error: marathonError,
    refetch: refetchMarathon,
  } = useMarathonByCode(marathonCode, searchTriggered);

  const {
    data: enrolledMarathons = [],
    isLoading: enrollmentsLoading,
    refetch: refetchEnrollments,
  } = useUserEnrollments();

  const createEnrollmentMutation = useCreateEnrollment();

  const searchMarathon = async () => {
    if (!marathonCode.trim()) {
      toast({
        title: "Código da maratona obrigatório",
        description: "Digite o código da maratona para buscar.",
        variant: "destructive",
      });
      return;
    }

    setSearchTriggered(true);
    refetchMarathon();
  };

  const handleEnroll = async () => {
    if (!marathon) return;

    try {
      await createEnrollmentMutation.mutateAsync({
        code: marathon.code,
      });

      // Refetch enrollments to update the list
      refetchEnrollments();

      // Reset search
      setMarathonCode("");
      setSearchTriggered(false);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  // Utility functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-orange-100 text-orange-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "Iniciante";
      case "Intermediate":
        return "Intermediário";
      case "Advanced":
        return "Avançado";
      default:
        return difficulty;
    }
  };

  const getMarathonStatus = (marathon: any) => {
    const now = new Date();
    const startDate = marathon.start_date
      ? new Date(marathon.start_date)
      : null;
    const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

    if (endDate && now > endDate) return "Finalizada";
    if (startDate && now < startDate) return "Aguardando início";
    return "Aberta";
  };

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

  const formatDateTime = (date: string | Date): string => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Check if user is already enrolled
  const isAlreadyEnrolled = (marathonId: string) => {
    return enrolledMarathons.some(
      (enrollment) => enrollment.marathon.id === marathonId
    );
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold">Inscrição em Maratonas</h1>
        <p className="text-gray-600 mt-2">
          Inscreva-se em maratonas utilizando o ID fornecido pelo professor
        </p>
      </div>

      {/* Search Marathon */}
      <Card className="flex w-full justify-between">
        <CardHeader>
          <CardTitle>Buscar Maratona</CardTitle>
          <CardDescription>
            Digite o ID da maratona fornecido pelo seu professor
          </CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4 items-end w-full justify-end">
          <div className="flex w-full space-y-4">
            <div className="flex-1 w-full">
              <Label htmlFor="marathonCode">Código da Maratona</Label>
              <Input
                className="w-full"
                id="marathonCode"
                placeholder="Ex: ABC123, XYZ789..."
                value={marathonCode}
                onChange={(e) => setMarathonCode(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && searchMarathon()}
              />
            </div>
          </div>
          <Button
            onClick={searchMarathon}
            disabled={marathonLoading}
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            {marathonLoading ? "Buscando..." : "Buscar Maratona"}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {marathonLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Buscando maratona...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {marathonError && searchTriggered && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Maratona não encontrada
            </h3>
            <p className="text-gray-600">
              Verifique o código da maratona e tente novamente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Marathon Details */}
      {marathon && !marathonLoading && (
        <Card className="flex justify-between">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{marathon.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge
                    className={getStatusColor(getMarathonStatus(marathon))}
                  >
                    {getMarathonStatus(marathon)}
                  </Badge>
                  <Badge className={getDifficultyColor(marathon.difficulty)}>
                    {getDifficultyDisplay(marathon.difficulty)}
                  </Badge>
                </div>
              </div>
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            {marathon.description && (
              <CardDescription className="text-sm">
                {marathon.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4 w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    Professor: {marathon.classroom?.creator?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Código: {marathon.code}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span>{marathon.number_of_questions} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{marathon.timeLimit} minutos</span>
                </div>
              </div>
            </div>

            {(marathon.start_date || marathon.end_date) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {marathon.start_date && (
                  <div>
                    <Label className="text-sm font-medium">Início</Label>
                    <p className="text-gray-600">
                      {formatDateTime(marathon.start_date)}
                    </p>
                  </div>
                )}
                {marathon.end_date && (
                  <div>
                    <Label className="text-sm font-medium">Fim</Label>
                    <p className="text-gray-600">
                      {formatDateTime(marathon.end_date)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {marathon.enrollments?.length || 0} participante
                {(marathon.enrollments?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            {getMarathonStatus(marathon) === "Aberta" &&
              !isAlreadyEnrolled(marathon.id) && (
                <Alert className="border-2 border-blue-300">
                  <CheckCircle height={15} width={15} />
                  <AlertDescription>
                    Esta maratona está aberta para inscrições. Você pode se
                    inscrever agora.
                  </AlertDescription>
                </Alert>
              )}

            {isAlreadyEnrolled(marathon.id) && (
              <Alert className="border-2 border-green-400">
                <CheckCircle height={15} width={15} />
                <AlertDescription>
                  Você já está inscrito nesta maratona!
                </AlertDescription>
              </Alert>
            )}
            
            {getMarathonStatus(marathon) === "Finalizada" && (
              <Alert className="border-2 border-yellow-200">
                <AlertCircle height={15} width={15} />
                <AlertDescription>
                  Esta maratona já foi finalizada. Não é possível se inscrever.
                </AlertDescription>
              </Alert>
            )}

            {getMarathonStatus(marathon) === "Aberta" &&
              !isAlreadyEnrolled(marathon.id) && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleEnroll}
                    className="flex-1"
                    disabled={createEnrollmentMutation.isPending}
                  >
                    {createEnrollmentMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trophy className="mr-2 h-4 w-4" />
                    )}
                    {createEnrollmentMutation.isPending
                      ? "Inscrevendo..."
                      : "Inscrever-se na Maratona"}
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Enrolled Marathons */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Inscrições</CardTitle>
          <CardDescription>Maratonas em que você está inscrito</CardDescription>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando inscrições...</span>
            </div>
          ) : enrolledMarathons.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma inscrição encontrada
              </h3>
              <p className="text-gray-600">
                Use o formulário acima para se inscrever em uma nova maratona.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledMarathons.map((enrollment) => {
                const marathonStatus = getMarathonStatus(enrollment.marathon);
                return (
                  <div
                    key={enrollment.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {enrollment.marathon.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Código: {enrollment.marathon.code}
                        </p>
                      </div>
                      <Badge className={getStatusColor(marathonStatus)}>
                        {marathonStatus}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Badge
                        className={getDifficultyColor(
                          enrollment.marathon.difficulty
                        )}
                      >
                        {getDifficultyDisplay(enrollment.marathon.difficulty)}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3 w-3" />
                        <span>
                          {enrollment.marathon.number_of_questions} questões
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{enrollment.marathon.timeLimit} min</span>
                      </div>
                      {enrollment.marathon.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Início:{" "}
                            {formatDateTime(enrollment.marathon.start_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarathonEnrollment;
