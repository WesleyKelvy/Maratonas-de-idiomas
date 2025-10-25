import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useMarathonSocket } from "@/hooks/use-marathon-socket";
import { toast } from "@/hooks/use-toast";
import { LanguageMarathon, MarathonService } from "@/services/marathon.service";
import { Question, QuestionService } from "@/services/question.service";
import { SubmissionService } from "@/services/submission.service";
import { Clock, Loader2, Save, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MarathonExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados do componente
  const [marathon, setMarathon] = useState<LanguageMarathon | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [marathonStarted, setMarathonStarted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Callbacks para eventos do WebSocket
  const handleMarathonStarted = useCallback(
    (progress: any) => {
      console.log("Marathon started:", progress);
      setMarathonStarted(true);

      // Definir questão atual baseada no progresso
      if (progress.current_question_id && questions.length > 0) {
        const questionIndex = questions.findIndex(
          (q) => q.id === progress.current_question_id
        );
        if (questionIndex >= 0) {
          setCurrentQuestion(questionIndex);
        }
      }

      // Carregar rascunho se existir
      if (progress.draft_answer) {
        setAnswer(progress.draft_answer);
      }
    },
    [questions]
  );

  const handleTimeUpdate = useCallback((data: any) => {
    setTimeRemaining(data.time_remaining);
    setTimeElapsed(data.time_elapsed);
  }, []);

  const handleTimeUp = useCallback(() => {
    toast({
      title: "Tempo esgotado!",
      description:
        "O tempo da maratona acabou. Suas respostas foram salvas automaticamente.",
      variant: "destructive",
    });
    navigate("/marathons");
  }, [navigate]);

  const handleQuestionChanged = useCallback((progress: any) => {
    // console.log("Question changed:", progress);
    // O estado local já foi atualizado otimisticamente
  }, []);

  const handleAnswerSaved = useCallback((data: any) => {
    console.log("Answer saved:", data);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }, []);

  const handleMarathonCompleted = useCallback(
    (data: any) => {
      // console.log("Marathon completed:", data);
      toast({
        title: "Maratona finalizada!",
        description:
          data.message ||
          "Parabéns! Em breve você poderá ver as correções das questões.",
      });
      navigate("/marathons");
    },
    [navigate]
  );

  const handleSocketError = useCallback((error: any) => {
    console.error("Socket error:", error);
    toast({
      title: "Erro de conexão",
      description: error.message || "Problema na conexão em tempo real.",
      variant: "destructive",
    });
  }, []);

  // Hook do WebSocket
  const {
    isConnected,
    connectionError,
    changeQuestion,
    saveDraftAnswer,
    completeMarathon,
  } = useMarathonSocket(id, {
    onMarathonStarted: handleMarathonStarted,
    onTimeUpdate: handleTimeUpdate,
    onTimeUp: handleTimeUp,
    onQuestionChanged: handleQuestionChanged,
    onAnswerSaved: handleAnswerSaved,
    onMarathonCompleted: handleMarathonCompleted,
    onError: handleSocketError,
  });

  // Carregar dados estáticos da maratona e questões
  useEffect(() => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da maratona não encontrado.",
        variant: "destructive",
      });
      navigate("/marathons");
      return;
    }

    const loadMarathonData = async () => {
      try {
        setLoading(true);

        // Carregar dados da maratona
        const marathonData = await MarathonService.findOneWithQuestions(id);
        setMarathon(marathonData);

        // Carregar questões da maratona
        let questionsArray;
        if (marathonData.questions && marathonData.questions.length > 0) {
          const convertedQuestions = marathonData.questions.map((q) => ({
            id: q.id,
            marathon_id: id,
            title: q.title,
            prompt_text: q.prompt_text,
          }));
          setQuestions(convertedQuestions);
          questionsArray = marathonData.questions;
        } else {
          const questionsData = await QuestionService.findAllByMarathonId(id);
          setQuestions(questionsData);
          questionsArray = questionsData;
        }

        // Carregar submissões existentes
        try {
          const userSubmissions = await SubmissionService.findAllByUserId();
          const marathonSubmissions = userSubmissions.filter(
            (sub) => sub.marathon_id === id
          );
          const submittedQuestionIds = new Set(
            marathonSubmissions.map((sub) => sub.question_id)
          );
          setSubmittedQuestions(submittedQuestionIds);

          // Verificar se todas as questões já foram respondidas
          const allQuestionsAnswered = questionsArray.every((question) =>
            submittedQuestionIds.has(question.id)
          );

          if (allQuestionsAnswered && questionsArray.length > 0) {
            toast({
              title: "Maratona já concluída!",
              description:
                "Você já respondeu todas as questões desta maratona.",
            });
            navigate(-1); // Volta para a página anterior
            return;
          }
        } catch (submissionError) {
          console.warn(
            "Não foi possível carregar submissões existentes:",
            submissionError
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados da maratona:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da maratona.",
          variant: "destructive",
        });
        navigate("/marathons");
      } finally {
        setLoading(false);
      }
    };

    loadMarathonData();
  }, [id, navigate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Função para lidar com mudanças no textarea (com debounce para rascunho)
  const handleAnswerChange = useCallback(
    (value: string) => {
      setAnswer(value);

      // Salvar rascunho com debounce se conectado via WebSocket
      if (isConnected && questions.length > 0) {
        const currentQuestionData = questions[currentQuestion];
        if (currentQuestionData) {
          saveDraftAnswer(currentQuestionData.id, value);
        }
      }
    },
    [isConnected, questions, currentQuestion, saveDraftAnswer]
  );

  // Função para enviar resposta final (mantém HTTP)
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, digite uma resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!id || questions.length === 0) {
      toast({
        title: "Erro",
        description: "Dados da maratona não encontrados.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const currentQuestionData = questions[currentQuestion];

      // Enviar resposta final para o backend via HTTP
      await SubmissionService.create(id, currentQuestionData.id, answer);

      // Marcar questão como enviada
      setSubmittedQuestions((prev) =>
        new Set(prev).add(currentQuestionData.id)
      );

      toast({
        title: "Resposta enviada!",
        description: "Sua resposta foi enviada com sucesso.",
      });

      // Limpar resposta atual
      setAnswer("");

      // Automaticamente ir para a próxima questão ou finalizar se for a última
      if (currentQuestion < questions.length - 1) {
        // Ir para próxima questão
        const nextIndex = currentQuestion + 1;
        const nextQuestion = questions[nextIndex];

        // Atualização otimista da UI
        setCurrentQuestion(nextIndex);

        // Notificar servidor via WebSocket
        if (nextQuestion && isConnected) {
          changeQuestion(nextQuestion.id);
        }
      } else {
        // Última questão - finalizar maratona
        completeMarathon();
      }
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast({
        title: "Erro ao enviar resposta",
        description: "Não foi possível enviar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Função para navegar entre questões (via WebSocket)
  // const handleNavigateToQuestion = (
  //   direction: "next" | "previous" | "finish"
  // ) => {
  //   if (direction === "finish") {
  //     completeMarathon();
  //     return;
  //   }

  //   let newIndex;
  //   if (direction === "next" && currentQuestion < questions.length - 1) {
  //     newIndex = currentQuestion + 1;
  //   } else if (direction === "previous" && currentQuestion > 0) {
  //     newIndex = currentQuestion - 1;
  //   } else {
  //     return;
  //   }

  //   const newQuestion = questions[newIndex];
  //   if (newQuestion) {
  //     // Atualização otimista da UI
  //     setCurrentQuestion(newIndex);
  //     setAnswer(""); // Limpar resposta local

  //     // Notificar servidor via WebSocket
  //     changeQuestion(newQuestion.id);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando maratona...</span>
        </div>
      </div>
    );
  }

  if (!marathon || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Maratona não encontrada
            </h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar os dados da maratona ou ela não possui
              questões.
            </p>
            <Button onClick={() => navigate("/marathons")}>
              Voltar para Maratonas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aguardar conexão WebSocket antes de mostrar a interface
  if (!isConnected && !connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Conectando...</h2>
            <p className="text-gray-600">
              Estabelecendo conexão em tempo real com o servidor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar erro de conexão
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <WifiOff className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Erro de Conexão
            </h2>
            <p className="text-gray-600 mb-4">{connectionError}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const isCurrentQuestionSubmitted =
    currentQuestionData && submittedQuestions.has(currentQuestionData.id);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{marathon.title}</h1>
                <p className="text-gray-600">
                  Questão {currentQuestion + 1} de {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" />
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      Tempo restante
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-red-500" />
                      Desconectado
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {questions[currentQuestion].title ||
                  `Questão ${currentQuestion + 1}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Questão {currentQuestion + 1}</Badge>
                {isCurrentQuestionSubmitted && (
                  <Badge variant="default" className="bg-green-500">
                    Já respondida
                  </Badge>
                )}
                {draftSaved && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Rascunho salvo
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg leading-relaxed">
                {questions[currentQuestion].prompt_text}
              </p>
            </div>

            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium mb-2"
              >
                Sua Resposta:
              </label>
              <Textarea
                id="answer"
                placeholder="Digite sua resposta aqui..."
                value={answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-48 resize-none"
                maxLength={2000}
              />
              <div className="text-sm text-gray-500 mt-1">
                {answer.length}/2000 caracteres
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleSubmitAnswer}
                size="lg"
                disabled={!answer.trim() || submitting}
                className={`min-w-48 ${
                  currentQuestion === questions.length - 1 && !submitting
                    ? "animate-pulse bg-green-600 hover:bg-green-700 text-white border-green-600"
                    : ""
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : isCurrentQuestionSubmitted ? (
                  currentQuestion === questions.length - 1 ? (
                    "Reenviar e Finalizar Maratona"
                  ) : (
                    "Reenviar e Continuar"
                  )
                ) : currentQuestion === questions.length - 1 ? (
                  "Enviar e Finalizar Maratona"
                ) : (
                  "Enviar e Continuar"
                )}
              </Button>
              {isCurrentQuestionSubmitted && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Você já respondeu esta questão. Pode reenviar se desejar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarathonExecution;
