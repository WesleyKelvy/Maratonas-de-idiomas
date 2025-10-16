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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Eye,
  Play,
  Search,
  Trophy,
  Users,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserMarathons } from "@/hooks/use-marathon";
import { useQuery } from "@tanstack/react-query";
import { SubmissionService } from "@/services/submission.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const StudentMarathons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Buscar as maratonas do usuário
  const {
    data: enrolledMarathons = [],
    isLoading: loadingMarathons,
    error: errorMarathons,
  } = useUserMarathons();

  // Buscar submissões do usuário para calcular estatísticas
  const { data: userSubmissions = [], isLoading: loadingSubmissions } =
    useQuery({
      queryKey: ["user-submissions"],
      queryFn: () => SubmissionService.findAllByUserId(),
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    });

  // Funções auxiliares para calcular estatísticas baseadas nos dados reais
  const getMarathonStatus = (marathon: (typeof enrolledMarathons)[0]) => {
    const now = new Date();
    const startDate = new Date(marathon.start_date);
    const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

    if (endDate && now > endDate) {
      return "Finalizada";
    } else if (now >= startDate) {
      return "Aberta";
    } else {
      return "Aguardando início";
    }
  };

  const isMarathonCompleted = (marathonId: string) => {
    const marathonSubmissions = userSubmissions.filter(
      (sub) => sub.marathon_id === marathonId
    );
    // Considera completa se tem pelo menos uma submissão
    return marathonSubmissions.length > 0;
  };

  const getMarathonScore = (marathonId: string) => {
    const marathonSubmissions = userSubmissions.filter(
      (sub) => sub.marathon_id === marathonId
    );
    if (marathonSubmissions.length === 0) return null;

    const avgScore =
      marathonSubmissions.reduce((acc, sub) => acc + sub.score, 0) /
      marathonSubmissions.length;
    return avgScore;
  };

  const filteredMarathons = enrolledMarathons.filter((marathon) => {
    const status = getMarathonStatus(marathon);

    const matchesSearch =
      marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (marathon.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (marathon.classroom?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || marathon.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getStatusColor = (status) => {
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

  const getDifficultyColor = (difficulty) => {
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

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  // Stats calculations usando dados reais
  const stats = useMemo(() => {
    const total = enrolledMarathons.length;
    const completed = enrolledMarathons.filter((m) =>
      isMarathonCompleted(m.id)
    ).length;
    const inProgress = enrolledMarathons.filter(
      (m) => getMarathonStatus(m) === "Aberta" && !isMarathonCompleted(m.id)
    ).length;
    const upcoming = enrolledMarathons.filter(
      (m) => getMarathonStatus(m) === "Aguardando início"
    ).length;

    const marathonsWithScores = enrolledMarathons
      .map((m) => getMarathonScore(m.id))
      .filter((score) => score !== null) as number[];

    const averageScore =
      marathonsWithScores.length > 0
        ? marathonsWithScores.reduce((acc, score) => acc + score, 0) /
          marathonsWithScores.length
        : 0;

    return {
      total,
      completed,
      inProgress,
      upcoming,
      averageScore,
    };
  }, [enrolledMarathons, userSubmissions]);

  // Loading state
  if (loadingMarathons || loadingSubmissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando suas maratonas...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (errorMarathons) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Erro ao carregar maratonas</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar suas maratonas.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minhas Maratonas</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe suas inscrições e resultados nas maratonas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Trophy className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.inProgress}
                </p>
              </div>
              <Play className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aguardando</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.upcoming}
                </p>
              </div>
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    stats.averageScore
                  )}`}
                >
                  {stats.averageScore > 0
                    ? `${stats.averageScore.toFixed(1)}`
                    : "-"}
                </p>
              </div>
              <Users className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar maratonas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Aguardando início">
                  Aguardando início
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                <SelectItem value="Beginner">Iniciante</SelectItem>
                <SelectItem value="Intermediate">Intermediário</SelectItem>
                <SelectItem value="Advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Maratonas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMarathons.map((marathon) => {
          const status = getMarathonStatus(marathon);
          const completed = isMarathonCompleted(marathon.id);
          const score = getMarathonScore(marathon.id);

          return (
            <Card
              key={marathon.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{marathon.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                      <Badge
                        className={getDifficultyColor(marathon.difficulty)}
                      >
                        {marathon.difficulty === "Beginner"
                          ? "Iniciante"
                          : marathon.difficulty === "Intermediate"
                          ? "Intermediário"
                          : "Avançado"}
                      </Badge>
                      {completed ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Concluída
                        </Badge>
                      ) : status === "Finalizada" ? (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" />
                          Não concluída
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <CardDescription className="text-sm">
                  {marathon.description || marathon.context}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Turma</p>
                    <p className="text-gray-600">
                      {marathon.classroom?.name || "N/A"}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {marathon.code}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Professor</p>
                    <p className="text-gray-600">
                      {marathon.classroom?.creator?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <span>{marathon.number_of_questions} questões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{marathon.timeLimit} min</span>
                  </div>
                </div>

                {score !== null && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Nota média:</span>
                      <span
                        className={`text-lg font-bold ${getScoreColor(score)}`}
                      >
                        {score.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Início:{" "}
                    {format(
                      new Date(marathon.start_date),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </p>
                  {marathon.end_date && (
                    <p>
                      Fim:{" "}
                      {format(
                        new Date(marathon.end_date),
                        "dd/MM/yyyy 'às' HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                    </p>
                  )}
                </div>

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

                  {status === "Aberta" && !completed && (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/marathons/${marathon.id}?participate=true`)
                      }
                      className="flex-1"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {new Date() >= new Date(marathon.start_date)
                        ? "Participar"
                        : "Em breve"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMarathons.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma maratona encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              statusFilter !== "all" ||
              difficultyFilter !== "all"
                ? "Tente ajustar os filtros para encontrar maratonas."
                : "Você ainda não está inscrito em nenhuma maratona."}
            </p>
            {!searchTerm &&
              statusFilter === "all" &&
              difficultyFilter === "all" &&
              enrolledMarathons.length === 0 && (
                <Button onClick={() => navigate("/marathon-enrollment")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Buscar Maratonas
                </Button>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentMarathons;
