import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface AiFeedbacks {
  id: number;
  explanation: string;
  points_deducted: number;
  category: string;
  marathon_id: string;
}

interface SubmissionDetail {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  question: {
    id: number;
    title: string;
    prompt: string;
    maxScore: number;
  };
  answer: string;
  score?: number;
  submitted_at: string;
  corrected_by_ai: boolean;
  corrected_answer?: string;
  aiEvaluation: string;
  marathon: {
    id: string;
    title: string;
    difficulty: string;
  };
  aiFeedbacks: AiFeedbacks[];
}

const SubmissionDetails = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  // Mock data - replace with API call based on submissionId
  const submission: SubmissionDetail = {
    id: submissionId || "1",
    user: {
      name: "João Silva",
      email: "joao@email.com",
      avatar: "/placeholder.svg",
    },
    marathon: {
      id: "marathon1",
      title: "Maratona de JavaScript",
      difficulty: "Intermediário",
    },
    question: {
      id: 1,
      title: "Diferenças entre let, const e var",
      prompt:
        'Explique a diferença entre "let", "const" e "var" em JavaScript e demonstre com exemplos práticos quando usar cada um. Discuta também sobre escopo, hoisting e redeclaração.',
      maxScore: 10,
    },
    answer: `let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. Ela não permite redeclaração na mesma scope e tem temporal dead zone.

const é usado para constantes que não podem ser reatribuídas após a inicialização. Também tem escopo de bloco e não permite redeclaração.

var tem escopo de função (ou global), pode ser redeclarada e sofre hoisting, sendo inicializada com undefined.

Exemplos:
- Use let para variáveis que mudam de valor
- Use const para valores que não mudam (objetos, arrays, funções)
- Evite var por causa de problemas de escopo

O hoisting acontece com todas, mas let e const ficam em temporal dead zone até serem declaradas.`,
    score: 9,
    submitted_at: "2024-12-05T14:30:00",
    corrected_by_ai: true,
    corrected_answer: undefined,
    aiEvaluation: "Positiva",
    aiFeedbacks: [
      {
        id: 1,
        explanation: "Ótima explicação sobre escopo de bloco vs função",
        points_deducted: 0,
        category: "Conceitos Fundamentais",
        marathon_id: "marathon1",
      },
      {
        id: 2,
        explanation: "Exemplos práticos bem aplicados",
        points_deducted: 0,
        category: "Exemplos Práticos",
        marathon_id: "marathon1",
      },
      {
        id: 3,
        explanation:
          "Poderia ter mencionado temporal dead zone com mais detalhes",
        points_deducted: 1,
        category: "Detalhes Avançados",
        marathon_id: "marathon1",
      },
    ],
  };

  const getScoreColor = (score: number | undefined, maxScore: number) => {
    if (!score) return "text-gray-600";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getEvaluationColor = (evaluation: string) => {
    switch (evaluation) {
      case "Positiva":
        return "bg-green-100 text-green-800";
      case "Neutra":
        return "bg-yellow-100 text-yellow-800";
      case "Negativa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800";
      case "Intermediário":
        return "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const scorePercentage = submission.score
    ? (submission.score / submission.question.maxScore) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalhes da Submissão</h1>
            <p className="text-muted-foreground mt-1">
              Análise completa da resposta do estudante
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question and Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Questão e Resposta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  {submission.question.title}
                </h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {submission.question.prompt}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  Resposta do Estudante
                </h3>
                <div className="bg-background p-4 rounded-lg border">
                  <p className="whitespace-pre-line">{submission.answer}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Análise Detalhada da IA
              </CardTitle>
              <CardDescription>
                Breakdown completo da avaliação por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submission.aiFeedbacks.map((feedback, index) => (
                  <Card
                    key={feedback.id}
                    className={`${
                      feedback.points_deducted > 0
                        ? "border-yellow-200"
                        : "border-green-200"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {feedback.category}
                          </CardTitle>
                          <CardDescription>
                            {feedback.explanation}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {feedback.points_deducted > 0 ? (
                            <div className="flex items-center text-yellow-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                -{feedback.points_deducted} ponto
                                {feedback.points_deducted > 1 ? "s" : ""}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                Perfeito!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Estudante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{submission.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marathon Info */}
          <Card>
            <CardHeader>
              <CardTitle>Maratona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{submission.marathon.title}</p>
                <Badge
                  className={getDifficultyColor(submission.marathon.difficulty)}
                >
                  {submission.marathon.difficulty}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Enviado em{" "}
                {new Date(submission.submitted_at).toLocaleDateString("pt-BR")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(submission.submitted_at).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </CardContent>
          </Card>

          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Pontuação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getScoreColor(
                    submission.score,
                    submission.question.maxScore
                  )}`}
                >
                  {submission.score ?? "-"} / {submission.question.maxScore}
                </div>
                <p className="text-muted-foreground">
                  {scorePercentage.toFixed(0)}% de acerto
                </p>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avaliação da IA:</span>
                  <Badge
                    className={getEvaluationColor(submission.aiEvaluation)}
                  >
                    {submission.aiEvaluation}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Corrigida por IA:</span>
                  <span className="text-sm">
                    {submission.corrected_by_ai ? "Sim" : "Não"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
