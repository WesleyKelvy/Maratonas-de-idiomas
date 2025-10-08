import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MarathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Mock data - In real app, fetch by ID
  const marathon = {
    id: parseInt(id || "1"),
    title: "Maratona de JavaScript",
    description:
      "Teste seus conhecimentos em JavaScript com questões práticas e teóricas que cobrem desde conceitos básicos até tópicos avançados da linguagem.",
    context:
      "Esta maratona foi desenvolvida para avaliar o conhecimento em JavaScript moderno, incluindo ES6+, manipulação do DOM, programação assíncrona e frameworks modernos.",
    difficulty: "Intermediário",
    status: "Aberta",
    participants: 45,
    duration: "2 horas",
    questions: 10,
    teacher: "Prof. Ana Silva",
    startDate: "2024-07-15",
    endDate: "2024-07-20",
    timeLimit: 120, // minutes
    rules: [
      "Cada questão tem um tempo limite individual",
      "Não é permitido consultar materiais externos",
      "As respostas são avaliadas automaticamente por IA",
      "Você pode revisar suas respostas antes do envio final",
      "A pontuação é baseada na precisão e velocidade",
      "Não é possível pausar a maratona uma vez iniciada",
    ],
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
    navigate(`/marathons/${marathon.id}/execute`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          to={user?.role === "teacher" ? "/marathons" : "/my-enrollments"}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{marathon.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{marathon.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(marathon.status)}>
                      {marathon.status}
                    </Badge>
                    <Badge className={getDifficultyColor(marathon.difficulty)}>
                      {marathon.difficulty}
                    </Badge>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700">{marathon.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contexto</h3>
                <p className="text-gray-700">{marathon.context}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 border rounded-lg">
                  <Users className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {marathon.participants}
                  </div>
                  <div className="text-sm text-gray-600">Participantes</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{marathon.duration}</div>
                  <div className="text-sm text-gray-600">Duração</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Trophy className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{marathon.questions}</div>
                  <div className="text-sm text-gray-600">Questões</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <User className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">{marathon.teacher}</div>
                  <div className="text-sm text-gray-600">Professor</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Data de início</div>
                    <div className="text-sm text-gray-600">
                      {new Date(marathon.startDate).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Data de fim</div>
                    <div className="text-sm text-gray-600">
                      {new Date(marathon.endDate).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>
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
                {marathon.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Botão de Participação */}
          {marathon.status === "Aberta" && user?.role === "student" && (
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
                          {marathon.title}".
                        </p>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            Importante:
                          </h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>
                              • A maratona tem duração de {marathon.duration}
                            </li>
                            <li>• Você não poderá pausar uma vez iniciada</li>
                            <li>
                              • São {marathon.questions} questões no total
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

          {marathon.status !== "Aberta" && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-gray-500 mb-2">
                  {marathon.status === "Finalizada"
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
