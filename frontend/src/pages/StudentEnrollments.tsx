import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Users,
  Clock,
  Calendar,
  Play,
  Eye,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const StudentEnrollments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Mock enrolled marathons data for the student
  const enrolledMarathons = [
    {
      id: "mar001",
      title: "Fundamentos de JavaScript",
      description:
        "Teste básico sobre sintaxe e conceitos fundamentais do JavaScript.",
      classroom: "Turma de JavaScript - 2024.1",
      classroomCode: "JS2024A",
      difficulty: "Beginner",
      status: "Aberta",
      duration: 90,
      questions: 8,
      startDate: "2024-07-15T09:00",
      endDate: "2024-07-20T23:59",
      enrolledAt: "2024-07-14T15:30",
      completed: false,
      score: null,
      teacher: "Prof. Ana Silva",
    },
    {
      id: "mar002",
      title: "Manipulação do DOM",
      description:
        "Exercícios práticos sobre manipulação de elementos DOM com JavaScript.",
      classroom: "Turma de JavaScript - 2024.1",
      classroomCode: "JS2024A",
      difficulty: "Intermediate",
      status: "Aberta",
      duration: 120,
      questions: 10,
      startDate: "2024-07-18T14:00",
      endDate: "2024-07-25T23:59",
      enrolledAt: "2024-07-16T10:15",
      completed: false,
      score: null,
      teacher: "Prof. Ana Silva",
    },
    {
      id: "mar003",
      title: "Estruturas de Dados",
      description: "Arrays, objetos e estruturas de dados complexas.",
      classroom: "Turma de Python - 2024.1",
      classroomCode: "PY2024B",
      difficulty: "Intermediate",
      status: "Finalizada",
      duration: 150,
      questions: 15,
      startDate: "2024-07-01T09:00",
      endDate: "2024-07-05T23:59",
      enrolledAt: "2024-06-30T08:00",
      completed: true,
      score: 85.5,
      teacher: "Prof. Carlos Santos",
    },
    {
      id: "mar004",
      title: "Algoritmos Básicos",
      description: "Introdução a algoritmos de ordenação e busca.",
      classroom: "Turma Algoritmos - 2024.1",
      classroomCode: "ALG2024C",
      difficulty: "Advanced",
      status: "Finalizada",
      duration: 180,
      questions: 12,
      startDate: "2024-06-15T10:00",
      endDate: "2024-06-20T23:59",
      enrolledAt: "2024-06-14T12:00",
      completed: true,
      score: 92.0,
      teacher: "Prof. Maria Costa",
    },
    {
      id: "mar005",
      title: "Programação Assíncrona",
      description: "Promises, async/await e manipulação de APIs.",
      classroom: "Turma de JavaScript - 2024.1",
      classroomCode: "JS2024A",
      difficulty: "Advanced",
      status: "Aguardando início",
      duration: 180,
      questions: 12,
      startDate: "2024-07-25T10:00",
      endDate: "2024-07-30T23:59",
      enrolledAt: "2024-07-20T16:45",
      completed: false,
      score: null,
      teacher: "Prof. Ana Silva",
    },
  ];

  const filteredMarathons = enrolledMarathons.filter((marathon) => {
    const matchesSearch =
      marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marathon.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || marathon.status === statusFilter;
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

  // Stats calculations
  const stats = {
    total: enrolledMarathons.length,
    completed: enrolledMarathons.filter((m) => m.completed).length,
    inProgress: enrolledMarathons.filter(
      (m) => m.status === "Aberta" && !m.completed
    ).length,
    upcoming: enrolledMarathons.filter((m) => m.status === "Aguardando início")
      .length,
    averageScore:
      enrolledMarathons
        .filter((m) => m.score !== null)
        .reduce((acc, m) => acc + m.score, 0) /
        enrolledMarathons.filter((m) => m.score !== null).length || 0,
  };

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
        {filteredMarathons.map((marathon) => (
          <Card key={marathon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{marathon.title}</CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getStatusColor(marathon.status)}>
                      {marathon.status}
                    </Badge>
                    <Badge className={getDifficultyColor(marathon.difficulty)}>
                      {marathon.difficulty === "Beginner"
                        ? "Iniciante"
                        : marathon.difficulty === "Intermediate"
                        ? "Intermediário"
                        : "Avançado"}
                    </Badge>
                    {marathon.completed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Concluída
                      </Badge>
                    ) : marathon.status === "Finalizada" ? (
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
                {marathon.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Turma</p>
                  <p className="text-gray-600">{marathon.classroom}</p>
                  <Badge variant="outline" className="mt-1">
                    {marathon.classroomCode}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Professor</p>
                  <p className="text-gray-600">{marathon.teacher}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span>{marathon.questions} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{marathon.duration} min</span>
                </div>
              </div>

              {marathon.score !== null && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Nota obtida:</span>
                    <span
                      className={`text-lg font-bold ${getScoreColor(
                        marathon.score
                      )}`}
                    >
                      {marathon.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Inscrito em:{" "}
                  {new Date(marathon.enrolledAt).toLocaleString("pt-BR")}
                </p>
                <p>
                  Início: {new Date(marathon.startDate).toLocaleString("pt-BR")}
                </p>
                <p>Fim: {new Date(marathon.endDate).toLocaleString("pt-BR")}</p>
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

                {marathon.status === "Aberta" && !marathon.completed && (
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/marathons/${marathon.id}/execute`)
                    }
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {new Date() >= new Date(marathon.startDate)
                      ? "Participar"
                      : "Em breve"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
              difficultyFilter === "all" && (
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

export default StudentEnrollments;
