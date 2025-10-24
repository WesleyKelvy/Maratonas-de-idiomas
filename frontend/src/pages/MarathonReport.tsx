import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useCreateReport, useReport } from "@/hooks/use-report";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Download,
  Loader2,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { io, Socket } from "socket.io-client";

const COLORS = [
  "#D5BF86",
  "#493548",
  "#7389AE",
  "#416788",
  "#171d2f",
  "#297373",
  "#B4654A",
  "#8F3985",
  "#C2BBF0",
];

const getSeverityColor = (occurrences: number, total: number) => {
  const percentage = (occurrences / total) * 100;
  if (percentage > 30)
    return "border-transparent bg-destructive text-destructive-foreground";
  if (percentage > 15) return "secondary";
  return "bg-secondary text-secondary-foreground";
};

const getSeverityLabel = (occurrences: number, total: number) => {
  const percentage = (occurrences / total) * 100;
  if (percentage > 30) return "Crítico";
  if (percentage > 15) return "Moderado";
  return "Leve";
};

export default function MarathonReport() {
  const { marathonId } = useParams<{ marathonId: string }>();
  const location = useLocation();
  const { toast } = useToast();

  // Status for WebSocket and report generation
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

  // Check whether to start generation automatically
  const shouldGenerate =
    new URLSearchParams(location.search).get("generate") === "true";

  // Hooks for fetching and managing report data
  const {
    data: reportData,
    isLoading,
    error,
    refetch,
  } = useReport(marathonId || "");
  const createReportMutation = useCreateReport();

  // Reset the flag when data is loaded successfully
  useEffect(() => {
    if (reportData && !isLoading && !error) {
      // console.log("Report data loaded successfully - stopping generation");
      setIsGenerating(false);
      setHasGeneratedReport(true); // Avoid new generation
    }
  }, [reportData, isLoading, error]);

  // WebSocket connection and report generation
  useEffect(() => {
    if (!marathonId) return;

    // CONDITIONS:
    // 1. No valid data yet (reportData is null/undefined)
    // 2. Not loading initial data
    // 3. (URL has generate=true OR there is an error)
    // 4. Not yet attempted to generate in this session
    // 5. Not in the process of generating
    // 6. No active socket connection
    if (
      !reportData &&
      !isLoading &&
      (shouldGenerate || error) &&
      !hasGeneratedReport &&
      !isGenerating &&
      !socket
    ) {
      console.log("Starting report generation - conditions met");
      initializeReportGeneration();
    }

    return () => {
      if (socket) {
        console.log("Disconnecting socket...");
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [
    marathonId,
    shouldGenerate,
    error,
    isLoading,
    hasGeneratedReport,
    isGenerating,
    reportData,
    socket,
  ]);

  const initializeReportGeneration = () => {
    // if (isGenerating || hasGeneratedReport || socket) {
    //   console.log(
    //     "Skipping generation - already generating, generated, or connected"
    //   );
    //   return;
    // }

    console.log("Initializing report generation for marathon:", marathonId);
    setIsGenerating(true);
    setHasGeneratedReport(true);
    setGenerationProgress(0);
    setGenerationMessage("Conectando ao servidor...");

    // Connect to WebSocket
    const socketConnection = io(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/reports`,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    socketConnection.on("connect", () => {
      // console.log("Connected to reports WebSocket");
      setGenerationMessage("Conectado! Iniciando geração do relatório...");

      // Request report generation
      socketConnection.emit("generate-report", { marathonId });
    });

    socketConnection.on("report-generation-started", (data) => {
      // console.log("Report generation started:", data);
      setGenerationMessage(data.message || "Geração iniciada!");
    });

    socketConnection.on("report-status", (data) => {
      console.log("Report status:", data);
      setGenerationMessage(data.message || "Processando...");
    });

    socketConnection.on("report-progress", (data) => {
      // console.log("Report progress:", data);
      setGenerationProgress(data.progress || 0);
      setGenerationMessage(data.message || `Processando... ${data.progress}%`);
    });

    socketConnection.on("report-ready", (data) => {
      // console.log("Report ready:", data);
      setGenerationProgress(100);
      setGenerationMessage("Relatório concluído!");
      setIsGenerating(false);

      // Update data from report
      refetch();

      toast({
        title: "Relatório Gerado",
        description: "O relatório foi gerado com sucesso!",
      });

      socketConnection.disconnect();
      setSocket(null);
    });

    socketConnection.on("report-error", (data) => {
      console.error("Report generation error:", data);
      setIsGenerating(false);
      setHasGeneratedReport(false); // Allows new try on error case
      setGenerationMessage("Erro na geração do relatório");

      // Se o erro for sobre relatório já existente, tentar recarregar os dados
      if (data.message?.includes("already has a report")) {
        toast({
          title: "Relatório já existe",
          description: "Carregando relatório existente...",
        });
        refetch();
      } else {
        toast({
          title: "Erro",
          description: data.message || "Falha ao gerar o relatório",
          variant: "destructive",
        });
      }

      socketConnection.disconnect();
      setSocket(null);
    });

    socketConnection.on("disconnect", () => {
      console.log("Disconnected from reports WebSocket");
      setSocket(null);
    });

    socketConnection.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsGenerating(false);
      setHasGeneratedReport(false); // Allows new try on error on reconnect
      setGenerationMessage("Erro de conexão");

      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });

      socketConnection.disconnect();
      setSocket(null);
    });

    setSocket(socketConnection);
  };

  // Generating state (WebSocket)
  if (isGenerating) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xl font-semibold">Gerando Relatório</span>
          </div>

          <div className="space-y-4">
            <Progress
              value={generationProgress}
              className="w-full bg-gray-400/30"
            />

            <div className="text-center">
              <p className="text-lg font-medium">{generationProgress}%</p>
              <p className="text-muted-foreground">{generationMessage}</p>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              Por favor, aguarde. Este processo pode demorar um pouco, estamos
              processando todas as submissões.
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // Error state (only shown if it is not generating and is not an expected error)
  if (error && !reportData && !shouldGenerate && !isGenerating) {
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

  // If there is no report data yet, do not process
  if (!reportData) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            Relatório não disponível
          </h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os dados do relatório.
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

  const handleExportPDF = () => {
    toast({
      title: "Exportando PDF",
      description: "O relatório será baixado em breve.",
    });
  };

  // const handleShare = () => {
  //   toast({
  //     title: "Link Copiado",
  //     description:
  //       "O link do relatório foi copiado para a área de transferência.",
  //   });
  // };

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
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="53%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius="60%"
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
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
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
                          <Badge className={severity}>{severityLabel}</Badge>
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
    </div>
  );
}
