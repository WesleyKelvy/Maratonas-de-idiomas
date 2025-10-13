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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useClassroom } from "@/hooks/use-classroom";
import { useCreateMarathon } from "@/hooks/use-marathon";
import { toast } from "@/hooks/use-toast";
import {
  CreateMarathonFormData,
  createMarathonFormSchema,
} from "@/schemas/marathon.schema";
import { CreateMarathonRequest } from "@/services/marathon.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Loader2, Plus, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

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

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch classroom data from backend
  const { data: classData, isLoading, error } = useClassroom(classId!);

  // Marathon creation form
  const createMarathonMutation = useCreateMarathon();

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
      number_of_questions: "",
      classroom_id: classId,
    },
  });

  const onSubmit = async (values: CreateMarathonFormData) => {
    try {
      const marathonData: CreateMarathonRequest = {
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

      const marathon = await createMarathonMutation.mutateAsync({
        classroomId: classId!,
        data: marathonData,
      });

      toast({
        title: "Sucesso!",
        description: "Maratona criada com sucesso.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      navigate(`/marathons/question-management/${marathon.id}`);
    } catch (error) {
      console.error("Erro ao criar maratona:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar maratona. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Turma não encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            A turma que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => navigate("/classes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Turmas
          </Button>
        </div>
      </div>
    );
  }

  // Get marathons from classroom data or default to empty array
  const linkedMarathons = classData.marathons || [];

  // Helper function to get marathon status based on dates
  const getMarathonStatus = (startDate: string, endDate: string | null) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (now < start) {
      return "Aguardando início";
    } else if (end && now > end) {
      return "Finalizada";
    } else {
      return "Aberta";
    }
  };

  // const handleCopyInviteLink = () => {
  //   const inviteLink = `${window.location.origin}/join-class/${classData.id}`;
  //   navigator.clipboard.writeText(inviteLink);
  //   toast({
  //     title: "Link copiado!",
  //     description:
  //       "O link de convite foi copiado para a área de transferência.",
  //   });
  // };

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/classes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
        </div>
      </div>

      {/* Class Info */}
      <Card>
        <CardContent className="flex items-center justify-between space-x-6">
          <div className="flex w-full space-x-14">
            <div className="flex flex-col items-start">
              <CardTitle className="text-xl">{classData.name}</CardTitle>
              <CardDescription className="text-sm">
                Criada em{" "}
                {new Date(classData.created_at).toLocaleDateString("pt-BR")}
              </CardDescription>
            </div>
            <div className="flex justify-center space-x-6 items-center py-3 border rounded-lg w-1/2">
              <Trophy className="h-6 w-6 text-gray-500" />
              <div className="text-2xl font-bold">{linkedMarathons.length}</div>
              <div className="text-sm text-gray-800">Maratonas</div>
            </div>
          </div>
          <Users className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="marathons" className="space-y-6">
        <TabsList className="mx-auto w-full">
          <TabsTrigger value="marathons">Maratonas Vinculadas</TabsTrigger>
        </TabsList>

        <TabsContent value="marathons" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Maratonas Vinculadas ({linkedMarathons.length})
                </CardTitle>
                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/classes/${classId}/marathons`)}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Ver Todas
                  </Button> */}
                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Maratona
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Criar Nova Maratona</DialogTitle>
                        <DialogDescription>
                          Preencha os dados abaixo para criar uma nova maratona
                          para esta turma.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Digite o título"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descrição (Opcional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Digite a descrição"
                                    {...field}
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
                                <FormLabel>Contexto</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Digite o contexto da maratona"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dificuldade</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione a dificuldade" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem
                                      value={DIFFICULTY_LEVELS.BEGINNER}
                                    >
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
                                    <SelectItem
                                      value={DIFFICULTY_LEVELS.ADVANCED}
                                    >
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

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="timeLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tempo (min)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="60"
                                      {...field}
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
                                  <FormLabel>Nº Questões</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="5"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseInt(e.target.value) || 1
                                        )
                                      }
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
                                  <FormLabel>Data Início</FormLabel>
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
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
                                  <FormLabel>Data Fim</FormLabel>
                                  <FormControl>
                                    <Input type="datetime-local" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              disabled={createMarathonMutation.isPending}
                            >
                              {createMarathonMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Criar
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {linkedMarathons.map((marathon) => {
                  const status = getMarathonStatus(
                    marathon.start_date,
                    marathon.end_date
                  );
                  const participantCount = marathon.enrollments
                    ? marathon.enrollments.length
                    : 0;

                  return (
                    <div
                      key={marathon.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{marathon.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {marathon.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                          <Badge
                            className={getDifficultyColor(
                              marathon.difficulty === "Easy"
                                ? "Iniciante"
                                : marathon.difficulty === "Medium"
                                ? "Intermediário"
                                : "Avançado"
                            )}
                          >
                            {marathon.difficulty === "Easy"
                              ? "Iniciante"
                              : marathon.difficulty === "Medium"
                              ? "Intermediário"
                              : "Avançado"}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Participantes: {participantCount}</span>
                          <span>
                            Início:{" "}
                            {new Date(marathon.start_date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          {marathon.end_date && (
                            <span>
                              Fim:{" "}
                              {new Date(marathon.end_date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/marathons/${marathon.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetails;
