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
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const MarathonEnrollment = () => {
  const { user } = useAuth();
  const [marathonId, setMarathonId] = useState("");
  const [marathon, setMarathon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // Mock enrolled marathons data
  const enrolledMarathons = [
    {
      id: "mar001",
      title: "Maratona de JavaScript",
      classroom: "Turma JS 2024.1",
      classroomCode: "JS2024A",
      difficulty: "Intermediate",
      status: "Aberta",
      enrolledAt: "2024-07-01",
      timeLimit: 120,
      questions: 10,
    },
    {
      id: "mar002",
      title: "Python para Iniciantes",
      classroom: "Turma Python Básico",
      classroomCode: "PY2024B",
      difficulty: "Beginner",
      status: "Finalizada",
      enrolledAt: "2024-06-15",
      timeLimit: 90,
      questions: 8,
    },
  ];

  const searchMarathon = async () => {
    if (!marathonId.trim()) {
      toast({
        title: "ID da maratona obrigatório",
        description: "Digite o ID da maratona para buscar.",
        variant: "destructive",
      });
      return;
    }

    setMarathon(null);
    setEnrolled(false);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock marathon data
      const mockMarathon = {
        id: marathonId,
        title: "Maratona de Desenvolvimento Web",
        description: "Teste seus conhecimentos em HTML, CSS e JavaScript",
        classroom: "Turma Web Dev 2024.2",
        classroomCode: "WEB2024C",
        difficulty: "Intermediate",
        timeLimit: 150,
        questions: 12,
        startDate: "2024-07-20T09:00",
        endDate: "2024-07-25T23:59",
        participants: 15,
        maxParticipants: 30,
        teacher: "Prof. João Lima",
        status: "Aberta",
      };

      if (marathonId === "invalid") {
        setMarathon(null);
        toast({
          title: "Maratona não encontrada",
          description: "Verifique o ID da maratona e tente novamente.",
          variant: "destructive",
        });
      } else {
        setMarathon(mockMarathon);
      }

      setLoading(false);
    }, 1000);
  };

  const handleEnroll = () => {
    if (!marathon) return;

    toast({
      title: "Inscrição realizada!",
      description: `Você foi inscrito na maratona "${marathon.title}".`,
    });

    setEnrolled(true);
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
              <Label htmlFor="marathonId">ID da Maratona</Label>
              <Input
                className="w-full"
                id="marathonId"
                placeholder="Ex: mar001, mar002..."
                value={marathonId}
                onChange={(e) => setMarathonId(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && searchMarathon()}
              />
            </div>
          </div>
          <Button
            onClick={searchMarathon}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Buscando..." : "Buscar Maratona"}
          </Button>
        </CardContent>
      </Card>

      {/* Marathon Details */}
      {marathon && (
        <Card className="flex justify-between">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{marathon.title}</CardTitle>
                <div className="flex gap-2">
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
                  <span>Turma: {marathon.classroom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{marathon.classroomCode}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span>{marathon.questions} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{marathon.timeLimit} minutos</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-sm font-medium">Início</Label>
                <p className="text-gray-600">
                  {new Date(marathon.startDate).toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Fim</Label>
                <p className="text-gray-600">
                  {new Date(marathon.endDate).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>
                {marathon.participants}/{marathon.maxParticipants} participantes
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Professor: {marathon.teacher}
            </div>

            {marathon.status === "Aberta" && !enrolled && (
              <Alert className="border-2 border-blue-300">
                <CheckCircle height={15} width={15} />
                <AlertDescription>
                  Esta maratona está aberta para inscrições. Você pode se
                  inscrever agora.
                </AlertDescription>
              </Alert>
            )}

            {marathon.status === "Finalizada" && (
              <Alert className="border-2 border-yellow-200">
                <AlertCircle height={15} width={15} />
                <AlertDescription>
                  Esta maratona já foi finalizada. Não é possível se inscrever.
                </AlertDescription>
              </Alert>
            )}

            {enrolled && (
              <Alert className="border-2 border-green-400">
                <CheckCircle height={15} width={15} />
                <AlertDescription>
                  Excelente! Inscrição concluída com sucesso!
                </AlertDescription>
              </Alert>
            )}

            {marathon.status === "Aberta" && !enrolled && (
              <div
                className={`flex gap-2 ${
                  marathon.status === "Aberta" && !enrolled ? "pb-0" : "pt-0"
                }`}
              >
                <Button onClick={handleEnroll} className="flex-1">
                  <Trophy className="mr-2 h-4 w-4" />
                  Inscrever-se na Maratona
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
          {enrolledMarathons.length === 0 ? (
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
              {enrolledMarathons.map((marathon) => (
                <div
                  key={marathon.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{marathon.title}</h4>
                      <p className="text-sm text-gray-600">
                        {marathon.classroom}
                      </p>
                    </div>
                    <Badge className={getStatusColor(marathon.status)}>
                      {marathon.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline">{marathon.classroomCode}</Badge>
                    <Badge className={getDifficultyColor(marathon.difficulty)}>
                      {marathon.difficulty === "Beginner"
                        ? "Iniciante"
                        : marathon.difficulty === "Intermediate"
                        ? "Intermediário"
                        : "Avançado"}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3 w-3" />
                      <span>{marathon.questions} questões</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{marathon.timeLimit} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Inscrito em{" "}
                        {new Date(marathon.enrolledAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarathonEnrollment;
