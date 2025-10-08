import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  RefreshCw,
  Share2,
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReport, useCreateReport } from "@/hooks/use-report";
import type { Report } from "@/services/report.service";

const COLORS = ["#D5BF86", "#493548", "#7389AE", "#416788", "#171d2f"];

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
  const { marathonId } = useParams<{ marathonId: string }>();
  const { toast } = useToast();

  // Hooks para buscar e gerenciar dados do relatório
  const {
    data: reportData,
    isLoading,
    error,
    refetch,
  } = useReport(marathonId || "");
  const createReportMutation = useCreateReport();

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando relatório...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !reportData) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Erro ao carregar relatório
          </h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || "Relatório não encontrado"}
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Process examples from string to array for display
  const processedReportDetails =
    reportData.report_details?.map((detail) => {
      let examplesArray = [];
      try {
        examplesArray = JSON.parse(detail.examples);
      } catch (e) {
        console.error("Falha ao fazer parse dos exemplos:", e);
      }

      return {
        ...detail,
        examplesArray,
      };
    }) || [];

  const pieData = processedReportDetails.map((category, index) => ({
    name: category.category_name,
    value: category.occurrences,
    color: COLORS[index % COLORS.length],
  }));

  const barData = processedReportDetails
    .sort((a, b) => b.occurrences - a.occurrences)
    .map((category, index) => ({
      category: category.category_name,
      occurrences: category.occurrences,
      percentage: (
        (category.occurrences / reportData.total_errors) *
        100
      ).toFixed(1),
      color: COLORS[index % COLORS.length],
    }));

  const handleRegenerateReport = async () => {
    if (!marathonId) return;

    createReportMutation.mutate(marathonId, {
      onSuccess: () => {
        toast({
          title: "Relatório Atualizado",
          description: "O relatório foi regenerado com os dados mais recentes.",
        });
      },
      onError: (error) => {
        console.error("Erro ao regenerar relatório:", error);
        toast({
          title: "Erro",
          description: "Falha ao regenerar o relatório. Tente novamente.",
          variant: "destructive",
        });
      },
    });
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
      description:
        "O link do relatório foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatório da Maratona</h1>
          <p className="text-muted-foreground mt-2">
            Análise detalhada dos resultados
          </p>
          <p className="text-sm text-muted-foreground">
            Turma: {reportData.classroom_name} • Relatório ID: {reportData.id}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          {/* <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button> */}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categorias de Erro
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedReportDetails.length}
            </div>
            <p className="text-xs text-muted-foreground">
              categorias identificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data do Relatório
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(reportData.created_at).toLocaleDateString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">relatório gerado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maior Categoria
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedReportDetails.length > 0
                ? processedReportDetails.reduce((max, current) =>
                    current.occurrences > max.occurrences ? current : max
                  ).category_name
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              categoria com mais erros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Erros
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.total_errors}</div>
            <p className="text-xs text-muted-foreground">erros identificados</p>
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
                gramática: { label: "Gramática", color: "#D5BF86" },
                ortografia: {
                  label: "Ortografia",
                  color: "#493548",
                },
                vocabulário: {
                  label: "Vocabulário",
                  color: "#7389AE",
                },
                sintaxe: { label: "Sintaxe", color: "#416788" },
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
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
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
                occurrences: {
                  label: "Ocorrências",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  {/* MODIFICAÇÃO AQUI 👇 */}
                  {/* Remova a propriedade 'fill' e adicione o mapeamento com <Cell> */}
                  <Bar dataKey="occurrences">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
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
            Análise detalhada de cada categoria de erro com exemplos e
            recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {processedReportDetails
              .sort((a, b) => b.occurrences - a.occurrences)
              .map((category) => {
                const percentage =
                  (category.occurrences / reportData.total_errors) * 100;
                const severity = getSeverityColor(
                  category.occurrences,
                  reportData.total_errors
                );
                const severityLabel = getSeverityLabel(
                  category.occurrences,
                  reportData.total_errors
                );

                return (
                  <AccordionItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {category.category_name}
                          </h3>
                          <Badge variant={severity}>{severityLabel}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {category.occurrences} ocorrências (
                            {percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Exemplos de Erros:</h4>
                        <ul className="space-y-1">
                          {category.examplesArray.map((example, index) => (
                            <li
                              key={index}
                              className="text-sm pl-4 border-l-2 border-muted"
                            >
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
