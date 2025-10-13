import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  isProfessorStats,
  isStudentStats,
} from "@/helper/roles-dashboard.helper";
import { useRecentMarathons } from "@/hooks/use-marathon";
import {
  BookOpen,
  Eye,
  Loader2,
  Medal,
  Plus,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface StatCard {
  title: string;
  value: string;
  icon: any;
  description: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch recent marathons and user stats from backend
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useRecentMarathons();

  // Get user stats from API data
  const userStats = dashboardData?.userStats;
  const recentMarathons = dashboardData?.marathons || [];

  // Helper function to get marathon status
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

  // Helper function to get difficulty display
  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "Iniciante";
      case "Intermediate":
        return "Intermediário";
      case "Advanced":
        return "Avançado";
      default:
        return difficulty;
    }
  };

  const studentStats: StatCard[] = [
    {
      title: "Pontuação Total",
      value: isStudentStats(userStats)
        ? userStats.total_points.toString()
        : "0",
      icon: Trophy,
      description: "Pontos acumulados",
    },
    {
      title: "Maratonas Participadas",
      value: isStudentStats(userStats)
        ? userStats.marathons_participated.toString()
        : "0",
      icon: BookOpen,
      description: "Maratonas concluídas",
    },
    {
      title: "Pódios",
      value: isStudentStats(userStats) ? userStats.podiums.toString() : "0",
      icon: Medal,
      description: "Top 3 posições",
    },
    {
      title: "Vitórias",
      value: isStudentStats(userStats)
        ? userStats.first_places.toString()
        : "0",
      icon: Target,
      description: "1º lugares conquistados",
    },
  ];

  const teacherStats: StatCard[] = [
    {
      title: "Maratonas Criadas",
      value: isProfessorStats(userStats)
        ? userStats.total_marathons.toString()
        : "0",
      icon: Trophy,
      description: "Total de Maratonas",
    },
    {
      title: "Turmas Criadas",
      value: isProfessorStats(userStats)
        ? userStats.total_classes.toString()
        : "0",
      icon: BookOpen,
      description: "Turmas ativas",
    },
    {
      title: "Estudantes Alcançados",
      value: isProfessorStats(userStats)
        ? userStats.total_students_reached.toString()
        : "0",
      icon: Users,
      description: "Total de alunos",
    },
  ];

  const stats = user?.role === "Professor" ? teacherStats : studentStats;

  // Loading state
  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "Professor"
              ? "Gerencie suas turmas e maratonas"
              : "Continue sua jornada de aprendizado"}
          </p>
        </div>
      </div>

      <div
        className={`grid grid-cols-1  gap-6 ${
          isStudentStats(userStats) ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maratonas Recentes</CardTitle>
            <CardDescription>
              {user?.role === "Professor"
                ? "Suas maratonas mais recentes"
                : "Maratonas disponíveis para participar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMarathons.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user?.role === "Professor"
                    ? "Nenhuma maratona criada ainda"
                    : "Nenhuma maratona disponível"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {user?.role === "Professor"
                    ? "Crie sua primeira maratona para começar."
                    : "Aguarde novas maratonas serem disponibilizadas."}
                </p>
                {user?.role === "Professor" && (
                  <Button onClick={() => navigate("/marathons?create=true")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Maratona
                  </Button>
                )}
              </div>
            ) : (
              recentMarathons.map((marathon) => {
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
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{marathon.title}</h4>
                      <p className="text-sm text-gray-600">
                        {getDifficultyDisplay(marathon.difficulty)} •{" "}
                        {participantCount} participantes
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          status === "Aberta"
                            ? "bg-green-100 text-green-800"
                            : status === "Aguardando início"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/marathons/${marathon.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={() => navigate("/marathons")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              {user?.role === "Professor"
                ? "Gerenciar Maratonas"
                : "Explorar Maratonas"}
            </Button>

            {user?.role === "Professor" && (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/classes")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Turmas
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/marathons?create=true")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Nova Maratona
                </Button>
              </>
            )}

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/ranking")}
            >
              <Medal className="mr-2 h-4 w-4" />
              Ver Ranking
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
