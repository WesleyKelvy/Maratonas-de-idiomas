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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAiFeedbackBySubmissionId } from "@/hooks/use-aiFeedback";
import { useProcessedUserSubmissions } from "@/hooks/use-submission";
import { SubmissionWithDetails } from "@/services/submission.service";
import {
  AlertCircle,
  Award,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  Trophy,
  CircleAlert,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StudentSubmissions = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [marathonFilter, setMarathonFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionWithDetails | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const { submissions, stats, isLoading, error } =
    useProcessedUserSubmissions();

  const {
    data: aiFeedbackData,
    isLoading: feedbackLoading,
    error: feedbackError,
    isFetching,
    isSuccess,
  } = useAiFeedbackBySubmissionId(
    selectedSubmission?.id,
    !!selectedSubmission && feedbackDialogOpen
  );

  const marathons = [...new Set(submissions.map((s) => s.marathonName))];

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.marathonName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.question.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMarathon =
      marathonFilter === "all" || submission.marathonName === marathonFilter;

    const matchesScore =
      scoreFilter === "all" ||
      (scoreFilter === "high" && submission.percentage >= 80) ||
      (scoreFilter === "medium" &&
        submission.percentage >= 50 &&
        submission.percentage < 80) ||
      (scoreFilter === "low" && submission.percentage < 50);

    return matchesSearch && matchesMarathon && matchesScore;
  });

  // Funções auxiliares para estilização
  const getScoreColor = (percentage: number) => {
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

  const handleViewFeedback = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = (open: boolean) => {
    setFeedbackDialogOpen(open);
    if (!open) {
      // Limpar submissão selecionada quando fechar o modal
      setTimeout(() => setSelectedSubmission(null), 200);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Erro ao carregar submissões
            </h3>
            <p className="text-muted-foreground text-center">
              Não foi possível carregar suas submissões. Tente novamente mais
              tarde.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Submissões</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe suas respostas e feedback detalhado das maratonas
          </p>
        </div>
      </div>

      {/* Statistics */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Minhas Submissões
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                Respostas enviadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minha Média</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.averageScore * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Em todas as submissões
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alto Desempenho
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.highScoreSubmissions}
              </div>
              <p className="text-xs text-muted-foreground">
                Submissões com 80%+ de acerto
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar minhas submissões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={marathonFilter} onValueChange={setMarathonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por maratona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as maratonas</SelectItem>
                {marathons.map((marathon) => (
                  <SelectItem key={marathon} value={marathon}>
                    {marathon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por pontuação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as pontuações</SelectItem>
                <SelectItem value="high">Alta (80%+)</SelectItem>
                <SelectItem value="medium">Média (50-79%)</SelectItem>
                <SelectItem value="low">Baixa (&lt; 50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Submissões</CardTitle>
          <CardDescription>
            Suas respostas enviadas com feedback detalhado da IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Maratona</TableHead>
                  <TableHead>Questão</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? // Loading skeleton
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  : // Real data
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">
                              {submission.marathonName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Questão {submission.questionNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div
                            className="truncate"
                            title={submission.question.title}
                          >
                            {submission.question.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span
                              className={`font-bold ${getScoreColor(
                                submission.percentage
                              )}`}
                            >
                              {submission.totalScore}/100
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {submission.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getEvaluationColor(
                              submission.aiEvaluation
                            )}
                          >
                            {submission.aiEvaluation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(submission.submitted_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFeedback(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Feedback
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {!isLoading && filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma submissão encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || marathonFilter !== "all" || scoreFilter !== "all"
                  ? "Tente ajustar os filtros para encontrar submissões."
                  : "Você ainda não fez submissões. Participe de uma maratona para começar!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Feedback Modal */}
      <Dialog
        open={feedbackDialogOpen}
        onOpenChange={handleCloseFeedbackDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Detalhado</DialogTitle>
            <DialogDescription>
              Análise completa da sua submissão pela IA
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Submission Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedSubmission.marathonName}
                  </CardTitle>
                  <CardDescription>
                    Questão {selectedSubmission.questionNumber} • Enviado em{" "}
                    {formatDate(selectedSubmission.submitted_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Pergunta:</h4>
                      <p className="text-muted-foreground">
                        {selectedSubmission.question.title}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Sua Resposta:</h4>
                      <p className="text-muted-foreground">
                        {selectedSubmission.answer}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-sm font-medium">Pontuação:</span>
                        <span
                          className={`ml-2 font-bold ${getScoreColor(
                            selectedSubmission.percentage
                          )}`}
                        >
                          {selectedSubmission.totalScore}/100
                        </span>
                      </div>
                      <Badge
                        className={getEvaluationColor(
                          selectedSubmission.aiEvaluation
                        )}
                      >
                        {selectedSubmission.aiEvaluation}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Feedback */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Análise Detalhada</h3>
                  {aiFeedbackData && aiFeedbackData.length > 0 && (
                    <Badge variant="outline">
                      {aiFeedbackData.length} feedback
                      {aiFeedbackData.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                {feedbackLoading ? (
                  // Loading skeleton para feedback
                  [...Array(3)].map((_, i) => (
                    <Card key={i} className="border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                          </div>
                          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : feedbackError ? (
                  // Erro ao carregar feedback
                  <Card className="border-red-200">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Erro ao carregar feedback detalhado. Tente novamente
                        mais tarde.
                      </p>
                    </CardContent>
                  </Card>
                ) : aiFeedbackData && aiFeedbackData.length > 0 ? (
                  // Feedback real da API
                  aiFeedbackData.map((feedback, index) => (
                    <Card
                      key={feedback.id}
                      className={`${
                        feedback.points_deducted > 0
                          ? "border-red-200 bg-red-50"
                          : "border-yellow-200 bg-yellow-50"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-base">
                                {feedback.category}
                              </CardTitle>
                              <Badge
                                variant={
                                  feedback.points_deducted > 0
                                    ? "destructive"
                                    : "default"
                                }
                                className="text-xs"
                              >
                                {feedback.points_deducted > 0
                                  ? `${feedback.points_deducted} pontos`
                                  : "Perfeito"}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm text-black">
                              {feedback.explanation}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {feedback.points_deducted > 0 ? (
                              <div className="flex items-center text-red-600">
                                <AlertCircle className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <CircleAlert className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  // Nenhum feedback encontrado
                  <Card className="border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Nenhum feedback detalhado disponível para esta
                        submissão.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Resumo do Feedback:</h4>
                  {feedbackLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">
                        Carregando análise detalhada...
                      </span>
                    </div>
                  ) : aiFeedbackData && aiFeedbackData.length > 0 ? (
                    <div className="space-y-2">
                      <p>
                        Foram identificados{" "}
                        <strong>{aiFeedbackData.length}</strong> pontos de
                        análise em sua resposta.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">Total deduzido:</span>
                          {(() => {
                            const totalDeducted = aiFeedbackData.reduce(
                              (total, f) => total + f.points_deducted,
                              0
                            );
                            return (
                              <Badge
                                variant={
                                  totalDeducted > 0 ? "destructive" : "default"
                                }
                              >
                                {totalDeducted} pontos
                              </Badge>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Sua resposta foi avaliada com pontuação direta, sem
                      feedback detalhado disponível.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSubmissions;
