
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Trophy, Clock } from 'lucide-react';

const Submissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marathonFilter, setMarathonFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  const submissions = [
    {
      id: 1,
      marathonName: "Maratona de JavaScript",
      questionNumber: 1,
      question: "Explique a diferença entre 'let', 'const' e 'var'",
      answer: "let é usado para variáveis que podem ser reatribuídas dentro de um escopo de bloco...",
      feedback: "Excelente resposta! Você demonstrou um bom entendimento do conceito e forneceu exemplos claros.",
      score: 9,
      maxScore: 10,
      submissionDate: "2024-07-15T14:30:00",
      aiEvaluation: "Positiva"
    },
    {
      id: 2,
      marathonName: "Maratona de JavaScript",
      questionNumber: 2,
      question: "O que são closures em JavaScript?",
      answer: "Closures são funções que têm acesso ao escopo da função externa mesmo após ela ter retornado...",
      feedback: "Boa resposta, mas poderia ser mais detalhada. Considere adicionar mais exemplos práticos.",
      score: 7,
      maxScore: 10,
      submissionDate: "2024-07-15T14:45:00",
      aiEvaluation: "Neutra"
    },
    {
      id: 3,
      marathonName: "Python para Iniciantes",
      questionNumber: 1,
      question: "Explique as principais características do Python",
      answer: "Python é uma linguagem de programação interpretada, orientada a objetos...",
      feedback: "Muito bem! Sua explicação foi clara e os exemplos foram muito apropriados.",
      score: 10,
      maxScore: 10,
      submissionDate: "2024-07-10T16:20:00",
      aiEvaluation: "Positiva"
    },
    {
      id: 4,
      marathonName: "Algoritmos Avançados",
      questionNumber: 3,
      question: "Implemente o algoritmo de ordenação QuickSort",
      answer: "function quickSort(arr) { if (arr.length <= 1) return arr...",
      feedback: "Resposta parcialmente correta. Você entendeu o básico, mas precisa aprofundar alguns aspectos.",
      score: 6,
      maxScore: 15,
      submissionDate: "2024-07-05T10:15:00",
      aiEvaluation: "Neutra"
    },
    {
      id: 5,
      marathonName: "Desenvolvimento Web",
      questionNumber: 2,
      question: "Explique a diferença entre CSS Grid e Flexbox",
      answer: "CSS Grid é um sistema de layout bidimensional, enquanto Flexbox é unidimensional...",
      feedback: "Resposta adequada, mas alguns pontos importantes foram perdidos. Revise o conceito para melhor compreensão.",
      score: 5,
      maxScore: 10,
      submissionDate: "2024-07-20T11:30:00",
      aiEvaluation: "Negativa"
    }
  ];

  const marathons = [...new Set(submissions.map(s => s.marathonName))];

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.marathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMarathon = marathonFilter === 'all' || submission.marathonName === marathonFilter;
    
    const matchesScore = scoreFilter === 'all' || 
      (scoreFilter === 'high' && (submission.score / submission.maxScore) >= 0.8) ||
      (scoreFilter === 'medium' && (submission.score / submission.maxScore) >= 0.5 && (submission.score / submission.maxScore) < 0.8) ||
      (scoreFilter === 'low' && (submission.score / submission.maxScore) < 0.5);
    
    return matchesSearch && matchesMarathon && matchesScore;
  });

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEvaluationColor = (evaluation: string) => {
    switch (evaluation) {
      case 'Positiva':
        return 'bg-green-100 text-green-800';
      case 'Neutra':
        return 'bg-yellow-100 text-yellow-800';
      case 'Negativa':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSubmissions = submissions.length;
  const averageScore = submissions.reduce((acc, sub) => acc + (sub.score / sub.maxScore), 0) / totalSubmissions;
  const highScoreSubmissions = submissions.filter(sub => (sub.score / sub.maxScore) >= 0.8).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submissões</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe suas respostas e feedback das maratonas
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Submissões
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Respostas enviadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pontuação Média
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(averageScore * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Em todas as submissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Altas Pontuações
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highScoreSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Submissões com 80%+ de acerto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar submissões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={marathonFilter} onValueChange={setMarathonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por maratona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as maratonas</SelectItem>
                {marathons.map(marathon => (
                  <SelectItem key={marathon} value={marathon}>{marathon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por pontuação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as pontuações</SelectItem>
                <SelectItem value="high">Alta (80%+)</SelectItem>
                <SelectItem value="medium">Média (50-79%)</SelectItem>
                <SelectItem value="low">Baixa (&lt; 50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Submissões</CardTitle>
          <CardDescription>
            Suas respostas enviadas e feedback recebido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Maratona</TableHead>
                  <TableHead>Questão</TableHead>
                  <TableHead>Resposta</TableHead>
                  <TableHead>Feedback da IA</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{submission.marathonName}</div>
                        <div className="text-sm text-gray-500">
                          Questão {submission.questionNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={submission.question}>
                        {submission.question}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={submission.answer}>
                        {submission.answer}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={submission.feedback}>
                        {submission.feedback}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(submission.score, submission.maxScore)}`}>
                        {submission.score}/{submission.maxScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEvaluationColor(submission.aiEvaluation)}>
                        {submission.aiEvaluation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(submission.submissionDate).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma submissão encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm || marathonFilter !== 'all' || scoreFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar submissões.'
                  : 'Você ainda não fez submissões. Participe de uma maratona para começar!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Submissions;
