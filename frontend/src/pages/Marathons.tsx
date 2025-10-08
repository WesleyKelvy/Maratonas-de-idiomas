import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Eye, Play, Plus, Search, Trophy, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Marathons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setDialogOpen(true);
      // Remove the parameter from URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);
  const [marathonForm, setMarathonForm] = useState({
    title: "",
    description: "",
    context: "",
    difficulty: "",
    timeLimit: "",
    start_date: "",
    end_date: "",
    number_of_questions: "",
    classroom_code: "",
  });

  // Estado para bloquear o campo de data de fim
  const isTimeLimitFilled =
    marathonForm.timeLimit && marathonForm.timeLimit.trim() !== "";

  // Mock classrooms data - in real app this would come from backend
  const classrooms = [
    { code: "ABC123", name: "Turma de JavaScript" },
    { code: "DEF456", name: "Turma de Python" },
    { code: "GHI789", name: "Turma de Algoritmos" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setMarathonForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the data to the backend
    console.log("Marathon data:", marathonForm);

    // Simulate creating marathon and get ID
    const newMarathonId = `marathon_${Date.now()}`;

    setDialogOpen(false);
    // Reset form
    setMarathonForm({
      title: "",
      description: "",
      context: "",
      difficulty: "",
      timeLimit: "",
      start_date: "",
      end_date: "",
      number_of_questions: "",
      classroom_code: "",
    });

    // Navigate to question management
    navigate(`/question-management/${newMarathonId}`);
  };

  const marathons = [
    {
      id: 1,
      title: "Maratona de JavaScript",
      description:
        "Teste seus conhecimentos em JavaScript com questões práticas e teóricas.",
      difficulty: "Intermediário",
      status: "Aberta",
      participants: 45,
      duration: "2 horas",
      questions: 10,
      teacher: "Prof. Ana Silva",
      startDate: "2024-07-15",
      endDate: "2024-07-20",
    },
    {
      id: 2,
      title: "Python para Iniciantes",
      description:
        "Introdução ao Python com exercícios básicos de programação.",
      difficulty: "Iniciante",
      status: "Aberta",
      participants: 32,
      duration: "1.5 horas",
      questions: 8,
      teacher: "Prof. Carlos Santos",
      startDate: "2024-07-10",
      endDate: "2024-07-25",
    },
    {
      id: 3,
      title: "Algoritmos Avançados",
      description: "Desafios complexos de algoritmos e estruturas de dados.",
      difficulty: "Avançado",
      status: "Finalizada",
      participants: 28,
      duration: "3 horas",
      questions: 15,
      teacher: "Prof. Maria Costa",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
    },
    {
      id: 4,
      title: "Desenvolvimento Web",
      description: "HTML, CSS e JavaScript para desenvolvimento web moderno.",
      difficulty: "Intermediário",
      status: "Aguardando início",
      participants: 0,
      duration: "2.5 horas",
      questions: 12,
      teacher: "Prof. João Lima",
      startDate: "2024-07-25",
      endDate: "2024-07-30",
    },
  ];

  const filteredMarathons = marathons.filter((marathon) => {
    const matchesSearch =
      marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || marathon.status === statusFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || marathon.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

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

  return (
    <div className="space-y-6 h-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maratonas</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "Professor"
              ? "Visualize todas as suas maratonas criadas"
              : "Explore maratonas disponíveis"}
          </p>
        </div>
        {user?.role === "Professor" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Maratona
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar nova Maratona</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova maratona de programação.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={marathonForm.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Ex: Maratona de JavaScript"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classroom_code">Turma *</Label>
                    <Select
                      value={marathonForm.classroom_code}
                      onValueChange={(value) =>
                        handleInputChange("classroom_code", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem
                            key={classroom.code}
                            value={classroom.code}
                          >
                            {classroom.name} ({classroom.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={marathonForm.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Descreva os objetivos da maratona..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Contexto *</Label>
                  <Textarea
                    id="context"
                    value={marathonForm.context}
                    onChange={(e) =>
                      handleInputChange("context", e.target.value)
                    }
                    placeholder="Contexto técnico da maratona, tecnologias abordadas..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade *</Label>
                    <Select
                      value={marathonForm.difficulty}
                      onValueChange={(value) =>
                        handleInputChange("difficulty", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Iniciante</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="Advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Tempo Limite (min) *</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={marathonForm.timeLimit}
                      onChange={(e) =>
                        handleInputChange("timeLimit", e.target.value)
                      }
                      placeholder="120"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number_of_questions">
                      Número de Questões *
                    </Label>
                    <Input
                      id="number_of_questions"
                      type="number"
                      value={marathonForm.number_of_questions}
                      onChange={(e) =>
                        handleInputChange("number_of_questions", e.target.value)
                      }
                      placeholder="10"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Data de Início *</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      value={marathonForm.start_date}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Data de Fim</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={marathonForm.end_date}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                      required
                      disabled={isTimeLimitFilled}
                    />
                    {isTimeLimitFilled && (
                      <span className="text-xs text-gray-500 absolute">
                        Campo bloqueado pois tempo limite está definido.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Maratona</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {user?.role === "Student" && (
          <Button onClick={() => navigate("/marathon-enrollment")}>
            <Plus className="mr-2 h-4 w-4" />
            Inscrever em Maratona
          </Button>
        )}
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
                <SelectItem value="Iniciante">Iniciante</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Maratonas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto h-[65dvh] rounded-lg">
        {filteredMarathons.map((marathon) => (
          <Card key={marathon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{marathon.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(marathon.status)}>
                      {marathon.status}
                    </Badge>
                    <Badge className={getDifficultyColor(marathon.difficulty)}>
                      {marathon.difficulty}
                    </Badge>
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
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{marathon.participants} participantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{marathon.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span>{marathon.questions} questões</span>
                </div>
                <div className="text-gray-600">{marathon.teacher}</div>
              </div>

              <div className="text-xs text-gray-500">
                <p>
                  Início:{" "}
                  {new Date(marathon.startDate).toLocaleDateString("pt-BR")}
                </p>
                <p>
                  Fim: {new Date(marathon.endDate).toLocaleDateString("pt-BR")}
                </p>
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
                {marathon.status === "Aberta" && user?.role === "Student" && (
                  <Button
                    size="sm"
                    onClick={() => navigate("/marathon-enrollment")}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Abrir
                  </Button>
                )}
                {user?.role === "Student" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigate to the class that contains this marathon
                      // This would normally be retrieved from the marathon data
                      navigate("/classes");
                    }}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Gerenciar
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
            <p className="text-gray-600">
              Tente ajustar os filtros para encontrar maratonas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Marathons;
