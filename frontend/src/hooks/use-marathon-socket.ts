import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface MarathonProgress {
  id: string;
  user_id: string;
  marathon_id: string;
  current_question_id: number | null;
  started_at: string;
  completed_at: string | null;
  draft_answer: string | null;
  time_remaining: number;
}

interface TimeUpdate {
  time_remaining: number;
  time_elapsed: number;
}

interface MarathonSocketEvents {
  onMarathonStarted: (progress: MarathonProgress) => void;
  onTimeUpdate: (data: TimeUpdate) => void;
  onTimeUp: () => void;
  onQuestionChanged: (progress: MarathonProgress) => void;
  onAnswerSaved: (data: {
    questionId: number;
    saved: boolean;
    progress: MarathonProgress;
  }) => void;
  onMarathonCompleted: (data: {
    progress: MarathonProgress;
    message: string;
  }) => void;
  onError: (error: { message: string }) => void;
}

export const useMarathonSocket = (
  marathonId: string | undefined,
  events: MarathonSocketEvents
) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Debounce para save-answer
  const saveAnswerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!marathonId) return;

    // Criar conexão WebSocket
    const socket = io(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
      }/marathon-session`,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current = socket;

    // Event listeners de conexão
    socket.on("connect", () => {
      console.log("Connected to marathon session");
      setIsConnected(true);
      setConnectionError(null);

      // Iniciar maratona após conectar
      socket.emit("start-marathon", marathonId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from marathon session");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Event listeners específicos da maratona
    socket.on("marathon-started", events.onMarathonStarted);
    socket.on("time-update", events.onTimeUpdate);
    socket.on("time-up", events.onTimeUp);
    socket.on("question-changed", events.onQuestionChanged);
    socket.on("answer-saved", events.onAnswerSaved);
    socket.on("marathon-completed", events.onMarathonCompleted);
    socket.on("error", events.onError);

    // Cleanup na desmontagem
    return () => {
      if (saveAnswerTimeoutRef.current) {
        clearTimeout(saveAnswerTimeoutRef.current);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [marathonId]);

  // Função para emitir mudança de questão
  const changeQuestion = (questionId: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("change-question", {
        marathonId,
        questionId,
      });
    }
  };

  // Função para salvar rascunho com debounce
  const saveDraftAnswer = (questionId: number, draftAnswer: string) => {
    if (saveAnswerTimeoutRef.current) {
      clearTimeout(saveAnswerTimeoutRef.current);
    }

    saveAnswerTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && isConnected && draftAnswer.trim()) {
        socketRef.current.emit("save-answer", {
          marathonId,
          questionId,
          draftAnswer: draftAnswer.trim(),
        });
      }
    }, 2000); // Debounce de 2 segundos
  };

  // Função para completar maratona
  const completeMarathon = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("complete-marathon", {
        marathonId,
      });
    }
  };

  return {
    isConnected,
    connectionError,
    changeQuestion,
    saveDraftAnswer,
    completeMarathon,
  };
};
