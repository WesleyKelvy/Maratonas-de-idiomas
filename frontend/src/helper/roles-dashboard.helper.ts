import { ProfessorStats, StudentStats } from "@/services/profile.service";

/**
 * Verifica se as stats são de um estudante
 * @param stats - Stats do usuário (pode ser undefined durante loading)
 * @returns true se for StudentStats válido
 */
export function isStudentStats(
  stats: StudentStats | ProfessorStats | null | undefined
): stats is StudentStats {
  return stats != null && "total_points" in stats;
}

/**
 * Verifica se as stats são de um professor
 * @param stats - Stats do usuário (pode ser undefined durante loading)
 * @returns true se for ProfessorStats válido
 */
export function isProfessorStats(
  stats: StudentStats | ProfessorStats | null | undefined
): stats is ProfessorStats {
  return stats != null && "total_classes" in stats;
}
