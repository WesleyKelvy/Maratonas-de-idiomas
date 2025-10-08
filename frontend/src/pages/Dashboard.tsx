
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Medal, BookOpen, Plus, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentStats = [
    {
      title: "Pontuação Total",
      value: "1,250",
      icon: Trophy,
      description: "Pontos acumulados"
    },
    {
      title: "Maratonas Participadas",
      value: "12",
      icon: BookOpen,
      description: "Maratonas concluídas"
    },
    {
      title: "Pódios",
      value: "3",
      icon: Medal,
      description: "Primeiros lugares"
    }
  ];

  const teacherStats = [
    {
      title: "Turmas Criadas",
      value: "8",
      icon: Users,
      description: "Turmas ativas"
    },
    {
      title: "Maratonas Criadas",
      value: "15",
      icon: Trophy,
      description: "Maratonas disponíveis"
    },
    {
      title: "Alunos Impactados",
      value: "124",
      icon: Users,
      description: "Total de alunos"
    }
  ];

  const recentMarathons = [
    {
      id: 1,
      title: "Maratona de JavaScript",
      difficulty: "Intermediário",
      status: "Aberta",
      participants: 45
    },
    {
      id: 2,
      title: "Python para Iniciantes",
      difficulty: "Iniciante",
      status: "Aberta",
      participants: 32
    },
    {
      id: 3,
      title: "Algoritmos Avançados",
      difficulty: "Avançado",
      status: "Finalizada",
      participants: 28
    }
  ];

  const stats = user?.role === 'teacher' ? teacherStats : studentStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'teacher' 
              ? 'Gerencie suas turmas e maratonas' 
              : 'Continue sua jornada de aprendizado'
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {user?.role === 'teacher' 
                ? 'Suas maratonas mais recentes' 
                : 'Maratonas disponíveis para participar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMarathons.map((marathon) => (
              <div key={marathon.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{marathon.title}</h4>
                  <p className="text-sm text-gray-600">
                    {marathon.difficulty} • {marathon.participants} participantes
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    marathon.status === 'Aberta' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {marathon.status}
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
            ))}
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
              onClick={() => navigate('/marathons')}
            >
              <Trophy className="mr-2 h-4 w-4" />
              {user?.role === 'teacher' ? 'Gerenciar Maratonas' : 'Explorar Maratonas'}
            </Button>
            
            {user?.role === 'teacher' && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/classes')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Turmas
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/marathons?create=true')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Nova Maratona
                </Button>
              </>
            )}
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/ranking')}
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
