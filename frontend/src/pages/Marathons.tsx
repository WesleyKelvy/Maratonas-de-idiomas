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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClassrooms } from "@/hooks/use-classroom";
import { useCreateMarathon, useMarathons } from "@/hooks/use-marathon";
import {
  CreateMarathonFormData,
  createMarathonFormSchema,
} from "@/schemas/marathon.schema";
import { LanguageMarathon } from "@/services/marathon.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  BookText,
  Clock,
  Eye,
  Loader2,
  Play,
  Plus,
  Search,
  TableOfContents,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Constants
const MARATHON_STATUS = {
  OPEN: "Aberta",
  FINISHED: "Finalizada",
  WAITING: "Aguardando início",
} as const;

const DIFFICULTY_LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

const DIFFICULTY_DISPLAY = {
  [DIFFICULTY_LEVELS.BEGINNER]: "Iniciante",
  [DIFFICULTY_LEVELS.INTERMEDIATE]: "Intermediário",
  [DIFFICULTY_LEVELS.ADVANCED]: "Avançado",
} as const;

const Marathons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");

  // Fetch real data from API
  const { data: classrooms = [], isLoading: loadingClassrooms } =
    useClassrooms();

  // Get marathons from the first classroom (or selected classroom)
  const firstClassroomId = selectedClassroomId || classrooms[0]?.id || "";
  const {
    data: marathons = [],
    isLoading: loadingMarathons,
    error: marathonsError,
  } = useMarathons(firstClassroomId);

  // Create marathon mutation
  const createMarathonMutation = useCreateMarathon();

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setDialogOpen(true);
      // Remove the parameter from URL
      setSearchParams({});
    }

    // Restore filters from URL parameters
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const difficulty = searchParams.get("difficulty");
    const classroom = searchParams.get("classroom");

    if (search) setSearchTerm(search);
    if (status) setStatusFilter(status);
    if (difficulty) setDifficultyFilter(difficulty);
    if (classroom) setSelectedClassroomId(classroom);
  }, [searchParams, setSearchParams]);

  // React Hook Form with Zod validation
  const form = useForm<CreateMarathonFormData>({
    resolver: zodResolver(createMarathonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      context: "",
      difficulty: "",
      timeLimit: "",
      startDate: "",
      endDate: "",
      number_of_questions: 1,
      classroom_id: "",
    },
  });

  // Watch timeLimit to control endDate field
  const timeLimit = form.watch("timeLimit");
  const isTimeLimitFilled = timeLimit && timeLimit.trim() !== "";

  const onSubmit = async (values: CreateMarathonFormData) => {
    try {
      const marathonData = {
        title: values.title,
        description: values.description || null,
        context: values.context || null,
        difficulty: values.difficulty as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
        number_of_questions: values.number_of_questions,
        startDate: values.startDate ? new Date(values.startDate) : null,
        endDate: values.endDate ? new Date(values.endDate) : null,
        timeLimit: values.timeLimit ? parseInt(values.timeLimit) : null,
      };

      const newMarathon = await createMarathonMutation.mutateAsync({
        classroomId: values.classroom_id,
        data: marathonData,
      });

      setDialogOpen(false);
      form.reset();

      // Navigate to question management
      navigate(`question-management/${newMarathon.id}`);
    } catch (error) {
      console.error("Error creating marathon:", error);
    }
  };

  // Utility functions
  const getMarathonStatus = (marathon: LanguageMarathon): string => {
    const now = new Date();
    const startDate = marathon.start_date
      ? new Date(marathon.start_date)
      : null;
    const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

    if (endDate && now > endDate) return MARATHON_STATUS.FINISHED;
    if (startDate && now < startDate) return MARATHON_STATUS.WAITING;
    return MARATHON_STATUS.OPEN;
  };

  const getDifficultyDisplay = (difficulty: string): string => {
    return (
      DIFFICULTY_DISPLAY[difficulty as keyof typeof DIFFICULTY_DISPLAY] ||
      difficulty
    );
  };

  const formatDateTime = (date: string): string => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const filteredMarathons = marathons.filter((marathon) => {
    const matchesSearch =
      marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (marathon.description &&
        marathon.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const marathonStatus = getMarathonStatus(marathon);
    const matchesStatus =
      statusFilter === "all" || marathonStatus === statusFilter;

    // Map difficulty filter to English values for comparison
    const marathonDifficultyDisplay = getDifficultyDisplay(marathon.difficulty);
    const matchesDifficulty =
      difficultyFilter === "all" ||
      marathonDifficultyDisplay === difficultyFilter;

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
            <DialogContent className="max-w-xl max-h-[92dvh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar nova Maratona</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova maratona.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Maratona de JavaScript"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classroom_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turma *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma turma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classrooms.map((classroom) => (
                                <SelectItem
                                  key={classroom.id}
                                  value={classroom.id}
                                >
                                  {classroom.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descrição da maratona (opcional)"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contexto *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Contexto técnico da maratona, tecnologias abordadas..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dificuldade *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={DIFFICULTY_LEVELS.BEGINNER}>
                                {DIFFICULTY_DISPLAY[DIFFICULTY_LEVELS.BEGINNER]}
                              </SelectItem>
                              <SelectItem
                                value={DIFFICULTY_LEVELS.INTERMEDIATE}
                              >
                                {
                                  DIFFICULTY_DISPLAY[
                                    DIFFICULTY_LEVELS.INTERMEDIATE
                                  ]
                                }
                              </SelectItem>
                              <SelectItem value={DIFFICULTY_LEVELS.ADVANCED}>
                                {DIFFICULTY_DISPLAY[DIFFICULTY_LEVELS.ADVANCED]}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo Limite (min) *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="120"
                              min="1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="number_of_questions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Questões *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="10"
                              min="1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início *</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Fim</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                              disabled={isTimeLimitFilled}
                            />
                          </FormControl>
                          {isTimeLimitFilled && (
                            <FormDescription className="text-xs text-gray-500">
                              Campo bloqueado pois tempo limite está definido.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
              </Form>
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

      {/* Loading State */}
      {(loadingClassrooms || loadingMarathons) && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando maratonas...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {marathonsError && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar maratonas
            </h3>
            <p className="text-gray-600">
              Não foi possível carregar as maratonas. Tente novamente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Maratonas */}
      {!loadingClassrooms && !loadingMarathons && !marathonsError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto h-[65dvh] rounded-lg">
          {filteredMarathons.map((marathon) => {
            const marathonStatus = getMarathonStatus(marathon);
            return (
              <Card
                key={marathon.id}
                className="hover:shadow-lg transition-shadow h-fit"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">
                        {marathon.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">Código: {marathon.code}</Badge>
                        <Badge className={getStatusColor(marathonStatus)}>
                          {marathonStatus}
                        </Badge>
                        <Badge
                          className={getDifficultyColor(marathon.difficulty)}
                        >
                          {getDifficultyDisplay(marathon.difficulty)}
                        </Badge>
                      </div>
                    </div>
                    <BookText className="h-6 w-6 text-gray-500" />
                  </div>
                  <CardDescription className="text-sm">
                    {marathon.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {marathon.enrollments?.length || 0} participante
                        {(marathon.enrollments?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{marathon.timeLimit} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-gray-500" />
                      <span>{marathon.number_of_questions} questões</span>
                    </div>
                    <div className="text-gray-600">
                      {classrooms.find((c) => c.id === marathon.classroom_id)
                        ?.name || "Turma não encontrada"}
                    </div>
                  </div>

                  {(marathon.start_date || marathon.end_date) && (
                    <div className="text-xs text-gray-500">
                      {marathon.start_date && (
                        <p>Início: {formatDateTime(marathon.start_date)}</p>
                      )}
                      {marathon.end_date && (
                        <p>Fim: {formatDateTime(marathon.end_date)}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/marathons/${marathon.id}`, {
                          state: {
                            marathon,
                            returnFilters: {
                              searchTerm,
                              statusFilter,
                              difficultyFilter,
                              selectedClassroomId,
                            },
                          },
                        })
                      }
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    {marathonStatus === MARATHON_STATUS.OPEN &&
                      user?.role === "Student" && (
                        <Button
                          size="sm"
                          onClick={() => navigate("/marathon-enrollment")}
                          className="flex-1"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Participar
                        </Button>
                      )}
                    {user?.role === "Professor" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`question-management/${marathon.id}`)
                        }
                        className="flex-1"
                      >
                        <TableOfContents className="mr-2 h-4 w-4" />
                        Gerenciar Questões
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loadingClassrooms &&
        !loadingMarathons &&
        !marathonsError &&
        filteredMarathons.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
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
