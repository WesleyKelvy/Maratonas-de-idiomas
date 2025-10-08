import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MarathonExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds

  const questions = [
    {
      id: 1,
      question:
        "Explique a diferença entre 'let', 'const' e 'var' em JavaScript. Forneça exemplos práticos de quando usar cada um.",
      maxScore: 10,
    },
    {
      id: 2,
      question:
        "O que são closures em JavaScript? Crie um exemplo de código que demonstre o conceito de closure.",
      maxScore: 10,
    },
    {
      id: 3,
      question:
        "Explique o conceito de hoisting em JavaScript. Como ele afeta a declaração de variáveis e funções?",
      maxScore: 10,
    },
    {
      id: 4,
      question:
        "O que é o Event Loop em JavaScript? Explique como funciona a execução assíncrona.",
      maxScore: 10,
    },
    {
      id: 5,
      question:
        "Crie uma função que implementa o algoritmo de ordenação quicksort em JavaScript.",
      maxScore: 15,
    },
  ];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishMarathon();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, digite uma resposta antes de enviar.",




        variant: "destructive",
      });
      return;
    }

    // Simulate score calculation
    const mockScore =
      Math.floor(Math.random() * questions[currentQuestion].maxScore) + 5;
    setScore((prev) => prev + mockScore);

    // Move to next question
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleFinishMarathon();
    }
  };

  const handleFinishMarathon = () => {
    toast({
      title: "Maratona finalizada!",
      description: `Parabéns! Em breve você poderá ver as correções das questões.`,
    });
    navigate("/marathons");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Maratona de JavaScript</h1>
                <p className="text-gray-600">
                  Questão {currentQuestion + 1} de {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5" />
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-600">Tempo restante</div>
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
                Questão {currentQuestion + 1}
              </CardTitle>
              <Badge variant="outline">
                {questions[currentQuestion].maxScore} pontos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-lg leading-relaxed">
                {questions[currentQuestion].question}
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
                onChange={(e) => setAnswer(e.target.value)}
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
                disabled={!answer.trim()}
                className="min-w-48"
              >
                Enviar Resposta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarathonExecution;
