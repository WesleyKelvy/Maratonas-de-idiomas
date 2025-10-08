import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Trophy, 
  Clock, 
  Eye, 
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface MarathonStats {
  totalEnrollments: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  topScorer: {
    name: string;
    score: number;
  };
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  questionsAnswered: number;
  totalQuestions: number;
  averageScore: number;
  lastSubmission: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface QuestionStats {
  id: number;
  title: string;
  totalSubmissions: number;
  averageScore: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

const MarathonDashboard = () => {
  const navigate = useNavigate();
  const { marathonId } = useParams();

  // Mock data - replace with API calls
  const marathon = {
    id: marathonId || '1',
    title: 'Maratona de JavaScript',
    description: 'Teste seus conhecimentos em JavaScript moderno',
    difficulty: 'Intermediário',
    startDate: '2024-12-01T09:00:00',
    endDate: '2024-12-07T23:59:59',
    totalQuestions: 5,
    timeLimit: 120,
    status: 'active'
  };

  const stats: MarathonStats = {
    totalEnrollments: 45,
    totalSubmissions: 178,
    averageScore: 7.3,
    completionRate: 73,
    topScorer: {
      name: 'Maria Santos',
      score: 9.8
    }
  };

  const studentsProgress: StudentProgress[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      questionsAnswered: 5,
      totalQuestions: 5,
      averageScore: 8.2,
      lastSubmission: '2024-12-05T16:30:00',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      questionsAnswered: 5,
      totalQuestions: 5,
      averageScore: 9.8,
      lastSubmission: '2024-12-05T15:45:00',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      questionsAnswered: 3,
      totalQuestions: 5,
      averageScore: 6.7,
      lastSubmission: '2024-12-05T14:20:00',
      status: 'in-progress'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      questionsAnswered: 0,
      totalQuestions: 5,
      averageScore: 0,
      lastSubmission: '',
      status: 'not-started'
    }
  ];

  const questionsStats: QuestionStats[] = [
    {
      id: 1,
      title: 'Diferenças entre let, const e var',
      totalSubmissions: 42,
      averageScore: 8.1,
      difficulty: 'Médio'
    },
    {
      id: 2,
      title: 'Closures em JavaScript',
      totalSubmissions: 38,
      averageScore: 6.9,
      difficulty: 'Difícil'
    },
    {
      id: 3,
      title: 'Promises e async/await',
      totalSubmissions: 35,
      averageScore: 7.5,
      difficulty: 'Difícil'
    },
    {
      id: 4,
      title: 'Array methods (map, filter, reduce)',
      totalSubmissions: 40,
      averageScore: 8.7,
      difficulty: 'Médio'
    },
    {
      id: 5,
      title: 'Event Loop e Callbacks',
      totalSubmissions: 23,
      averageScore: 5.8,
      difficulty: 'Difícil'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completo';
      case 'in-progress':
        return 'Em Progresso';
      case 'not-started':
        return 'Não Iniciado';
      default:
        return 'Desconhecido';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Difícil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{marathon.title}</h1>
          <p className="text-muted-foreground mt-2">{marathon.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/teacher-submissions')}>
            <FileText className="h-4 w-4 mr-2" />
            Ver Todas as Submissões
          </Button>
          <Button onClick={() => navigate(`/marathons/${marathon.id}/questions`)}>
            <Eye className="h-4 w-4 mr-2" />
            Gerenciar Questões
          </Button>
        </div>
      </div>

      {/* Marathon Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Período</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(marathon.startDate).toLocaleDateString('pt-BR')} - {new Date(marathon.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Tempo Limite</p>
                <p className="text-sm text-muted-foreground">{marathon.timeLimit} minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Questões</p>
                <p className="text-sm text-muted-foreground">{marathon.totalQuestions} questões</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(marathon.difficulty)}>
                {marathon.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscritos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Estudantes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissões
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Respostas enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média Geral
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              De 10 pontos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Completaram a maratona
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Melhor Pontuação
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topScorer.score}</div>
            <p className="text-xs text-muted-foreground">
              {stats.topScorer.name}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Progresso dos Estudantes</TabsTrigger>
          <TabsTrigger value="questions">Estatísticas por Questão</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Progresso dos Estudantes</CardTitle>
              <CardDescription>
                Acompanhe o progresso individual de cada estudante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudante</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Questões Respondidas</TableHead>
                      <TableHead>Média</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Submissão</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsProgress.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress 
                              value={(student.questionsAnswered / student.totalQuestions) * 100} 
                              className="w-20"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round((student.questionsAnswered / student.totalQuestions) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {student.questionsAnswered}/{student.totalQuestions}
                          </span>
                        </TableCell>
                        <TableCell>
                          {student.averageScore > 0 ? (
                            <span className="font-medium">{student.averageScore.toFixed(1)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(student.status)}>
                            {getStatusText(student.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.lastSubmission ? (
                            <div className="text-sm text-muted-foreground">
                              {new Date(student.lastSubmission).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(student.lastSubmission).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/teacher-submissions?student=${student.id}&marathon=${marathon.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Submissões
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas por Questão</CardTitle>
              <CardDescription>
                Análise do desempenho dos estudantes em cada questão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Questão</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>Submissões</TableHead>
                      <TableHead>Média</TableHead>
                      <TableHead>Taxa de Resposta</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionsStats.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">Questão {question.id}</div>
                            <div className="text-sm text-muted-foreground">{question.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{question.totalSubmissions}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{question.averageScore.toFixed(1)}/10</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress 
                              value={(question.totalSubmissions / stats.totalEnrollments) * 100} 
                              className="w-20"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round((question.totalSubmissions / stats.totalEnrollments) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/teacher-submissions?question=${question.id}&marathon=${marathon.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Respostas
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarathonDashboard;