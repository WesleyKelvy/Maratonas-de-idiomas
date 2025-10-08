
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, MapPin, Briefcase, Calendar, Trophy, Users, FileText, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    occupation: user?.occupation || '',
    birthDate: user?.birthDate || '',
    bio: 'Estudante apaixonado por tecnologia e programação. Sempre em busca de novos desafios e aprendizados.'
  });

  const handleSave = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || '',
      occupation: user?.occupation || '',
      birthDate: user?.birthDate || '',
      bio: 'Estudante apaixonado por tecnologia e programação. Sempre em busca de novos desafios e aprendizados.'
    });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mock statistics
  const studentStats = [
    {
      title: "Pontuação Total",
      value: "2,450",
      icon: Trophy,
      description: "Pontos acumulados"
    },
    {
      title: "Maratonas Participadas",
      value: "11",
      icon: FileText,
      description: "Maratonas concluídas"
    },
    {
      title: "Posição no Ranking",
      value: "5º",
      icon: Trophy,
      description: "Classificação geral"
    },
    {
      title: "Média de Pontuação",
      value: "8.7",
      icon: Trophy,
      description: "Por maratona"
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
    },
    {
      title: "Avaliações Realizadas",
      value: "287",
      icon: FileText,
      description: "Submissões avaliadas"
    }
  ];

  const stats = user?.role === 'teacher' ? teacherStats : studentStats;

  const recentAchievements = [
    {
      title: "Primeiro Lugar",
      description: "Maratona de JavaScript",
      date: "2024-07-15",
      type: "gold"
    },
    {
      title: "Participação Ativa",
      description: "10 maratonas completadas",
      date: "2024-07-10",
      type: "silver"
    },
    {
      title: "Pontuação Alta",
      description: "Média acima de 8.5",
      date: "2024-07-05",
      type: "bronze"
    }
  ];

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
                    <Button size="sm" onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <Badge className={user?.role === 'teacher' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                    {user?.role === 'teacher' ? 'Professor' : 'Aluno'}
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
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{formData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{formData.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.city}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupação</Label>
                  {isEditing ? (
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{formData.occupation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        {formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <div className="p-3 border rounded bg-gray-50">
                    <p className="text-gray-700">{formData.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics and Achievements */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Seu desempenho na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-sm">{stat.title}</div>
                        <div className="text-xs text-gray-500">{stat.description}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Conquistas Recentes</CardTitle>
              <CardDescription>
                Suas últimas medalhas e reconhecimentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <Badge className={getAchievementColor(achievement.type)}>
                    {achievement.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
