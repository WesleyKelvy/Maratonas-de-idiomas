import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Save,
  Trophy,
  User,
  Users,
  X,
  ChartColumn,
  Brain,
  BicepsFlexed,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import {
  useStudentStats,
  useProfessorStats,
  useUpdateUser,
} from "@/hooks/use-profile";
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from "@/schemas/profileSchemas";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Hooks para buscar dados
  const {
    data: studentStats,
    isLoading: studentStatsLoading,
    error: studentStatsError,
  } = useStudentStats(user?.id, user?.role === "Student");
  const {
    data: professorStats,
    isLoading: professorStatsLoading,
    error: professorStatsError,
  } = useProfessorStats(user?.id, user?.role === "Professor");

  // Hook para atualizar dados
  const updateUserMutation = useUpdateUser();

  // React Hook Form com Zod
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      city: user?.city || "",
      occupation: user?.occupation || "",
      birthDate: user?.birthdate || "",
    },
  });

  const watchedFields = watch();

  // Atualizar form quando user mudar
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        city: user.city || "",
        occupation: user.occupation || "",
        birthDate: user.birthdate || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        name: data.name,
        city: data.city,
        occupation: data.occupation,
        birthdate: data.birthDate,
      });

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description:
          "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Preparar estatísticas baseado no role do usuário
  const getStatsDisplay = () => {
    if (user?.role === "Student" && studentStats) {
      return [
        {
          title: "Pontuação Total",
          value: studentStats.total_points?.toString() || "0",
          icon: Trophy,
          description: "Pontos acumulados",
        },
        {
          title: "Maratonas Participadas",
          value: studentStats.marathons_participated?.toString() || "0",
          icon: FileText,
          description: "Maratonas concluídas",
        },
        {
          title: "Primeiros Lugares",
          value: studentStats.first_places?.toString() || "0",
          icon: Brain,
          description: "Vitórias conquistadas",
        },
        {
          title: "Pódios",
          value: studentStats.podiums?.toString() || "0",
          icon: ChartColumn,
          description: "Posições no top 3",
        },
      ];
    } else if (user?.role === "Professor" && professorStats) {
      return [
        {
          title: "Turmas Criadas",
          value: professorStats.total_classes?.toString() || "0",
          icon: Users,
          description: "Turmas ativas",
        },
        {
          title: "Maratonas Criadas",
          value: professorStats.total_marathons?.toString() || "0",
          icon: Trophy,
          description: "Maratonas disponíveis",
        },
        {
          title: "Alunos Alcançados",
          value: professorStats.total_students_reached?.toString() || "0",
          icon: Users,
          description: "Total de alunos",
        },
      ];
    }
    return [];
  };

  const statsDisplay = getStatsDisplay();
  const isStatsLoading = studentStatsLoading || professorStatsLoading;

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const recentAchievements = [
    {
      title: "Primeiro Lugar",
      description: "Maratona de JavaScript",
      date: "2024-07-15",
      type: "Gold",
      icon: Trophy,
    },
    {
      title: "Participação Ativa",
      description: "10 maratonas completadas",
      date: "2024-07-10",
      type: "Silver",
      icon: BicepsFlexed,
    },
    {
      title: "Pontuação Alta",
      description: "Média acima de 8.5",
      date: "2024-07-05",
      type: "Bronze",
      icon: Brain,
    },
  ];

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Bronze":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e veja suas estatísticas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informações Pessoais</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      type="submit"
                      form="profile-form"
                      disabled={updateUserMutation.isPending || !isDirty}
                    >
                      {updateUserMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <Badge
                      className={
                        user?.role === "Professor"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {user?.role === "Professor" ? "Professor" : "Aluno"}
                    </Badge>
                    {user?.verified && (
                      <Badge className="ml-2 bg-green-100 text-green-800">
                        Verificado
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    {isEditing ? (
                      <div>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{watchedFields.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    {isEditing ? (
                      <div>
                        <Input id="city" {...register("city")} />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{watchedFields.city}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Ocupação</Label>
                    {isEditing ? (
                      <div>
                        <Input id="occupation" {...register("occupation")} />
                        {errors.occupation && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.occupation.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{watchedFields.occupation}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    {isEditing ? (
                      <div>
                        <Input
                          id="birthDate"
                          type="date"
                          {...register("birthDate")}
                        />
                        {errors.birthDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.birthDate.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {watchedFields.birthDate
                            ? new Date(
                                watchedFields.birthDate
                              ).toLocaleDateString("pt-BR")
                            : "Não informado"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Statistics and Achievements */}
        <div>
          {/* Statistics */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Seu desempenho na plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isStatsLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Carregando estatísticas...</span>
                </div>
              ) : studentStatsError || professorStatsError ? (
                <div className="text-center p-6 text-red-600">
                  <div>Erro ao carregar estatísticas:</div>
                  <div className="text-sm mt-2">
                    {studentStatsError?.message || professorStatsError?.message}
                  </div>
                </div>
              ) : statsDisplay.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  Nenhuma estatística disponível
                </div>
              ) : (
                statsDisplay.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="font-medium text-sm">
                            {stat.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {stat.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-600">
                        {stat.value}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
          <CardDescription>
            Suas últimas medalhas e reconhecimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.map((achievement, index) => {
            const AchievementIcon = achievement.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <AchievementIcon className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-600">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <Badge className={getAchievementColor(achievement.type)}>
                  {achievement.type}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
