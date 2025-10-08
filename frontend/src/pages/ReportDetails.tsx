import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  Download,
  Loader2,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useReport, useCreateReport } from "@/hooks/use-report";
import { useMarathon } from "@/hooks/use-marathon";

const ReportDetails = () => {
  const { marathonId } = useParams<{ marathonId: string }>();
  const navigate = useNavigate();

  const {
    data: report,
    isLoading: loadingReport,
    error: reportError,
  } = useReport(marathonId!);
  const { data: marathon, isLoading: loadingMarathon } = useMarathon(
    marathonId!
  );
  const createReportMutation = useCreateReport();

  const handleGoBack = () => {
    navigate("/reports");
  };

  const handleGenerateReport = async () => {
    if (marathonId) {
      try {
        await createReportMutation.mutateAsync(marathonId);
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
      }
    }
  };

  const handleDownloadReport = () => {
    console.log("Download do relatório");
  };

  if (loadingMarathon || loadingReport) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando relatório...</span>
        </div>
      </div>
    );
  }

  if (reportError && !report) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Relatórios
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Relatório não encontrado
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              Este relatório ainda não foi gerado. Clique no botão abaixo para
              gerar o relatório desta maratona.
            </p>
            <Button
              onClick={handleGenerateReport}
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Relatórios
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Relatório da Maratona
            </h1>
            {marathon && (
              <p className="text-gray-600 mt-2">
                {marathon.title} •{" "}
                {(() => {
                  try {
                    const startDate = new Date(marathon.start_date);
                    const endDate = marathon.end_date
                      ? new Date(marathon.end_date)
                      : null;

                    if (isNaN(startDate.getTime())) {
                      return "Data de início inválida";
                    }

                    const startDateStr = new Intl.DateTimeFormat(
                      "pt-BR"
                    ).format(startDate);

                    if (!endDate || isNaN(endDate.getTime())) {
                      return startDateStr + " - Em andamento";
                    }

                    return (
                      startDateStr +
                      " - " +
                      new Intl.DateTimeFormat("pt-BR").format(endDate)
                    );
                  } catch (error) {
                    return "Erro ao formatar datas";
                  }
                })()}
                {(() => {
                  const now = new Date();
                  const startDate = new Date(marathon.start_date);
                  const endDate = marathon.end_date
                    ? new Date(marathon.end_date)
                    : null;

                  const isActive =
                    now >= startDate && (!endDate || now <= endDate);

                  return (
                    isActive && (
                      <Badge variant="default" className="ml-2">
                        Ativa
                      </Badge>
                    )
                  );
                })()}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGenerateReport}
              disabled={createReportMutation.isPending}
            >
              {createReportMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Atualizar Relatório
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classroom</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.classroom_name}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Erros
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.total_errors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categorias
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.report_details?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {report.report_details && report.report_details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes dos Erros por Categoria</CardTitle>
                <CardDescription>
                  Análise detalhada dos erros encontrados na maratona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {report.report_details.map((detail) => (
                    <div key={detail.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {detail.category_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {detail.occurrences} ocorrência
                            {detail.occurrences !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Badge variant="secondary">{detail.occurrences}</Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-1">Exemplos:</h5>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {detail.examples}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-1">Recomendações:</h5>
                          <p className="text-sm text-gray-700">
                            {detail.targeted_advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ID do Relatório:
                  </span>
                  <span className="font-mono text-sm">{report.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da Maratona:</span>
                  <span className="font-mono text-sm">
                    {report.marathon_id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
