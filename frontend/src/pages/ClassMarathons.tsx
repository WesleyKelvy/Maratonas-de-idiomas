import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Users, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  ArrowLeft,
  Copy,
  Calendar,
  Play
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ClassMarathons = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Mock classroom data
  const classroom = {
    id: classId || '1',
    name: 'Turma de JavaScript - 2024.1',
    code: 'JS2024A',
    studentCount: 25
  };

  // Mock marathons data for this class
  const marathons = [
    {
      id: 'mar001',
      title: "Fundamentos de JavaScript",
      description: "Teste básico sobre sintaxe e conceitos fundamentais do JavaScript.",
      difficulty: "Beginner",
      status: "Aberta",
      participants: 18,
      duration: 90,
      questions: 8,
      startDate: "2024-07-15T09:00",
      endDate: "2024-07-20T23:59",
      createdAt: "2024-07-10"
    },
    {
      id: 'mar002',
      title: "Manipulação do DOM",
      description: "Exercícios práticos sobre manipulação de elementos DOM com JavaScript.",
      difficulty: "Intermediate",
      status: "Aberta",
      participants: 12,
      duration: 120,
      questions: 10,
      startDate: "2024-07-18T14:00",
      endDate: "2024-07-25T23:59",
      createdAt: "2024-07-12"
    },
    {
      id: 'mar003',
      title: "Programação Assíncrona",
      description: "Promises, async/await e manipulação de APIs.",
      difficulty: "Advanced",
      status: "Aguardando início",
      participants: 0,
      duration: 180,
      questions: 12,
      startDate: "2024-07-25T10:00",
      endDate: "2024-07-30T23:59",
      createdAt: "2024-07-14"
    },
    {
      id: 'mar004',
      title: "Estruturas de Dados",
      description: "Arrays, objetos e estruturas de dados complexas.",
      difficulty: "Intermediate",
      status: "Finalizada",
      participants: 22,
      duration: 150,
      questions: 15,
      startDate: "2024-07-01T09:00",
      endDate: "2024-07-05T23:59",
      createdAt: "2024-06-28"
    }
  ];

  const filteredMarathons = marathons.filter(marathon => {
    const matchesSearch = marathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         marathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || marathon.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || marathon.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const getStatusColor = (status) => {
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyMarathonId = (marathonId) => {
    navigator.clipboard.writeText(marathonId);
    toast({
      title: "ID copiado!",
      description: "O ID da maratona foi copiado para a área de transferência.",
    });
  };

  const handleDeleteMarathon = (marathonId, marathonTitle) => {
    if (window.confirm(`Tem certeza que deseja excluir a maratona "${marathonTitle}"?`)) {
      toast({
        title: "Maratona excluída",
        description: `A maratona "${marathonTitle}" foi excluída com sucesso.`,
      });
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
          Voltar para Turmas
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Maratonas da Turma</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{classroom.name}</Badge>
            <Badge>{classroom.code}</Badge>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{classroom.studentCount} alunos</span>
          </div>
        </div>
        <Button onClick={() => navigate(`/classes/${classId}/create-marathon`)}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Maratona
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar maratonas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Aguardando início">Aguardando início</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                <SelectItem value="Beginner">Iniciante</SelectItem>
                <SelectItem value="Intermediate">Intermediário</SelectItem>
                <SelectItem value="Advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Maratonas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMarathons.map((marathon) => (
          <Card key={marathon.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{marathon.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(marathon.status)}>
                      {marathon.status}
                    </Badge>
                    <Badge className={getDifficultyColor(marathon.difficulty)}>
                      {marathon.difficulty === 'Beginner' ? 'Iniciante' : 
                       marathon.difficulty === 'Intermediate' ? 'Intermediário' : 'Avançado'}
                    </Badge>
                  </div>
                </div>
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <CardDescription className="text-sm">
                {marathon.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{marathon.participants} participantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{marathon.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gray-500" />
                  <span>{marathon.questions} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>ID: {marathon.id}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Início: {new Date(marathon.startDate).toLocaleString('pt-BR')}</p>
                <p>Fim: {new Date(marathon.endDate).toLocaleString('pt-BR')}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/marathons/${marathon.id}`)}
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyMarathonId(marathon.id)}
                  title="Copiar ID da maratona para compartilhar com alunos"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  title="Editar maratona"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteMarathon(marathon.id, marathon.title)}
                  className="text-red-600 hover:text-red-700"
                  title="Excluir maratona"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {marathon.status === 'Aberta' && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-blue-900">Compartilhe com os alunos:</p>
                  <p className="text-blue-700">ID da maratona: <code className="bg-blue-100 px-1 rounded">{marathon.id}</code></p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMarathons.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma maratona encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || difficultyFilter !== 'all' 
                ? 'Tente ajustar os filtros para encontrar maratonas.' 
                : 'Comece criando a primeira maratona para esta turma.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && difficultyFilter === 'all' && (
              <Button onClick={() => navigate(`/classes/${classId}/create-marathon`)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Maratona
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassMarathons;