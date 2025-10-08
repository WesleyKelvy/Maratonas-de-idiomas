import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  FileText,
  Trophy,
  Clock,
  Eye,
  Award,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SubmissionDetail {
  id: string;
  marathonName: string;
  questionNumber: number;
  question: string;
  answer: string;
  feedback: string;
  score: number;
  maxScore: number;
  submissionDate: string;
  aiEvaluation: string;
  detailedFeedback: {
    explanation: string;
    pointsDeducted: number;
    category: string;
    suggestions: string[];
  }[];
}

const StudentSubmissions = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [marathonFilter, setMarathonFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDetail | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Mock data - replace with API call
  const mySubmissions: SubmissionDetail[] = [
    {
      id: "1",
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript e demonstre com exemplos práticos.",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. const é usado para constantes que não podem ser reatribuídas. var tem escopo de função e pode causar problemas de hoisting...",
      feedback:
        "Excelente resposta! Você demonstrou um bom entendimento do conceito.",
      score: 90,
      maxScore: 100,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      detailedFeedback: [
        {
          explanation: "Ótima explicação sobre escopo de bloco vs função",
          pointsDeducted: 0,
          category: "Conceitos Fundamentais",
          suggestions: [],
        },
        {
          explanation: "Poderia ter mencionado temporal dead zone",
          pointsDeducted: 1,
          category: "Detalhes Avançados",
          suggestions: [
            "Adicione exemplos de temporal dead zone",
            "Explique o comportamento do hoisting com let/const",
          ],
        },
      ],
    },
    {
      id: "2",
      marathonName: "Maratona de JavaScript",
      questionNumber: 2,
      question: "O que são closures em JavaScript e como elas funcionam?",
      answer:
        "Closures são funções que têm acesso ao escopo da função externa mesmo após ela ter retornado. Isso permite criar funções privadas...",
      feedback:
        "Boa resposta, mas poderia ser mais detalhada com exemplos práticos.",
      score: 70,
      maxScore: 100,
      submissionDate: "2024-12-05T14:45:00",
      aiEvaluation: "Neutra",
      detailedFeedback: [
        {
          explanation: "Conceito básico bem explicado",
          pointsDeducted: 0,
          category: "Definição",
          suggestions: [],
        },
        {
          explanation: "Faltaram exemplos práticos de uso",
          pointsDeducted: 2,
          category: "Exemplos Práticos",
          suggestions: [
            "Adicione exemplos de closures em callbacks",
            "Mostre casos de uso com módulos",
          ],
        },
        {
          explanation: "Não mencionou memory leaks potenciais",
          pointsDeducted: 1,
          category: "Considerações Importantes",
          suggestions: [
            "Explique quando closures podem causar vazamentos de memória",
          ],
        },
      ],
    },
    {
      id: "1",
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript e demonstre com exemplos práticos.",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. const é usado para constantes que não podem ser reatribuídas. var tem escopo de função e pode causar problemas de hoisting...",
      feedback:
        "Excelente resposta! Você demonstrou um bom entendimento do conceito.",
      score: 90,
      maxScore: 100,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      detailedFeedback: [
        {
          explanation: "Ótima explicação sobre escopo de bloco vs função",
          pointsDeducted: 0,
          category: "Conceitos Fundamentais",
          suggestions: [],
        },
        {
          explanation: "Poderia ter mencionado temporal dead zone",
          pointsDeducted: 1,
          category: "Detalhes Avançados",
          suggestions: [
            "Adicione exemplos de temporal dead zone",
            "Explique o comportamento do hoisting com let/const",
          ],
        },
      ],
    },
    {
      id: "1",
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript e demonstre com exemplos práticos.",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. const é usado para constantes que não podem ser reatribuídas. var tem escopo de função e pode causar problemas de hoisting...",
      feedback:
        "Excelente resposta! Você demonstrou um bom entendimento do conceito.",
      score: 90,
      maxScore: 100,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      detailedFeedback: [
        {
          explanation: "Ótima explicação sobre escopo de bloco vs função",
          pointsDeducted: 0,
          category: "Conceitos Fundamentais",
          suggestions: [],
        },
        {
          explanation: "Poderia ter mencionado temporal dead zone",
          pointsDeducted: 1,
          category: "Detalhes Avançados",
          suggestions: [
            "Adicione exemplos de temporal dead zone",
            "Explique o comportamento do hoisting com let/const",
          ],
        },
      ],
    },
    {
      id: "1",
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript e demonstre com exemplos práticos.",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. const é usado para constantes que não podem ser reatribuídas. var tem escopo de função e pode causar problemas de hoisting...",
      feedback:
        "Excelente resposta! Você demonstrou um bom entendimento do conceito.",
      score: 90,
      maxScore: 100,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      detailedFeedback: [
        {
          explanation: "Ótima explicação sobre escopo de bloco vs função",
          pointsDeducted: 0,
          category: "Conceitos Fundamentais",
          suggestions: [],
        },
        {
          explanation: "Poderia ter mencionado temporal dead zone",
          pointsDeducted: 1,
          category: "Detalhes Avançados",
          suggestions: [
            "Adicione exemplos de temporal dead zone",
            "Explique o comportamento do hoisting com let/const",
          ],
        },
      ],
    },
    {
      id: "5",
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript e demonstre com exemplos práticos.",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco. const é usado para constantes que não podem ser reatribuídas. var tem escopo de função e pode causar problemas de hoisting...",
      feedback:
        "Excelente resposta! Você demonstrou um bom entendimento do conceito.",
      score: 90,
      maxScore: 100,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      detailedFeedback: [
        {
          explanation: "Ótima explicação sobre escopo de bloco vs função",
          pointsDeducted: 0,
          category: "Conceitos Fundamentais",
          suggestions: [],
        },
        {
          explanation: "Poderia ter mencionado temporal dead zone",
          pointsDeducted: 1,
          category: "Detalhes Avançados",
          suggestions: [
            "Adicione exemplos de temporal dead zone",
            "Explique o comportamento do hoisting com let/const",
          ],
        },
      ],
    },
  ];

  const marathons = [...new Set(mySubmissions.map((s) => s.marathonName))];

  const filteredSubmissions = mySubmissions.filter((submission) => {
    const matchesSearch =
      submission.marathonName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMarathon =
      marathonFilter === "all" || submission.marathonName === marathonFilter;

    const matchesScore =
      scoreFilter === "all" ||
      (scoreFilter === "high" &&
        submission.score / submission.maxScore >= 0.8) ||
      (scoreFilter === "medium" &&
        submission.score / submission.maxScore >= 0.5 &&
        submission.score / submission.maxScore < 0.8) ||
      (scoreFilter === "low" && submission.score / submission.maxScore < 0.5);

    return matchesSearch && matchesMarathon && matchesScore;
  });

  const getScoreColor = (score: number, maxScore: number) => {
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

  const handleViewFeedback = (submission: SubmissionDetail) => {
    setSelectedSubmission(submission);
    setFeedbackDialogOpen(true);
  };

  const totalSubmissions = mySubmissions.length;
  const averageScore =
    mySubmissions.reduce((acc, sub) => acc + sub.score / sub.maxScore, 0) /
    totalSubmissions;
  const highScoreSubmissions = mySubmissions.filter(
    (sub) => sub.score / sub.maxScore >= 0.8
  ).length;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Minhas Submissões
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Respostas enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minha Média</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(averageScore * 100).toFixed(1)}%
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
            <div className="text-2xl font-bold">{highScoreSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Submissões com 80%+ de acerto
            </p>
          </CardContent>
        </Card>
      </div>

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
                {filteredSubmissions.map((submission) => (
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
                      <div className="truncate" title={submission.question}>
                        {submission.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold ${getScoreColor(
                            submission.score,
                            submission.maxScore
                          )}`}
                        >
                          {submission.score}/{submission.maxScore}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(
                            (submission.score / submission.maxScore) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getEvaluationColor(submission.aiEvaluation)}
                      >
                        {submission.aiEvaluation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(submission.submissionDate).toLocaleDateString(
                          "pt-BR"
                        )}
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

          {filteredSubmissions.length === 0 && (
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
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
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
                    {new Date(
                      selectedSubmission.submissionDate
                    ).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Pergunta:</h4>
                      <p className="text-muted-foreground">
                        {selectedSubmission.question}
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
                            selectedSubmission.score,
                            selectedSubmission.maxScore
                          )}`}
                        >
                          {selectedSubmission.score}/
                          {selectedSubmission.maxScore}
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
                <h3 className="text-xl font-semibold">Análise Detalhada</h3>
                {selectedSubmission.detailedFeedback.map((feedback, index) => (
                  <Card
                    key={index}
                    className={`${
                      feedback.pointsDeducted > 0
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
                          {feedback.pointsDeducted > 0 ? (
                            <div className="flex items-center text-yellow-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                -{feedback.pointsDeducted} ponto
                                {feedback.pointsDeducted > 1 ? "s" : ""}
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
                    {feedback.suggestions.length > 0 && (
                      <CardContent className="pt-0">
                        <div>
                          <h5 className="font-medium mb-2 text-sm">
                            Sugestões de Melhoria:
                          </h5>
                          <ul className="space-y-1">
                            {feedback.suggestions.map(
                              (suggestion, suggestionIndex) => (
                                <li
                                  key={suggestionIndex}
                                  className="text-sm text-muted-foreground flex items-start"
                                >
                                  <span className="mr-2 text-primary">•</span>
                                  {suggestion}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Resumo do Feedback:</h4>
                  <p className="text-muted-foreground">
                    {selectedSubmission.feedback}
                  </p>
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
