import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMarathonWithQuestions } from "@/hooks/use-marathon";
import {
  useDeleteQuestion,
  useGenerateQuestionsWithGemini,
  useSaveQuestions,
  useUpdateQuestion,
} from "@/hooks/use-question";
import { useToast } from "@/hooks/use-toast";
import {
  editQuestionFormSchema,
  type EditQuestionFormData,
} from "@/schemas/question.schema";
import { GeminiQuestionResponse } from "@/services/question.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  Clock,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

interface EditQuestion {
  id?: number;
  title: string;
  prompt_text: string;
  isNew?: boolean;
}

const QuestionManagement = () => {
  const { marathonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingQuestion, setEditingQuestion] = useState<EditQuestion | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Form validation with Zod
  const form = useForm<EditQuestionFormData>({
    resolver: zodResolver(editQuestionFormSchema),
    defaultValues: {
      title: "",
      prompt_text: "",
    },
  });
  const [showMarathonInfo, setShowMarathonInfo] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeminiQuestionResponse[]
  >([]);

  const {
    data: marathon,
    isLoading: marathonLoading,
    refetch: refetchMarathon,
  } = useMarathonWithQuestions(marathonId || "");

  // Extract questions from marathon data
  const questions = marathon?.questions || [];

  // Check if marathon has started (current date > start_date)
  const marathonHasStarted = marathon?.start_date
    ? new Date() > new Date(marathon.start_date)
    : false;

  const disabledTooltip = marathonHasStarted
    ? "Não é possível editar questões após o início da maratona"
    : "";

  // Mutations
  const generateMutation = useGenerateQuestionsWithGemini();
  const saveMutation = useSaveQuestions();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const generateQuestionsWithAI = async () => {
    if (!marathonId) return;

    try {
      const result = await generateMutation.mutateAsync(marathonId);
      setGeneratedQuestions(result);

      toast({
        title: "Questões Geradas!",
        description: `${result.length} questões foram geradas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion({
      id: question.id,
      title: question.title,
      prompt_text: question.prompt_text,
    });

    // Reset and populate form
    form.reset({
      title: question.title,
      prompt_text: question.prompt_text,
    });

    setEditDialogOpen(true);
  };

  const handleEditGeneratedQuestion = (
    question: GeminiQuestionResponse,
    index: number
  ) => {
    setEditingQuestion({
      title: `Questão ${index + 1}`,
      prompt_text: question.question_text,
      isNew: true,
    });

    // Reset and populate form
    form.reset({
      title: `Questão ${index + 1}`,
      prompt_text: question.question_text,
    });

    setEditDialogOpen(true);
  };

  const handleSaveQuestion = async (data: EditQuestionFormData) => {
    if (!editingQuestion || !marathonId) return;

    try {
      if (editingQuestion.id) {
        // Update existing question
        await updateMutation.mutateAsync({
          id: editingQuestion.id,
          marathonId,
          data: {
            title: data.title,
            prompt_text: data.prompt_text,
          },
        });

        toast({
          title: "Questão Atualizada",
          description: "A questão foi atualizada com sucesso.",
        });
      } else {
        // Create new question - send as array of QuestionDto
        const newQuestion = {
          title: data.title,
          prompt_text: data.prompt_text,
        };

        // Use saveMutation to save single question
        await saveMutation.mutateAsync({
          marathonId,
          data: [newQuestion],
        });

        toast({
          title: "Questão Adicionada",
          description: "A nova questão foi adicionada com sucesso.",
        });
      }

      handleCloseDialog();
      refetchMarathon(); // Refetch to get updated question list
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar questão.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id, marathonId });
      toast({
        title: "Questão Removida",
        description: "A questão foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover questão.",
        variant: "destructive",
      });
    }
  };

  const handleAddNewQuestion = () => {
    setEditingQuestion({
      title: "",
      prompt_text: "",
      isNew: true,
    });

    // Reset form for new question
    form.reset({
      title: "",
      prompt_text: "",
    });

    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingQuestion(null);
    form.reset();
  };

  const handleSaveAllQuestions = async () => {
    if (!marathonId || generatedQuestions.length === 0) {
      toast({
        title: "Nenhuma Questão",
        description: "Gere questões com IA antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate questions before saving
      const questionsToSave = generatedQuestions.map((q, index) => ({
        title: `Questão ${index + 1}`,
        prompt_text: q.question_text,
      }));

      // Validate each question
      const validationErrors = [];
      questionsToSave.forEach((question, index) => {
        try {
          editQuestionFormSchema.parse(question);
        } catch (error) {
          validationErrors.push(
            `Questão ${index + 1}: ${
              error.issues[0]?.message || "Erro de validação"
            }`
          );
        }
      });

      if (validationErrors.length > 0) {
        toast({
          title: "Erro de Validação",
          description: `Algumas questões contêm erros: ${validationErrors.join(
            ", "
          )}`,
          variant: "destructive",
        });
        return;
      }

      await saveMutation.mutateAsync({
        marathonId,
        data: questionsToSave,
      });

      toast({
        title: "Questões Salvas!",
        description: `${generatedQuestions.length} questões foram salvas com sucesso.`,
      });

      // Clear generated questions and refetch saved ones
      setGeneratedQuestions([]);
      refetchMarathon();
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Erro ao salvar questões. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!marathonId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Marathon ID not found</p>
      </div>
    );
  }

  if (marathonLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/marathons")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-">
              Gerenciar Questões
            </h1>
            <div className="flex space-x-3">
              <p className=" mt-2">Nome da Maratona:</p>
              <p className=" mt-2">{marathon?.title || "Maratona"}</p>
            </div>
          </div>
        </div>
        <p className="border-2 border-neutral-300 rounded-full px-2 text-sm text-neutral-500">
          ID da maratona: {marathonId}
        </p>
      </div>

      {/* Warning Message for Started Marathon */}
      {marathonHasStarted && (
        <div className="mb-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-orange-800 font-medium">
                  Maratona em Andamento ou Finalizada
                </p>
                <p className="text-orange-700 text-sm">
                  A maratona já foi iniciada em{" "}
                  {new Date(marathon?.start_date || "").toLocaleDateString(
                    "pt-BR"
                  )}
                  . Não é possível editar questões após o início da maratona.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Marathon Info - Collapsible */}
      <div className="mb-4">
        <Card>
          <CardContent className="flex flex-col justify-center">
            <div>
              <button
                type="button"
                className="w-full flex items-center justify-between px-2 py-2 text-left text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowMarathonInfo((prev) => !prev)}
                aria-expanded={showMarathonInfo}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações da Maratona
                </span>
                <span>
                  {showMarathonInfo ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </div>
            {showMarathonInfo && (
              <div className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {marathon?.difficulty || "N/A"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{marathon?.timeLimit || 0} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-gray-500" />
                    <span>{marathon?.number_of_questions || 0} questões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {marathon?.classroom?.creator?.name || "Professor"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm pb-3">
                    <strong>Descrição:</strong>{" "}
                    {marathon?.description || "Sem descrição disponível"}
                  </p>
                  <p className="text-sm">
                    <strong>Contexto:</strong>{" "}
                    {marathon?.context || "Sem contexto disponível"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={generateQuestionsWithAI}
                    disabled={generateMutation.isPending || marathonHasStarted}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                  >
                    {generateMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {generateMutation.isPending ? "Gerando..." : "Gerar com IA"}
                  </Button>
                </div>
              </TooltipTrigger>
              {marathonHasStarted && (
                <TooltipContent>
                  <p>{disabledTooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    onClick={handleAddNewQuestion}
                    disabled={marathonHasStarted}
                    className="disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Questão
                  </Button>
                </div>
              </TooltipTrigger>
              {marathonHasStarted && (
                <TooltipContent>
                  <p>{disabledTooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>

        {generatedQuestions.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={handleSaveAllQuestions}
                    disabled={saveMutation.isPending || marathonHasStarted}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {saveMutation.isPending
                      ? "Salvando..."
                      : `Salvar Geradas (${generatedQuestions.length})`}
                  </Button>
                </div>
              </TooltipTrigger>
              {marathonHasStarted && (
                <TooltipContent>
                  <p>{disabledTooltip}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Saved Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Questões Salvas ({questions.length})
          </h2>

          <div className="overflow-y-auto space-y-4 max-h-[50vh] pb-2">
            {questions.map((question, index) => (
              <Card key={question.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Questão {index + 1}</Badge>
                        <Badge variant="default" className="text-xs">
                          Salva
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {question.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                                disabled={
                                  updateMutation.isPending || marathonHasStarted
                                }
                                className="disabled:opacity-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {marathonHasStarted && (
                            <TooltipContent>
                              <p>{disabledTooltip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                                disabled={
                                  deleteMutation.isPending || marathonHasStarted
                                }
                                className="disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {marathonHasStarted && (
                            <TooltipContent>
                              <p>{disabledTooltip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 max-w-[90%]">
                      {question.prompt_text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Questões Geradas - Preview ({generatedQuestions.length})
          </h2>

          <div className="overflow-y-auto space-y-4 max-h-[50vh] pb-2">
            {generatedQuestions.map((question, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Questão {index + 1}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          Preview
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        Questão Gerada {index + 1}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditGeneratedQuestion(question, index)
                                }
                                disabled={marathonHasStarted}
                                className="disabled:opacity-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {marathonHasStarted && (
                            <TooltipContent>
                              <p>{disabledTooltip}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {question.question_text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && generatedQuestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma questão criada ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Use a IA para gerar questões automaticamente ou adicione
              manualmente.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion?.isNew
                ? "Adicionar uma questão"
                : "Editar Questão"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion?.isNew
                ? "Adicione uma nova questão à maratona."
                : "Faça as alterações necessárias na questão."}
            </DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveQuestion)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Questão</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Como seria o mundo sem tarefas de casa?"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Título identificador da questão (3-100 caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enunciado</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o enunciado completo da questão..."
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Descrição detalhada da questão (10-2000 caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      updateMutation.isPending || saveMutation.isPending
                    }
                  >
                    {updateMutation.isPending || saveMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {editingQuestion?.isNew
                      ? "Adicionar Questão"
                      : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement;
