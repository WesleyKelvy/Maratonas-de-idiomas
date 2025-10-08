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
  Search,
  FileText,
  Users,
  Eye,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  marathonId: string;
  marathonName: string;
  questionId: number;
  questionTitle: string;
  answer: string;
  score: number;
  maxScore: number;
  submissionDate: string;
  aiEvaluation: string;
  correctedByAi: boolean;
}

const TeacherSubmissions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [marathonFilter, setMarathonFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [evaluationFilter, setEvaluationFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock data - replace with API call
  const allSubmissions: StudentSubmission[] = [
    {
      id: "1",
      studentId: "student1",
      studentName: "João Silva",
      studentEmail: "joao@email.com",
      marathonId: "marathon1",
      marathonName: "Maratona de JavaScript",
      questionId: 1,
      questionTitle: "Diferenças entre let, const e var",
      answer:
        "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco...",
      score: 9,
      maxScore: 10,
      submissionDate: "2024-12-05T14:30:00",
      aiEvaluation: "Positiva",
      correctedByAi: true,
    },
    {
      id: "2",
      studentId: "student1",
      studentName: "João Silva",
      studentEmail: "joao@email.com",
      marathonId: "marathon1",
      marathonName: "Maratona de JavaScript",
      questionId: 2,
      questionTitle: "Closures em JavaScript",
      answer:
        "Closures são funções que têm acesso ao escopo da função externa...",
      score: 7,
      maxScore: 10,
      submissionDate: "2024-12-05T14:45:00",
      aiEvaluation: "Neutra",
      correctedByAi: true,
    },
    {
      id: "3",
      studentId: "student2",
      studentName: "Maria Santos",
      studentEmail: "maria@email.com",
      marathonId: "marathon1",
      marathonName: "Maratona de JavaScript",
      questionId: 1,
      questionTitle: "Diferenças entre let, const e var",
      answer: "var é uma palavra-chave antiga para declarar variáveis...",
      score: 6,
      maxScore: 10,
      submissionDate: "2024-12-05T15:00:00",
      aiEvaluation: "Neutra",
      correctedByAi: true,
    },
    {
      id: "4",
      studentId: "student3",
      studentName: "Pedro Oliveira",
      studentEmail: "pedro@email.com",
      marathonId: "marathon2",
      marathonName: "Python para Iniciantes",
      questionId: 1,
      questionTitle: "Características do Python",
      answer: "Python é uma linguagem interpretada e orientada a objetos...",
      score: 10,
      maxScore: 10,
      submissionDate: "2024-12-04T16:20:00",
      aiEvaluation: "Positiva",
      correctedByAi: true,
    },
  ];

  const marathons = [...new Set(allSubmissions.map((s) => s.marathonName))];
  const students = [
    ...new Set(
      allSubmissions.map((s) => ({ id: s.studentId, name: s.studentName }))
    ),
  ];

  const filteredSubmissions = allSubmissions.filter((submission) => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.marathonName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.questionTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      submission.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMarathon =
      marathonFilter === "all" || submission.marathonName === marathonFilter;
    const matchesStudent =
      studentFilter === "all" || submission.studentId === studentFilter;
    const matchesEvaluation =
      evaluationFilter === "all" ||
      submission.aiEvaluation === evaluationFilter;

    const matchesScore =
      scoreFilter === "all" ||
      (scoreFilter === "high" &&
        submission.score / submission.maxScore >= 0.8) ||
      (scoreFilter === "medium" &&
        submission.score / submission.maxScore >= 0.5 &&
        submission.score / submission.maxScore < 0.8) ||
      (scoreFilter === "low" && submission.score / submission.maxScore < 0.5);

    return (
      matchesSearch &&
      matchesMarathon &&
      matchesStudent &&
      matchesScore &&
      matchesEvaluation
    );
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

  const handleViewDetails = (submissionId: string) => {
    navigate(`/submissions/${submissionId}`);
  };

  const handleExportSubmissions = () => {
    // Mock export functionality
    console.log("Exporting submissions...");
  };

  const handleGenerateReport = async (marathonId: string) => {
    setIsGeneratingReport(true);
    try {
      // Mock API call to create report
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate(`/marathons/${marathonId}/report`);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const totalSubmissions = allSubmissions.length;
  const uniqueStudents = new Set(allSubmissions.map((s) => s.studentId)).size;
  const averageScore =
    allSubmissions.reduce((acc, sub) => acc + sub.score / sub.maxScore, 0) /
    totalSubmissions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todas as Submissões</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e analise todas as submissões dos estudantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleGenerateReport("marathon1")} 
            variant="default"
            disabled={isGeneratingReport}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isGeneratingReport ? "Gerando..." : "Gerar Relatório"}
          </Button>
          {/* <Button onClick={handleExportSubmissions} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button> */}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
            <CardTitle className="text-sm font-medium">
              Total de Submissões
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              De todos os estudantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
            <CardTitle className="text-sm font-medium">
              Estudantes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-2xl font-bold">{uniqueStudents}</div>
            <p className="text-xs text-muted-foreground">
              Fizeram pelo menos 1 submissão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-2xl font-bold">
              {(averageScore * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Todas as submissões</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader
          className="cursor-pointer p-6"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            {showFilters ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por aluno, maratona..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={marathonFilter} onValueChange={setMarathonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Maratona" />
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
              <Select value={studentFilter} onValueChange={setStudentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estudante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estudantes</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pontuação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as pontuações</SelectItem>
                  <SelectItem value="high">Alta (80%+)</SelectItem>
                  <SelectItem value="medium">Média (50-79%)</SelectItem>
                  <SelectItem value="low">Baixa (&lt; 50%)</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={evaluationFilter}
                onValueChange={setEvaluationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as avaliações</SelectItem>
                  <SelectItem value="Positiva">Positiva</SelectItem>
                  <SelectItem value="Neutra">Neutra</SelectItem>
                  <SelectItem value="Negativa">Negativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissões dos Estudantes</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as submissões por estudante
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-y-auto max-h-[35vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Maratona</TableHead>
                  <TableHead>Questão</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Avaliação da IA</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {submission.studentName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.studentEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.marathonName}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          Q{submission.questionId}
                        </div>
                        <div
                          className="text-sm text-muted-foreground truncate max-w-xs"
                          title={submission.questionTitle}
                        >
                          {submission.questionTitle}
                        </div>
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
                      <div className="text-sm text-muted-foreground">
                        {new Date(submission.submissionDate).toLocaleDateString(
                          "pt-BR"
                        )}{" "}
                        às{" "}
                        {new Date(submission.submissionDate).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(submission.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
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
                {searchTerm ||
                marathonFilter !== "all" ||
                studentFilter !== "all" ||
                scoreFilter !== "all" ||
                evaluationFilter !== "all"
                  ? "Tente ajustar os filtros para encontrar submissões."
                  : "Ainda não há submissões de estudantes."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSubmissions;
