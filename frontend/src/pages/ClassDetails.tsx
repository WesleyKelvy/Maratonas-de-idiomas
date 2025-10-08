
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Calendar, ArrowLeft, Copy, UserPlus, Trophy, Eye, Trash2, Mail, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock data
  const classData = {
    id: parseInt(id || '1'),
    name: "Turma de JavaScript - 2024.1",
    code: "JS2024A",
    description: "Turma focada em desenvolvimento web com JavaScript moderno",
    studentCount: 25,
    maxStudents: 30,
    expirationDate: "2024-12-31",
    creator: "Prof. Ana Silva",
    isActive: true,
    inviteLink: `${window.location.origin}/join-class/JS2024A`
  };

  const students = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      joinDate: "2024-01-15",
      totalScore: 850,
      marathonsCompleted: 8
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      joinDate: "2024-01-16",
      totalScore: 920,
      marathonsCompleted: 9
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@email.com",
      joinDate: "2024-01-20",
      totalScore: 740,
      marathonsCompleted: 7
    }
  ];

  const linkedMarathons = [
    {
      id: 1,
      title: "Maratona de JavaScript Básico",
      difficulty: "Iniciante",
      status: "Aberta",
      participants: 22,
      startDate: "2024-07-15"
    },
    {
      id: 2,
      title: "JavaScript Avançado",
      difficulty: "Avançado",
      status: "Finalizada",
      participants: 18,
      startDate: "2024-07-01"
    },
    {
      id: 3,
      title: "DOM e Eventos",
      difficulty: "Intermediário",
      status: "Aguardando início",
      participants: 0,
      startDate: "2024-07-25"
    }
  ];

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(classData.inviteLink);
    toast({
      title: "Link copiado!",
      description: "O link de convite foi copiado para a área de transferência.",
    });
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail) {
      toast({
        title: "Email obrigatório",
        description: "Digite um email para enviar o convite.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Convite enviado!",
      description: `Convite enviado para ${inviteEmail}`,
    });
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveStudent = (studentName: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${studentName} da turma?`)) {
      toast({
        title: "Aluno removido",
        description: `${studentName} foi removido da turma.`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberta':
        return 'bg-green-100 text-green-800';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800';
      case 'Aguardando início':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediário':
        return 'bg-orange-100 text-orange-800';
      case 'Avançado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/classes')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-gray-600 mt-1">Código: {classData.code}</p>
        </div>
      </div>

      {/* Class Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{classData.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Código: {classData.code}
                </Badge>
                <Badge className={classData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {classData.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          {classData.description && (
            <CardDescription className="text-sm">
              {classData.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Users className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{classData.studentCount}/{classData.maxStudents}</div>
              <div className="text-sm text-gray-600">Alunos</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Calendar className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <div className="text-lg font-bold">
                {new Date(classData.expirationDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Expira em</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Trophy className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{linkedMarathons.length}</div>
              <div className="text-sm text-gray-600">Maratonas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="marathons">Maratonas Vinculadas</TabsTrigger>
          <TabsTrigger value="invite">Convidar Aluno</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Alunos da Turma ({students.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span>Entrou em: {new Date(student.joinDate).toLocaleDateString('pt-BR')}</span>
                        <span>Pontuação: {student.totalScore}</span>
                        <span>Maratonas: {student.marathonsCompleted}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marathons" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Maratonas Vinculadas ({linkedMarathons.length})</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/classes/${classData.id}/marathons`)}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Ver Todas
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/classes/${classData.id}/create-marathon`)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Maratona
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {linkedMarathons.map((marathon) => (
                  <div key={marathon.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{marathon.title}</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(marathon.status)}>
                          {marathon.status}
                        </Badge>
                        <Badge className={getDifficultyColor(marathon.difficulty)}>
                          {marathon.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span>Participantes: {marathon.participants}</span>
                        <span>Início: {new Date(marathon.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/marathons/${marathon.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Link de Convite
                </CardTitle>
                <CardDescription>
                  Compartilhe este link para que alunos se juntem à turma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 border rounded-lg break-all text-sm">
                  {classData.inviteLink}
                </div>
                <Button onClick={handleCopyInviteLink} className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Convite por Email
                </CardTitle>
                <CardDescription>
                  Envie um convite diretamente para o email do aluno
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="email@exemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <Button onClick={handleInviteByEmail} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enviar Convite
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetails;
