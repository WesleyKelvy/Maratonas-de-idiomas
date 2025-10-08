import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CreateMarathon = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [marathon, setMarathon] = useState({
    title: '',
    description: '',
    context: '',
    difficulty: '',
    timeLimit: '',
    startDate: '',
    endDate: '',
    questions: [{ title: '', prompt: '' }]
  });

  // Mock classroom data
  const classroom = {
    id: classId || '1',
    name: 'Turma de JavaScript - 2024.1',
    code: 'JS2024A'
  };

  const handleAddQuestion = () => {
    setMarathon({
      ...marathon,
      questions: [...marathon.questions, { title: '', prompt: '' }]
    });
  };

  const handleRemoveQuestion = (index: number) => {
    if (marathon.questions.length > 1) {
      const newQuestions = marathon.questions.filter((_, i) => i !== index);
      setMarathon({ ...marathon, questions: newQuestions });
    }
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...marathon.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setMarathon({ ...marathon, questions: newQuestions });
  };

  const handleSubmit = () => {
    if (!marathon.title || !marathon.difficulty || !marathon.timeLimit || !marathon.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyQuestions = marathon.questions.some(q => !q.title || !q.prompt);
    if (hasEmptyQuestions) {
      toast({
        title: "Questões incompletas",
        description: "Todas as questões devem ter título e enunciado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Maratona criada!",
      description: `A maratona "${marathon.title}" foi criada com sucesso.`,
    });

    navigate(`/classes/${classId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/classes/${classId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Criar Maratona</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-600">Turma:</span>
            <Badge variant="outline">{classroom.name}</Badge>
            <Badge>{classroom.code}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Gerais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Configure os detalhes básicos da maratona
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Maratona *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Maratona de JavaScript Básico"
                  value={marathon.title}
                  onChange={(e) => setMarathon({ ...marathon, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os objetivos e conteúdo da maratona..."
                  value={marathon.description}
                  onChange={(e) => setMarathon({ ...marathon, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="context">Contexto</Label>
                <Textarea
                  id="context"
                  placeholder="Informações adicionais sobre o contexto da maratona..."
                  value={marathon.context}
                  onChange={(e) => setMarathon({ ...marathon, context: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Dificuldade *</Label>
                  <Select value={marathon.difficulty} onValueChange={(value) => setMarathon({ ...marathon, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Iniciante</SelectItem>
                      <SelectItem value="Intermediate">Intermediário</SelectItem>
                      <SelectItem value="Advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeLimit">Tempo Limite (minutos) *</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    placeholder="120"
                    value={marathon.timeLimit}
                    onChange={(e) => setMarathon({ ...marathon, timeLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data/Hora de Início *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={marathon.startDate}
                    onChange={(e) => setMarathon({ ...marathon, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data/Hora de Fim</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={marathon.endDate}
                    onChange={(e) => setMarathon({ ...marathon, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questões */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Questões</CardTitle>
                  <CardDescription>
                    Adicione as questões da maratona
                  </CardDescription>
                </div>
                <Button onClick={handleAddQuestion} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Questão
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {marathon.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Questão {index + 1}</h4>
                    {marathon.questions.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label>Título da Questão *</Label>
                    <Input
                      placeholder="Ex: Implementar função de ordenação"
                      value={question.title}
                      onChange={(e) => handleQuestionChange(index, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Enunciado da Questão *</Label>
                    <Textarea
                      placeholder="Descreva detalhadamente o que o aluno deve fazer..."
                      value={question.prompt}
                      onChange={(e) => handleQuestionChange(index, 'prompt', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Turma</Label>
                <p className="text-sm text-gray-600">{classroom.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Código da Turma</Label>
                <p className="text-sm text-gray-600">{classroom.code}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Questões</Label>
                <p className="text-sm text-gray-600">{marathon.questions.length} questões</p>
              </div>

              {marathon.difficulty && (
                <div>
                  <Label className="text-sm font-medium">Dificuldade</Label>
                  <Badge variant="outline" className="mt-1">
                    {marathon.difficulty === 'Beginner' ? 'Iniciante' : 
                     marathon.difficulty === 'Intermediate' ? 'Intermediário' : 'Avançado'}
                  </Badge>
                </div>
              )}

              {marathon.timeLimit && (
                <div>
                  <Label className="text-sm font-medium">Tempo Limite</Label>
                  <p className="text-sm text-gray-600">{marathon.timeLimit} minutos</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={handleSubmit} className="w-full">
              Criar Maratona
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/classes/${classId}`)} 
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMarathon;