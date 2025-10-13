import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LanguageMarathon } from "@/services/marathon.service";

// --- CONSTANTS ---
export const MARATHON_STATUS = {
  OPEN: "Aberta",
  FINISHED: "Finalizada",
  WAITING: "Aguardando início",
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

export const DIFFICULTY_DISPLAY = {
  [DIFFICULTY_LEVELS.BEGINNER]: "Iniciante",
  [DIFFICULTY_LEVELS.INTERMEDIATE]: "Intermediário",
  [DIFFICULTY_LEVELS.ADVANCED]: "Avançado",
} as const;

// --- PURE FUNCS ---
export const getMarathonStatus = (marathon: LanguageMarathon): string => {
  const now = new Date();
  const startDate = marathon.start_date ? new Date(marathon.start_date) : null;
  const endDate = marathon.end_date ? new Date(marathon.end_date) : null;

  if (endDate && now > endDate) return MARATHON_STATUS.FINISHED;
  if (startDate && now < startDate) return MARATHON_STATUS.WAITING;
  return MARATHON_STATUS.OPEN;
};

export const getDifficultyDisplay = (difficulty: string): string => {
  return (
    DIFFICULTY_DISPLAY[difficulty as keyof typeof DIFFICULTY_DISPLAY] ||
    difficulty
  );
};

export const formatDateTime = (date: string): string => {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case MARATHON_STATUS.OPEN:
      return "bg-green-100 text-green-800";
    case MARATHON_STATUS.FINISHED:
      return "bg-gray-100 text-gray-800";
    case MARATHON_STATUS.WAITING:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getDifficultyColor = (difficulty: string) => {
  const display = getDifficultyDisplay(difficulty);
  switch (display) {
    case DIFFICULTY_DISPLAY.Beginner:
      return "bg-blue-100 text-blue-800";
    case DIFFICULTY_DISPLAY.Intermediate:
      return "bg-orange-100 text-orange-800";
    case DIFFICULTY_DISPLAY.Advanced:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const parseLocalDateTime = (dateTimeStr: string): Date =>
  new Date(dateTimeStr);

export const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
