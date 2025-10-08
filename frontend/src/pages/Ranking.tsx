
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Crown, Award, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Ranking = () => {
  const { user } = useAuth();
  const [selectedMarathon, setSelectedMarathon] = useState('all');

  const marathons = [
    { id: 'all', name: 'Ranking Geral' },
    { id: 1, name: 'Maratona de JavaScript' },
    { id: 2, name: 'Python para Iniciantes' },
    { id: 3, name: 'Algoritmos Avançados' },
    { id: 4, name: 'Desenvolvimento Web' }
  ];

  const rankings = [
    {
      position: 1,
      name: "Ana Carolina Silva",
      email: "ana@email.com",
      score: 2850,
      marathonsCompleted: 15,
      averageScore: 9.5,
      isCurrentUser: false
    },
    {
      position: 2,
      name: "Carlos Eduardo Santos",
      email: "carlos@email.com",
      score: 2720,
      marathonsCompleted: 14,
      averageScore: 9.2,
      isCurrentUser: false
    },
    {
      position: 3,
      name: "Maria Fernanda Costa",
      email: "maria@email.com",
      score: 2680,
      marathonsCompleted: 13,
      averageScore: 9.1,
      isCurrentUser: false
    },
    {
      position: 4,
      name: "Pedro Henrique Lima",
      email: "pedro@email.com",
      score: 2590,
      marathonsCompleted: 12,
      averageScore: 8.9,
      isCurrentUser: false
    },
    {
      position: 5,
      name: "João Silva",
      email: user?.email || "joao@email.com",
      score: 2450,
      marathonsCompleted: 11,
      averageScore: 8.7,
      isCurrentUser: true
    },
    {
      position: 6,
      name: "Isabela Rodrigues",
      email: "isabela@email.com",
      score: 2380,
      marathonsCompleted: 10,
      averageScore: 8.5,
      isCurrentUser: false
    },
    {
      position: 7,
      name: "Rafael Oliveira",
      email: "rafael@email.com",
      score: 2290,
      marathonsCompleted: 10,
      averageScore: 8.3,
      isCurrentUser: false
    },
    {
      position: 8,
      name: "Beatriz Alves",
      email: "beatriz@email.com",
      score: 2180,
      marathonsCompleted: 9,
      averageScore: 8.1,
      isCurrentUser: false
    },
    {
      position: 9,
      name: "Lucas Fernandes",
      email: "lucas@email.com",
      score: 2090,
      marathonsCompleted: 9,
      averageScore: 7.9,
      isCurrentUser: false
    },
    {
      position: 10,
      name: "Camila Santos",
      email: "camila@email.com",
      score: 1980,
      marathonsCompleted: 8,
      averageScore: 7.7,
      isCurrentUser: false
    }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="w-5"></div>;
    }
  };

  const getPositionBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-gray-100 text-gray-800';
      case 3:
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const topThree = rankings.slice(0, 3);
  const currentUserRank = rankings.find(rank => rank.isCurrentUser);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
          <p className="text-gray-600 mt-2">
            Veja sua posição e compete com outros participantes
          </p>
        </div>
      </div>

      {/* Marathon Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Selecionar Maratona:</label>
            <Select value={selectedMarathon} onValueChange={setSelectedMarathon}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {marathons.map(marathon => (
                  <SelectItem key={marathon.id} value={marathon.id.toString()}>
                    {marathon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Pódio - Top 3
          </CardTitle>
          <CardDescription>
            Os três melhores colocados no ranking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((rank, index) => (
              <Card key={rank.position} className={`text-center ${rank.position === 1 ? 'ring-2 ring-yellow-500' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {getPositionIcon(rank.position)}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{rank.name}</h3>
                    <Badge className={getPositionBadgeColor(rank.position)}>
                      {rank.position}º Lugar
                    </Badge>
                    <div className="text-2xl font-bold text-blue-600">
                      {rank.score.toLocaleString()} pts
                    </div>
                    <div className="text-sm text-gray-600">
                      {rank.marathonsCompleted} maratonas • Média: {rank.averageScore}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current User Position (if not in top 3) */}
      {currentUserRank && currentUserRank.position > 3 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Sua Posição Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getPositionIcon(currentUserRank.position)}
                  <span className="font-bold text-lg">{currentUserRank.position}º</span>
                </div>
                <div>
                  <div className="font-semibold">{currentUserRank.name}</div>
                  <div className="text-sm text-gray-600">
                    {currentUserRank.marathonsCompleted} maratonas completadas
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {currentUserRank.score.toLocaleString()} pts
                </div>
                <div className="text-sm text-gray-600">
                  Média: {currentUserRank.averageScore}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ranking Completo
          </CardTitle>
          <CardDescription>
            Classificação geral de todos os participantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Participante</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Maratonas</TableHead>
                  <TableHead>Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((rank) => (
                  <TableRow 
                    key={rank.position} 
                    className={rank.isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPositionIcon(rank.position)}
                        <span className="font-bold">{rank.position}º</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`font-semibold ${rank.isCurrentUser ? 'text-blue-700' : ''}`}>
                          {rank.name}
                          {rank.isCurrentUser && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">Você</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{rank.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-lg">
                        {rank.score.toLocaleString()}
                      </span>
                      <span className="text-gray-500 ml-1">pts</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-semibold">{rank.marathonsCompleted}</div>
                        <div className="text-xs text-gray-500">completadas</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {rank.averageScore}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ranking;
