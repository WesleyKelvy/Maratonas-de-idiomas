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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClassrooms } from "@/hooks/use-classroom";
import { useMarathons } from "@/hooks/use-marathon";
import { useSubmissionsByMarathon } from "@/hooks/useSubmissions";
import { SubmissionTable } from "@/services/submission.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Filter,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

const FILTER_VALUES = {
  ALL: "all",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

const TeacherSubmissions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [classroomFilter, setClassroomFilter] = useState(
    searchParams.get("classroom") || ""
  );
  const [marathonFilter, setMarathonFilter] = useState(
    searchParams.get("marathon") || ""
  );
  const [studentFilter, setStudentFilter] = useState(
    searchParams.get("student") || "all"
  );
  const [scoreFilter, setScoreFilter] = useState(
    searchParams.get("score") || "all"
  );
  const [evaluationFilter, setEvaluationFilter] = useState(
    searchParams.get("evaluation") || "all"
  );
  const [showFilters, setShowFilters] = useState(
    searchParams.get("showFilters") === "true"
  );

  // Fetch classrooms (assuming teacher role)
  const { data: classrooms, isLoading: loadingClassrooms } = useClassrooms();

  // Use selected classroom or first one as fallback
  const selectedClassroomId = classroomFilter || classrooms?.[0]?.id || "";
  const { data: classroomMarathons = [], isLoading: loadingMarathons } =
    useMarathons(selectedClassroomId);

  // Combine all marathons from selected classroom
  const allMarathons = useMemo(() => {
    if (!classroomMarathons) return [];

    return classroomMarathons.map((marathon) => ({
      ...marathon,
      classroomName:
        classrooms?.find((c) => c.id === marathon.classroom_id)?.name ||
        "Classroom desconhecida",
    }));
  }, [classroomMarathons, classrooms]);

  // Get submissions for selected marathon
  const shouldFetchSubmissions =
    marathonFilter !== FILTER_VALUES.ALL && marathonFilter !== "";
  const { data: submissions = [], isLoading: loadingSubmissions } =
    useSubmissionsByMarathon(shouldFetchSubmissions ? marathonFilter : "");

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchTerm && searchTerm !== "") newParams.set("search", searchTerm);
    if (classroomFilter && classroomFilter !== "")
      newParams.set("classroom", classroomFilter);
    if (marathonFilter && marathonFilter !== "all" && marathonFilter !== "")
      newParams.set("marathon", marathonFilter);
    if (studentFilter && studentFilter !== "all")
      newParams.set("student", studentFilter);
    if (scoreFilter && scoreFilter !== "all")
      newParams.set("score", scoreFilter);
    if (evaluationFilter && evaluationFilter !== "all")
      newParams.set("evaluation", evaluationFilter);
    if (showFilters) newParams.set("showFilters", "true");

    setSearchParams(newParams, { replace: true });
  }, [
    searchTerm,
    classroomFilter,
    marathonFilter,
    studentFilter,
    scoreFilter,
    evaluationFilter,
    showFilters,
    setSearchParams,
  ]);

  // Calculate AI evaluation based on score
  const calculateAiEvaluation = (score: number | null): string => {
    if (score === null || score === undefined) return EVALUATION_TYPES.PENDING;
    const percentage = (score / MAX_SCORE) * 100;
    if (percentage >= SCORE_THRESHOLDS.HIGH) return EVALUATION_TYPES.POSITIVE;
    if (percentage >= SCORE_THRESHOLDS.MEDIUM) return EVALUATION_TYPES.NEUTRAL;
    return EVALUATION_TYPES.NEGATIVE;
  };

  const allSubmissions = useMemo(() => {
    // Get unique question_ids and sort them
    const uniqueQuestionIds = Array.from(
      new Set(submissions.map((s) => s.question_id))
    ).sort((a, b) => a - b);

    // Create a map from real question_id to sequential number
    const questionIdToSequential = new Map(
      uniqueQuestionIds.map((id, index) => [id, index + 1])
    );

    return submissions.map((submission) => ({
      ...submission,
      marathon_id: marathonFilter, // Add marathon_id from filter
      aiEvaluation: calculateAiEvaluation(submission.score),
      sequentialQuestionId:
        questionIdToSequential.get(submission.question_id) || 1,
      marathon: {
        title:
          allMarathons.find((m) => m.id === marathonFilter)?.title ||
          "Maratona",
      },
    }));
  }, [submissions, marathonFilter, allMarathons]);

  // Create marathon options for filter
  const marathonOptions = useMemo(() => {
    return allMarathons.map((marathon) => ({
      id: marathon.id,
      name: marathon.title,
    }));
  }, [allMarathons]);

  // Create unique students list from submissions
  const students = useMemo(() => {
    const studentsMap = new Map<string, { id: string; name: string }>();

    allSubmissions.forEach((submission) => {
      if (!studentsMap.has(submission.user_id)) {
        studentsMap.set(submission.user_id, {
          id: submission.user_id,
          name: submission.user?.name || "Estudante desconhecido",
        });
      }
    });

    return Array.from(studentsMap.values());
  }, [allSubmissions]);

  // Filter functions
  const filterBySearch = (
    submission: SubmissionTable & {
      aiEvaluation: string;
      marathon: { title: string };
    },
    searchTerm: string
  ): boolean => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const searchableFields = [
      submission.user?.name || "",
      submission.marathon?.title || "",
    ];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(searchLower)
    );
  };

  const filterByScore = (
    submission: SubmissionTable,
    scoreFilter: string
  ): boolean => {
    if (scoreFilter === FILTER_VALUES.ALL || !submission.score) return true;

    const percentage = (submission.score / MAX_SCORE) * 100;

    switch (scoreFilter) {
      case FILTER_VALUES.HIGH:
        return percentage >= SCORE_THRESHOLDS.HIGH;
      case FILTER_VALUES.MEDIUM:
        return (
          percentage >= SCORE_THRESHOLDS.MEDIUM &&
          percentage < SCORE_THRESHOLDS.HIGH
        );
      case FILTER_VALUES.LOW:
        return percentage < SCORE_THRESHOLDS.MEDIUM;
      default:
        return true;
    }
  };

  const applyFilters = (
    submissions: (SubmissionTable & {
      aiEvaluation: string;
      marathon: { title: string };
      sequentialQuestionId: number;
      marathon_id: string;
    })[],
    filters: {
      search: string;
      marathon: string;
      student: string;
      score: string;
      evaluation: string;
    }
  ) => {
    return submissions.filter((submission) => {
      const matchesSearch = filterBySearch(submission, filters.search);
      const matchesMarathon =
        filters.marathon === FILTER_VALUES.ALL ||
        filters.marathon === "" ||
        submission.marathon_id === filters.marathon;
      const matchesStudent =
        filters.student === FILTER_VALUES.ALL ||
        submission.user_id === filters.student;
      const matchesEvaluation =
        filters.evaluation === FILTER_VALUES.ALL ||
        submission.aiEvaluation === filters.evaluation;
      const matchesScore = filterByScore(submission, filters.score);

      return (
        matchesSearch &&
        matchesMarathon &&
        matchesStudent &&
        matchesScore &&
        matchesEvaluation
      );
    });
  };

  const filteredSubmissions = useMemo(() => {
    return applyFilters(allSubmissions, {
      search: searchTerm,
      marathon: marathonFilter,
      student: studentFilter,
      score: scoreFilter,
      evaluation: evaluationFilter,
    });
  }, [
    allSubmissions,
    searchTerm,
    marathonFilter,
    studentFilter,
    scoreFilter,
    evaluationFilter,
  ]);

  // Styling functions
  const getScoreColor = (score: number | null, maxScore: number): string => {
    if (score === null) return "text-gray-600";

    const percentage = (score / maxScore) * 100;
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

  const handleViewDetails = (submissionId: string) => {
    const currentUrl = `/submissions?${searchParams.toString()}`;
    navigate(`/submissions/${submissionId}`, {
      state: { returnUrl: currentUrl },
    });
  };

  // Calculate statistics
  const calculateStatistics = (submissions: SubmissionTable[]) => {
    const totalSubmissions = submissions.length;
    const uniqueStudents = new Set(submissions.map((s) => s.user_id)).size;

    const submissionsWithScore = submissions.filter(
      (sub) => sub.score !== null
    );
    const averageScore =
      submissionsWithScore.length === 0
        ? 0
        : submissionsWithScore.reduce(
            (acc, sub) => acc + sub.score! / MAX_SCORE,
            0
          ) / submissionsWithScore.length;

    return {
      totalSubmissions,
      uniqueStudents,
      averageScore,
    };
  };

  const statistics = useMemo(
    () => calculateStatistics(filteredSubmissions),
    [filteredSubmissions]
  );
  const { totalSubmissions, uniqueStudents, averageScore } = statistics;

  // Loading states
  const isLoading = loadingClassrooms || loadingMarathons || loadingSubmissions;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando submissões...</span>
        </div>
      </div>
    );
  }

  // Show message when no marathon is selected
  if (!shouldFetchSubmissions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Todas as Submissões</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie e analise todas as submissões dos estudantes
            </p>
          </div>
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
                <Select
                  value={classroomFilter}
                  onValueChange={(value) => {
                    setClassroomFilter(value);
                    setMarathonFilter(""); // Reset marathon filter when classroom changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms?.map((classroom, index) => (
                      <SelectItem
                        key={`classroom-${classroom.id}-${index}`}
                        value={classroom.id}
                      >
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={marathonFilter}
                  onValueChange={setMarathonFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma maratona" />
                  </SelectTrigger>
                  <SelectContent>
                    {marathonOptions.map((marathon, index) => (
                      <SelectItem
                        key={`marathon-${marathon.id}-${index}`}
                        value={marathon.id}
                      >
                        {marathon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Selecione uma maratona
              </h3>
              <p className="text-muted-foreground">
                Escolha uma maratona específica nos filtros acima para
                visualizar as submissões dos estudantes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todas as Submissões</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e analise todas as submissões dos estudantes
          </p>
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
            <p className="text-xs text-muted-foreground">Nesta maratona</p>
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
              Participantes desta maratona
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
              {(averageScore * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Média desta maratona
            </p>
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
              <Select
                value={classroomFilter}
                onValueChange={(value) => {
                  setClassroomFilter(value);
                  setMarathonFilter(""); // Reset marathon filter when classroom changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms?.map((classroom, index) => (
                    <SelectItem
                      key={`classroom-filter-${classroom.id}-${index}`}
                      value={classroom.id}
                    >
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={marathonFilter} onValueChange={setMarathonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma maratona" />
                </SelectTrigger>
                <SelectContent>
                  {marathonOptions.map((marathon, index) => (
                    <SelectItem
                      key={`marathon-filter-${marathon.id}-${index}`}
                      value={marathon.id}
                    >
                      {marathon.name}
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
                  {students.map((student, index) => (
                    <SelectItem
                      key={`student-${student.id}-${index}`}
                      value={student.id}
                    >
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
                  <TableHead>Questão</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Avaliação da IA</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission, index) => (
                  <TableRow key={`${submission.id}-${index}`}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {submission.user?.name || "Estudante desconhecido"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          Questão {submission.sequentialQuestionId}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold ${getScoreColor(
                            submission.score,
                            MAX_SCORE
                          )}`}
                        >
                          {submission.score !== null
                            ? `${submission.score}/${MAX_SCORE}`
                            : "Pendente"}
                        </span>
                        {submission.score !== null && (
                          <span className="text-xs text-muted-foreground">
                            {((submission.score / MAX_SCORE) * 100).toFixed(0)}%
                          </span>
                        )}
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
                        {format(
                          new Date(submission.submitted_at),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
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
                studentFilter !== FILTER_VALUES.ALL ||
                scoreFilter !== FILTER_VALUES.ALL ||
                evaluationFilter !== FILTER_VALUES.ALL
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
