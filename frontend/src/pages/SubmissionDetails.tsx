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
  Loader2,
  FileX,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSubmissionDetails } from "@/hooks/use-submission-details";
import { DetailedSubmission } from "@/services/submission.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Constants
const MAX_SCORE = 100;
const SCORE_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 50,
} as const;

const EVALUATION_TYPES = {
  POSITIVE: "Positiva",
  NEUTRAL: "Neutra",
  NEGATIVE: "Negativa",
  PENDING: "Pendente",
} as const;

const SubmissionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submissionId } = useParams<{ submissionId: string }>();

  // Fetch submission details from API
  const {
    data: submission,
    isLoading,
    error,
  } = useSubmissionDetails(submissionId || "");

  // Clean code: Extract utility functions
  const calculateAiEvaluation = (score: number | null): string => {
    if (score === null || score === undefined) return EVALUATION_TYPES.PENDING;
    const percentage = (score / MAX_SCORE) * 100;
    if (percentage >= SCORE_THRESHOLDS.HIGH) return EVALUATION_TYPES.POSITIVE;
    if (percentage >= SCORE_THRESHOLDS.MEDIUM) return EVALUATION_TYPES.NEUTRAL;
    return EVALUATION_TYPES.NEGATIVE;
  };

  const getScoreColor = (score: number | null): string => {
    if (score === null) return "text-gray-600";
    const percentage = (score / MAX_SCORE) * 100;
    if (percentage >= SCORE_THRESHOLDS.HIGH) return "text-green-600";
    if (percentage >= SCORE_THRESHOLDS.MEDIUM) return "text-yellow-600";
    return "text-red-600";
  };

  const getEvaluationColor = (evaluation: string): string => {
    const colorMap: Record<string, string> = {
      [EVALUATION_TYPES.POSITIVE]: "bg-green-100 text-green-800",
      [EVALUATION_TYPES.NEUTRAL]: "bg-yellow-100 text-yellow-800",
      [EVALUATION_TYPES.NEGATIVE]: "bg-red-100 text-red-800",
      [EVALUATION_TYPES.PENDING]: "bg-gray-100 text-gray-800",
    };

    return colorMap[evaluation] || "bg-gray-100 text-gray-800";
  };

  // Handle back navigation with preserved filters
  const handleBackNavigation = () => {
    const returnUrl = location.state?.returnUrl;
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      // Fallback to teacher submissions page
      navigate("/submissions");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando detalhes da submissão...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !submission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <FileX className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium">Submissão não encontrada</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes desta submissão.
            </p>
          </div>
          <Button variant="outline" onClick={handleBackNavigation}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Calculate derived data
  const aiEvaluation = calculateAiEvaluation(submission.score);
  console.log(submission.score);
  const scorePercentage = submission.score
    ? (submission.score / MAX_SCORE) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex  gap-4">
          <Button variant="outline" onClick={handleBackNavigation}>
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
                    {submission.question.prompt_text}
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
                {submission.AiFeedbacks.map((feedback, index) => (
                  <Card
                    key={feedback.id}
                    className={`${
                      feedback.points_deducted > 0
                        ? "border-yellow-200"
                        : "border-green-200"
                    }`}
                  >
                    <CardHeader className="pb-3 pt-3">
                      <div className="flex items-start justify-between">
                        <div className="w-full">
                          <CardTitle className="text-base">
                            {feedback.category}
                          </CardTitle>
                          <CardDescription className="w-[95%]">
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

          {/* Submission Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Submissão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Enviado em{" "}
                {format(new Date(submission.submitted_at), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(new Date(submission.submitted_at), "HH:mm", {
                  locale: ptBR,
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
                    submission.score
                  )}`}
                >
                  {submission.score ?? "-"} / {MAX_SCORE}
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
                  <Badge className={getEvaluationColor(aiEvaluation)}>
                    {aiEvaluation}
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
