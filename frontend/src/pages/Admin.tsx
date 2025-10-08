
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Trophy, BookOpen, MoreHorizontal, Edit, Trash2, Key, Search, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const adminStats = [
    {
      title: "Total de Usuários",
      value: "1,248",
      icon: Users,
      description: "Usuários ativos"
    },
    {
      title: "Maratonas Ativas",
      value: "23",
      icon: Trophy,
      description: "Em andamento"
    },
    {
      title: "Turmas Criadas",
      value: "67",
      icon: BookOpen,
      description: "Turmas totais"
    }
  ];

  const users = [
    {
      id: 1,
      name: "Ana Carolina Silva",
      email: "ana@email.com",
      role: "teacher",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-07-20"
    },
    {
      id: 2,
      name: "Carlos Eduardo Santos",
      email: "carlos@email.com",
      role: "student",
      status: "active",
      joinDate: "2024-02-10",
      lastLogin: "2024-07-19"
    },
    {
      id: 3,
      name: "Maria Fernanda Costa",
      email: "maria@email.com",
      role: "teacher",
      status: "inactive",
      joinDate: "2024-01-20",
      lastLogin: "2024-06-15"
    }
  ];

  const marathons = [
    {
      id: 1,
      title: "Maratona de JavaScript",
      creator: "Prof. Ana Silva",
      participants: 45,
      status: "active",
      createdDate: "2024-07-01"
    },
    {
      id: 2,
      title: "Python para Iniciantes",
      creator: "Prof. Carlos Santos",
      participants: 32,
      status: "active",
      createdDate: "2024-06-25"
    },
    {
      id: 3,
      title: "Algoritmos Avançados",
      creator: "Prof. Maria Costa",
      participants: 28,
      status: "finished",
      createdDate: "2024-06-15"
    }
  ];

  const classes = [
    {
      id: 1,
      name: "Turma de JavaScript - 2024.1",
      code: "JS2024A",
      teacher: "Prof. Ana Silva",
      students: 25,
      status: "active",
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Python para Iniciantes",
      code: "PY2024B",
      teacher: "Prof. Carlos Santos",
      students: 18,
      status: "active",
      createdDate: "2024-02-01"
    }
  ];

  const handleResetPassword = (userName: string) => {
    if (window.confirm(`Tem certeza que deseja resetar a senha de ${userName}?`)) {
      toast({
        title: "Senha resetada",
        description: `A senha de ${userName} foi resetada com sucesso.`,
      });
    }
  };

  const handleDeleteUser = (userName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${userName}?`)) {
      toast({
        title: "Usuário excluído",
        description: `${userName} foi removido do sistema.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMarathon = (marathonTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a maratona "${marathonTitle}"?`)) {
      toast({
        title: "Maratona excluída",
        description: `A maratona "${marathonTitle}" foi removida.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClass = (className: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a turma "${className}"?`)) {
      toast({
        title: "Turma excluída",
        description: `A turma "${className}" foi removida.`,
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'finished':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Professor';
      case 'student':
        return 'Aluno';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">
            Gerencie usuários, maratonas e turmas da plataforma
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminStats.map((stat, index) => {
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

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="marathons">Maratonas</TabsTrigger>
          <TabsTrigger value="classes">Turmas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Usuários</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(user.name)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marathons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Maratonas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Criador</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marathons.map((marathon) => (
                    <TableRow key={marathon.id}>
                      <TableCell className="font-medium">{marathon.title}</TableCell>
                      <TableCell>{marathon.creator}</TableCell>
                      <TableCell>{marathon.participants}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(marathon.status)}>
                          {getStatusLabel(marathon.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(marathon.createdDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMarathon(marathon.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Turmas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.code}</TableCell>
                      <TableCell>{classItem.teacher}</TableCell>
                      <TableCell>{classItem.students}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(classItem.status)}>
                          {getStatusLabel(classItem.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(classItem.createdDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClass(classItem.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
