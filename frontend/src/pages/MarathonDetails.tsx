import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMarathon,
  useUpdateMarathon,
  useDeleteMarathon,
} from "@/hooks/use-marathon";
import { toast } from "@/hooks/use-toast";
import { useClassrooms } from "@/hooks/use-classroom";
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
import {
  CreateMarathonFormData,
  createMarathonFormSchema,
} from "@/schemas/marathon.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LanguageMarathon } from "@/services/marathon.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  BookText,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Play,
  TableOfContents,
  User,
  Users,
  Edit3,
  Trash2,
  Save,
  X,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

// Navigation state interface
interface NavigationState {
  marathon?: LanguageMarathon;
  returnFilters?: {
    searchTerm: string;
    statusFilter: string;
    difficultyFilter: string;
    selectedClassroomId: string;
  };
}

const MarathonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Edit marathon state
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showParticipationDialog, setShowParticipationDialog] = useState(false);

  // URL search params for handling dialog state
  const [searchParams, setSearchParams] = useSearchParams();

  // Check if participation dialog should be open based on URL parameter
  useEffect(() => {
    const showDialog = searchParams.get("participate") === "true";
    if (showDialog) {
      setShowParticipationDialog(true);
      // Clean up URL parameter
      searchParams.delete("participate");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Get navigation state
  const navigationState = location.state as NavigationState | null;
  const passedMarathon = navigationState?.marathon;
  const returnFilters = navigationState?.returnFilters;

  // Fetch marathon data from backend (fallback if no state passed)
  const { data: fetchedMarathon, isLoading, error } = useMarathon(id || "");

  // Fetch classrooms for editing
  const { data: classrooms = [] } = useClassrooms();

  // Mutations for edit and delete
  const updateMarathonMutation = useUpdateMarathon();
  const deleteMarathonMutation = useDeleteMarathon();

  // Form for editing marathon
  const editForm = useForm<CreateMarathonFormData>({
    resolver: zodResolver(createMarathonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      context: "",
      difficulty: "",
      timeLimit: "",
      startDate: "",
      endDate: "",
      number_of_questions: "",
      classroom_id: "",
    },
  });

  // Constants
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

  // Utility functions
  const getMarathonStatus = (marathon: LanguageMarathon): string => {
    const now = new Date();
    const startDate = marathon.start_date
      ? new Date(marathon.start_date)
      : null;
    const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

    if (endDate && now > endDate) return "Finalizada";
    if (startDate && now < startDate) return "Aguardando início";
    return "Aberta";
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

  const getTeacherName = (marathon: LanguageMarathon): string => {
    return marathon.classroom?.creator?.name || "Professor";
  };

  const getRules = (): string[] => {
    return [
      "Não é permitido consultar materiais externos",
      "As respostas são avaliadas automaticamente por IA",
      "Não é possível pausar a maratona uma vez iniciada",
      "Respeite o tempo limite estabelecido",
    ];
  };

  // Handle back navigation with filter preservation
  const handleBackNavigation = () => {
    if (returnFilters) {
      const params = new URLSearchParams();
      if (returnFilters.searchTerm) {
        params.set("search", returnFilters.searchTerm);
      }
      if (returnFilters.statusFilter !== "all") {
        params.set("status", returnFilters.statusFilter);
      }
      if (returnFilters.difficultyFilter !== "all") {
        params.set("difficulty", returnFilters.difficultyFilter);
      }
      if (returnFilters.selectedClassroomId) {
        params.set("classroom", returnFilters.selectedClassroomId);
      }

      const queryString = params.toString();
      navigate(`/marathons${queryString ? `?${queryString}` : ""}`);
    } else {
      navigate("/marathons");
    }
  };

  // Loading state
  if (isLoading && !passedMarathon) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando detalhes da maratona...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !passedMarathon) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar maratona
            </h3>
            <p className="text-gray-600">
              Não foi possível carregar os detalhes da maratona.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Marathon not found
  if (!fetchedMarathon) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Maratona não encontrada
            </h3>
            <p className="text-gray-600">
              A maratona solicitada não foi encontrada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    navigate(`/marathons/${fetchedMarathon.id}/execute`);
  };

  // Check if marathon has started (current date > start_date)
  const marathonHasStarted = fetchedMarathon?.start_date
    ? new Date() > new Date(fetchedMarathon.start_date)
    : false;

  // Initialize edit form when marathon data is available and editing starts
  const handleStartEdit = () => {
    if (fetchedMarathon) {
      editForm.reset({
        title: fetchedMarathon.title,
        description: fetchedMarathon.description || "",
        context: fetchedMarathon.context,
        difficulty: fetchedMarathon.difficulty,
        timeLimit: fetchedMarathon.timeLimit.toString(),
        startDate: fetchedMarathon.start_date
          ? new Date(fetchedMarathon.start_date).toISOString().slice(0, 16)
          : "",
        endDate: fetchedMarathon.end_date
          ? new Date(fetchedMarathon.end_date).toISOString().slice(0, 16)
          : "",
        number_of_questions: fetchedMarathon.number_of_questions.toString(),
        classroom_id: fetchedMarathon.classroom_id,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    editForm.reset();
  };

  const handleUpdateMarathon = async (values: CreateMarathonFormData) => {
    if (!fetchedMarathon) return;

    try {
      const updateData = {
        title: values.title,
        description: values.description || undefined,
        context: values.context,
        difficulty: values.difficulty as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
        timeLimit: parseInt(values.timeLimit),
        startDate: values.startDate ? new Date(values.startDate) : undefined,
        endDate: values.endDate ? new Date(values.endDate) : undefined,
        number_of_questions: parseInt(values.number_of_questions),
      };

      await updateMarathonMutation.mutateAsync({
        classroomId: fetchedMarathon.classroom_id,
        marathonId: fetchedMarathon.id,
        data: updateData,
      });

      toast({
        title: "Maratona atualizada!",
        description:
          "As informações da maratona foram atualizadas com sucesso.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a maratona. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMarathon = async () => {
    if (!fetchedMarathon) return;

    try {
      await deleteMarathonMutation.mutateAsync({
        classroomId: fetchedMarathon.classroom_id,
        marathonId: fetchedMarathon.id,
      });

      toast({
        title: "Maratona excluída!",
        description: "A maratona foi excluída com sucesso.",
      });

      // Navigate back to marathons page
      handleBackNavigation();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a maratona. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBackNavigation}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {fetchedMarathon.title}
          </h1>
        </div>
      </div>

      {/* Warning Message for Started Marathon */}
      {marathonHasStarted && user?.role === "Professor" && (
        <div className="mb-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-orange-800 font-medium">
                  Maratona em Andamento ou Finalizada
                </p>
                <p className="text-orange-700 text-sm">
                  A maratona já foi iniciada em{" "}
                  {new Date(
                    fetchedMarathon?.start_date || ""
                  ).toLocaleDateString("pt-BR")}{" "}
                  às{" "}
                  {new Date(
                    fetchedMarathon?.start_date || ""
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  . Não é possível editar ou excluir a maratona após o início.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          {isEditing && user?.role === "Professor" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Editar Maratona</span>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...editForm}>
                  <form
                    onSubmit={editForm.handleSubmit(handleUpdateMarathon)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
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
                        control={editForm.control}
                        name="classroom_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Turma *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
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
                      control={editForm.control}
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
                      control={editForm.control}
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
                        control={editForm.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dificuldade *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={DIFFICULTY_LEVELS.BEGINNER}>
                                  {
                                    DIFFICULTY_DISPLAY[
                                      DIFFICULTY_LEVELS.BEGINNER
                                    ]
                                  }
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
                                  {
                                    DIFFICULTY_DISPLAY[
                                      DIFFICULTY_LEVELS.ADVANCED
                                    ]
                                  }
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
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
                        control={editForm.control}
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
                        control={editForm.control}
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
                        control={editForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Fim</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="datetime-local"
                                disabled={!!editForm.watch("timeLimit")}
                              />
                            </FormControl>
                            {editForm.watch("timeLimit") && (
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
                        onClick={handleCancelEdit}
                        disabled={updateMarathonMutation.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateMarathonMutation.isPending}
                      >
                        {updateMarathonMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Marathon Details (shown when not editing) */}
          {!isEditing && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      {fetchedMarathon.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        Código: {fetchedMarathon.code}
                      </Badge>
                      <Badge
                        className={getStatusColor(
                          getMarathonStatus(fetchedMarathon)
                        )}
                      >
                        {getMarathonStatus(fetchedMarathon)}
                      </Badge>
                      <Badge
                        className={getDifficultyColor(
                          getDifficultyDisplay(fetchedMarathon.difficulty)
                        )}
                      >
                        {getDifficultyDisplay(fetchedMarathon.difficulty)}
                      </Badge>
                    </div>
                  </div>
                  <BookText className="h-8 w-8 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-gray-700">{fetchedMarathon.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Contexto</h3>
                  <p className="text-gray-700">{fetchedMarathon.context}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-3 border rounded-lg">
                    <Users className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {fetchedMarathon.enrollments?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Participantes</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {fetchedMarathon.timeLimit} min
                    </div>
                    <div className="text-sm text-gray-600">Tempo Limite</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <TableOfContents className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      {fetchedMarathon.number_of_questions}
                    </div>
                    <div className="text-sm text-gray-600">Questões</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <User className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">
                      {getTeacherName(fetchedMarathon)}
                    </div>
                    <div className="text-sm text-gray-600">Criador</div>
                  </div>
                </div>

                {(fetchedMarathon.start_date || fetchedMarathon.end_date) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {fetchedMarathon.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">
                            Data de início
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDateTime(fetchedMarathon.start_date)}
                          </div>
                        </div>
                      </div>
                    )}
                    {fetchedMarathon.end_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Data de fim</div>
                          <div className="text-sm text-gray-600">
                            {formatDateTime(fetchedMarathon.end_date)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                {getRules().map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Botão de Participação */}
          {getMarathonStatus(fetchedMarathon) === "Aberta" &&
            user?.role === "Student" && (
              <Card>
                <CardContent className="pt-6">
                  <Dialog
                    open={showParticipationDialog}
                    onOpenChange={setShowParticipationDialog}
                  >
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <Play className="mr-2 h-5 w-5" />
                        Participar da Maratona
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Participação</DialogTitle>
                        <DialogDescription className="space-y-4 text-gray-900">
                          <p>
                            Você está prestes a iniciar a maratona "
                            {fetchedMarathon.title}".
                          </p>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">
                              Importante:
                            </h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                              <li>
                                • A maratona tem tempo limite de{" "}
                                {fetchedMarathon.timeLimit} minutos
                              </li>
                              <li>• Você não poderá pausar uma vez iniciada</li>
                              <li>
                                • São {fetchedMarathon.number_of_questions}{" "}
                                questões no total
                              </li>
                              <li>• Leia todas as regras antes de começar</li>
                            </ul>
                          </div>
                          <p>Deseja continuar?</p>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowParticipationDialog(false)}
                        >
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

          {/* Professor Management Buttons */}
          {user?.role === "Professor" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Gerenciar Maratona
                  </h3>
                  <Button
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() =>
                      navigate(
                        `/marathons/question-management/${fetchedMarathon.id}`
                      )
                    }
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Gerenciar Questões
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleStartEdit}
                      disabled={isEditing || marathonHasStarted}
                      title={
                        marathonHasStarted
                          ? "Não é possível editar maratonas que já iniciaram"
                          : ""
                      }
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Dialog
                      open={showDeleteDialog}
                      onOpenChange={setShowDeleteDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          disabled={marathonHasStarted}
                          title={
                            marathonHasStarted
                              ? "Não é possível excluir maratonas que já iniciaram"
                              : ""
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Exclusão</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja excluir a maratona "
                            {fetchedMarathon.title}"? Esta ação não pode ser
                            desfeita e todos os dados relacionados serão
                            perdidos.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowDeleteDialog(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleDeleteMarathon}
                            disabled={deleteMarathonMutation.isPending}
                          >
                            {deleteMarathonMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Excluir Maratona
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {getMarathonStatus(fetchedMarathon) !== "Aberta" && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-gray-700">
                  {getMarathonStatus(fetchedMarathon) === "Finalizada" ? (
                    <button
                      disabled
                      className="w-full text-gray-700 border border-gray-300 border-input bg-background hover:bg-accent rounded-md h-10 px-4 py-2"
                    >
                      Esta maratona já foi finalizada
                    </button>
                  ) : (
                    "Esta maratona ainda não começou"
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarathonDetails;
