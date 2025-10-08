import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Download, RefreshCw, Share2, BookOpen, Users, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Updated data structure based on database schema
const mockReportData = {
  id: "rep_123",
  classroom_code: "TURMA_A_2024",
  marathon_id: "mar_456",
  total_errors: 145,
  marathon: {
    title: "Maratona de Português - Nível Intermediário",
    description: "Avaliação completa de gramática e vocabulário"
  },
  report_details: [
    {
      id: 1,
      report_id: "rep_123",
      category_name: "Gramática",
      occurrences: 52,
      examples: "Uso incorreto do plural: 'Os menino foram ao parque'; Concordância verbal: 'A gente vamos estudar'; Uso do artigo: 'A água do mar'",
      targeted_advice: "Reforçar exercícios de concordância nominal e verbal. Praticar regras de plural e uso correto dos artigos definidos e indefinidos."
    },
    {
      id: 2,
      report_id: "rep_123",
      category_name: "Ortografia",
      occurrences: 38,
      examples: "Acentuação: 'medico' em vez de 'médico'; S/Z: 'analizar' em vez de 'analisar'; C/Ç: 'comeco' em vez de 'começo'",
      targeted_advice: "Intensificar o estudo das regras de acentuação gráfica e uso de s/z. Criar listas de palavras problemáticas para memorização."
    },
    {
      id: 3,
      report_id: "rep_123",
      category_name: "Vocabulário",
      occurrences: 31,
      examples: "Uso impreciso: 'fazer uma reunião' em vez de 'realizar uma reunião'; Anglicismo: 'deletar' em vez de 'excluir'; Regionalismo inadequado em contexto formal",
      targeted_advice: "Ampliar vocabulário formal e técnico. Praticar sinônimos e antônimos. Evitar estrangeirismos desnecessários."
    },
    {
      id: 4,
      report_id: "rep_123",
      category_name: "Sintaxe",
      occurrences: 24,
      examples: "Ordem inadequada: 'Ontem eu foi ao mercado'; Uso de pronomes: 'Eu vi ele na escola'; Regência verbal: 'Assistir o filme'",
      targeted_advice: "Estudar estrutura frasal e ordem dos elementos. Praticar colocação pronominal e regência verbal e nominal."
    }
  ]
};

// Calculated data based on database info
const calculatedData = {
  classroom: {
    name: "Turma A - 2024",
    total_students: 25
  },
  participation: {
    students_participated: 23,
    total_submissions: 115,
    participation_rate: 92,
    class_average: 7.8
  }
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const getSeverityColor = (occurrences: number, total: number) => {
  const percentage = (occurrences / total) * 100;
  if (percentage > 30) return "destructive";
  if (percentage > 15) return "secondary";
  return "default";
};

const getSeverityLabel = (occurrences: number, total: number) => {
  const percentage = (occurrences / total) * 100;
  if (percentage > 30) return "Crítico";
  if (percentage > 15) return "Moderado";
  return "Leve";
};

export default function MarathonReport() {
  const { marathonId } = useParams();
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [reportData, setReportData] = useState(mockReportData);
  const [isLoading, setIsLoading] = useState(false);

  // Process examples from string to array for display
  const processedReportDetails = reportData.report_details.map(detail => ({
    ...detail,
    examplesArray: detail.examples.split(';').map(ex => ex.trim())
  }));

  const pieData = processedReportDetails.map((category, index) => ({
    name: category.category_name,
    value: category.occurrences,
    color: COLORS[index % COLORS.length]
  }));

  const barData = processedReportDetails
    .sort((a, b) => b.occurrences - a.occurrences)
    .map((category) => ({
      category: category.category_name,
      occurrences: category.occurrences,
      percentage: ((category.occurrences / reportData.total_errors) * 100).toFixed(1)
    }));

  const handleRegenerateReport = async () => {
    setIsRegenerating(true);
    try {
      // Mock API call to regenerate report
      // await fetch(`/api/marathons/${marathonId}/report`, { method: 'POST' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Relatório Atualizado",
        description: "O relatório foi regenerado com os dados mais recentes.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao regenerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O relatório será baixado em breve.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link Copiado",
      description: "O link do relatório foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatório da Maratona</h1>
          <p className="text-muted-foreground mt-2">{reportData.marathon.title}</p>
          <p className="text-sm text-muted-foreground">
            Turma: {calculatedData.classroom.name} • Código: {reportData.classroom_code}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRegenerateReport}
            disabled={isRegenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerar
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedData.participation.students_participated}</div>
            <p className="text-xs text-muted-foreground">
              de {calculatedData.classroom.total_students} alunos
            </p>
            <Progress 
              value={calculatedData.participation.participation_rate} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Participação</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedData.participation.participation_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {calculatedData.participation.total_submissions} submissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média da Turma</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedData.participation.class_average}</div>
            <p className="text-xs text-muted-foreground">
              de 10.0 pontos
            </p>
            <Progress 
              value={calculatedData.participation.class_average * 10} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Erros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.total_errors}</div>
            <p className="text-xs text-muted-foreground">
              erros identificados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Erros por Categoria</CardTitle>
            <CardDescription>
              Proporção de cada tipo de erro encontrado nas submissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                gramática: { label: "Gramática", color: "hsl(var(--primary))" },
                ortografia: { label: "Ortografia", color: "hsl(var(--secondary))" },
                vocabulário: { label: "Vocabulário", color: "hsl(var(--accent))" },
                sintaxe: { label: "Sintaxe", color: "hsl(var(--muted))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Categorias de Erro</CardTitle>
            <CardDescription>
              Número de ocorrências por categoria, ordenado por frequência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                occurrences: { label: "Ocorrências", color: "hsl(var(--primary))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="occurrences" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Categories Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Categoria</CardTitle>
          <CardDescription>
            Análise detalhada de cada categoria de erro com exemplos e recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {processedReportDetails
              .sort((a, b) => b.occurrences - a.occurrences)
              .map((category) => {
                const percentage = ((category.occurrences / reportData.total_errors) * 100);
                const severity = getSeverityColor(category.occurrences, reportData.total_errors);
                const severityLabel = getSeverityLabel(category.occurrences, reportData.total_errors);
                
                return (
                  <AccordionItem key={category.id} value={category.id.toString()}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{category.category_name}</h3>
                          <Badge variant={severity}>{severityLabel}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {category.occurrences} ocorrências ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Exemplos de Erros:</h4>
                        <ul className="space-y-1">
                          {category.examplesArray.map((example, index) => (
                            <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recomendações:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-md">
                          {category.targeted_advice}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Action Buttons -- IGNORE THIS CARD*/}
      {/* <Card>
        <CardHeader>
          <CardTitle>Ações Recomendadas</CardTitle>
          <CardDescription>
            Próximos passos baseados nos resultados da análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">
              <BookOpen className="h-4 w-4 mr-2" />
              Criar Plano de Estudos
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Agendar Revisão
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar com Coordenação
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}