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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Clock,
  Edit3,
  FileText,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: string;
  title: string;
  prompt_text: string;
  isNew?: boolean;
}

const QuestionManagement = () => {
  const { marathonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showMarathonInfo, setShowMarathonInfo] = useState(false);

  // Mock marathon data - in real app this would come from backend
  const marathonData = {
    title: "Maratona de JavaScript",
    description: "Teste seus conhecimentos em JavaScript",
    difficulty: "Intermediate",
    timeLimit: 120,
    number_of_questions: 10,
    context:
      "JavaScript ES6+, programação funcional, async/await, DOM manipulation",
  };

  useEffect(() => {
    // Initialize with empty questions array
    setQuestions([]);
  }, [marathonId]);

  const generateQuestionsWithAI = async () => {
    setIsGenerating(true);

    try {
      // Simulate AI generation delay
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated questions
      const generatedQuestions: Question[] = [
        {
          id: `temp_${Date.now()}_1`,
          title: "Manipulação de Arrays",
          prompt_text:
            "Implemente uma função que receba um array de números e retorne apenas os números pares, ordenados de forma crescente. Utilize métodos de array do JavaScript ES6+.",
          isNew: true,
        },
        {
          id: `temp_${Date.now()}_2`,
          title: "Programação Assíncrona",
          prompt_text:
            "Crie uma função async que faça três requisições HTTP paralelas usando Promise.all() e trate possíveis erros adequadamente.",
          isNew: true,
        },
        {
          id: `temp_${Date.now()}_3`,
          title: "DOM e Eventos",
          prompt_text:
            "Desenvolva um sistema de to-do list que permita adicionar, remover e marcar tarefas como concluídas, usando apenas JavaScript vanilla.",
          isNew: true,
        },
        {
          id: `temp_${Date.now()}_4`,
          title: "Closures e Escopo",
          prompt_text:
            "Explique o conceito de closure em JavaScript e implemente um contador privado usando esse padrão.",
          isNew: true,
        },
        {
          id: `temp_${Date.now()}_5`,
          title: "Destructuring e Spread",
          prompt_text:
            "Demonstre o uso de destructuring assignment e spread operator em diferentes cenários práticos.",
          isNew: true,
        },
      ];

      setQuestions(generatedQuestions);

      toast({
        title: "Questões Geradas!",
        description: `${generatedQuestions.length} questões foram geradas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setEditDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === editingQuestion.id ? { ...editingQuestion, isNew: q.isNew } : q
      )
    );

    setEditDialogOpen(false);
    setEditingQuestion(null);

    toast({
      title: "Questão Atualizada",
      description: "As alterações foram salvas localmente.",
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast({
      title: "Questão Removida",
      description: "A questão foi removida da lista.",
    });
  };

  const handleAddNewQuestion = () => {
    const newQuestion: Question = {
      id: `temp_${Date.now()}_new`,
      title: "Nova Questão",
      prompt_text: "Descreva o enunciado da questão aqui...",
      isNew: true,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    handleEditQuestion(newQuestion);
  };

  const handleSaveAllQuestions = async () => {
    if (questions.length === 0) {
      toast({
        title: "Nenhuma Questão",
        description: "Adicione pelo menos uma questão antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, would send to: POST /classrooms/:code/marathon/:marathonId/save-questions
      console.log("Saving questions:", questions);

      toast({
        title: "Questões Salvas!",
        description: `${questions.length} questões foram salvas com sucesso.`,
      });

      // Navigate back to marathons or class details
      navigate("/marathons");
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Erro ao salvar questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex  gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/marathons")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gerenciar Questões
            </h1>
            <p className="text-gray-600 mt-2">{marathonData.title}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm text-neutral-200">
          ID: {marathonId}
        </Badge>
      </div>

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
                    <Badge variant="secondary">{marathonData.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{marathonData.timeLimit} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-gray-500" />
                    <span>{marathonData.number_of_questions} questões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>JavaScript, ES6+</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Contexto:</strong> {marathonData.context}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            onClick={generateQuestionsWithAI}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Gerando..." : "Gerar com IA"}
          </Button>
          <Button variant="outline" onClick={handleAddNewQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Questão
          </Button>
        </div>

        {questions.length > 0 && (
          <Button
            onClick={handleSaveAllQuestions}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvando..." : `Salvar Todas (${questions.length})`}
          </Button>
        )}
      </div>

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Questões {questions[0]?.isNew ? "(Preview)" : ""}
          </h2>

          <div className="overflow-y-auto space-y-4 max-h-[50vh] pb-2">
            {questions.map((question, index) => (
              <Card key={question.id} className="relative">
                <CardHeader className="">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Questão {index + 1}</Badge>
                        {question.isNew && (
                          <Badge variant="secondary" className="text-xs">
                            Preview
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        {question.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {question.prompt_text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
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
            <div className="flex justify-center gap-3"></div>
          </CardContent>
        </Card>
      )}

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Questão</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias na questão.
            </DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionTitle">Título da Questão</Label>
                <Input
                  id="questionTitle"
                  value={editingQuestion.title}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  placeholder="Ex: Manipulação de Arrays"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionPrompt">Enunciado</Label>
                <Textarea
                  id="questionPrompt"
                  value={editingQuestion.prompt_text}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev ? { ...prev, prompt_text: e.target.value } : null
                    )
                  }
                  placeholder="Descreva o enunciado completo da questão..."
                  rows={8}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveQuestion}>Salvar Alterações</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement;
