import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassrooms } from "@/hooks/use-classroom";
import { useMarathons } from "@/hooks/use-marathon";
import { useReport } from "@/hooks/use-report";
import type { LanguageMarathon } from "@/services/marathon.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [selectedMarathonId, setSelectedMarathonId] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Buscar classrooms do professor
  const {
    data: classrooms,
    isLoading: loadingClassrooms,
    error: classroomError,
  } = useClassrooms();

  // Buscar maratonas da classroom selecionada
  const {
    data: marathons,
    isLoading: loadingMarathons,
    error: marathonError,
  } = useMarathons(selectedClassroomId);

  // Buscar relatório da maratona selecionada (opcional, só para preview)
  const {
    data: report,
    isLoading: loadingReport,
    error: reportError,
  } = useReport(selectedMarathonId);

  // // Atualizar o tempo a cada minuto para mostrar countdown
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 60000); // Atualiza a cada minuto

  //   return () => clearInterval(interval);
  // }, []);

  const handleClassroomChange = (value: string) => {
    setSelectedClassroomId(value);
    setSelectedMarathonId(""); // Reset marathon selection
  };

  const handleMarathonChange = (value: string) => {
    setSelectedMarathonId(value);
  };

  const handleViewReport = () => {
    if (selectedMarathonId) {
      // Se há erro de relatório (não encontrado) e maratona finalizada, navega com flag de geração
      if (
        reportError &&
        selectedMarathon &&
        isMarathonFinished(selectedMarathon)
      ) {
        navigate(
          `/reports/marathon/${selectedMarathonId}/details?generate=true`
        );
      } else {
        // Caso normal, apenas visualiza o relatório existente
        navigate(`/reports/marathon/${selectedMarathonId}/details`);
      }
    }
  };

  const selectedClassroom = classrooms?.find(
    (c) => c.id === selectedClassroomId
  );
  const selectedMarathon = marathons?.find((m) => m.id === selectedMarathonId);

  // Helper function to check if marathon is finished
  const isMarathonFinished = (marathon: LanguageMarathon) => {
    if (!marathon?.end_date) return false;
    const endDate = new Date(marathon.end_date);
    return currentTime > endDate;
  };

  // // Helper function to get time remaining for marathon
  // const getTimeRemaining = (marathon: LanguageMarathon) => {
  //   if (!marathon?.end_date) return null;

  //   const endDate = new Date(marathon.end_date);
  //   const diffInMs = endDate.getTime() - currentTime.getTime();

  //   if (diffInMs <= 0) return null; // Marathon already finished

  //   const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   const diffInDays = Math.floor(diffInHours / 24);

  //   if (diffInDays > 0) {
  //     return `${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
  //   } else if (diffInHours > 0) {
  //     return `${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
  //   } else if (diffInMinutes > 0) {
  //     return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
  //   } else {
  //     return "menos de 1 minuto";
  //   }
  // };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios de Maratonas
        </h1>
        <p className="text-gray-600">
          Selecione uma classroom e uma maratona para visualizar o relatório
          detalhado
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Classroom selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Selecionar Classroom
            </CardTitle>
            <CardDescription>
              Escolha uma classroom para ver suas maratonas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="classroom-select">Classroom</Label>
              {loadingClassrooms ? (
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Carregando classrooms...
                  </span>
                </div>
              ) : classroomError ? (
                <div className="p-3 border rounded-md bg-red-50 text-red-700">
                  Erro ao carregar classrooms: {classroomError.message}
                </div>
              ) : (
                <Select
                  value={selectedClassroomId}
                  onValueChange={handleClassroomChange}
                >
                  <SelectTrigger id="classroom-select">
                    <SelectValue placeholder="Selecione uma classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms?.map((classroom) => (
                      // console.log("classroom: ", classroom),
                      <SelectItem key={classroom.id} value={classroom.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{classroom.name}</span>
                          {/* {classroom.description && (
                            <span className="text-sm text-muted-foreground">
                              {classroom.description}
                            </span>
                          )} */}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Marathon selector */}
        {selectedClassroomId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Selecionar Maratona
              </CardTitle>
              <CardDescription>
                {selectedClassroom &&
                  `Maratonas da classroom "${selectedClassroom.name}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="marathon-select">Maratona</Label>
                {loadingMarathons ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Carregando maratonas...
                    </span>
                  </div>
                ) : marathonError ? (
                  <div className="p-3 border rounded-md bg-red-50 text-red-700">
                    Erro ao carregar maratonas: {marathonError.message}
                  </div>
                ) : marathons?.length === 0 ? (
                  <div className="p-3 border rounded-md bg-yellow-50 text-yellow-700">
                    Nenhuma maratona encontrada para esta classroom.
                  </div>
                ) : (
                  <Select
                    value={selectedMarathonId}
                    onValueChange={handleMarathonChange}
                  >
                    <SelectTrigger className="h-18" id="marathon-select">
                      <SelectValue placeholder="Selecione uma maratona" />
                    </SelectTrigger>
                    <SelectContent>
                      {marathons?.map((marathon) => (
                        <SelectItem key={marathon.id} value={marathon.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {marathon.title}
                            </span>
                            <div className="text-sm text-muted-foreground">
                              {(() => {
                                try {
                                  const startDate = new Date(
                                    marathon.start_date
                                  );
                                  const endDate = marathon.end_date
                                    ? new Date(marathon.end_date)
                                    : null;

                                  if (isNaN(startDate.getTime())) {
                                    return "Data de início inválida";
                                  }

                                  const startDateStr = format(
                                    startDate,
                                    "dd/MM/yyyy",
                                    {
                                      locale: ptBR,
                                    }
                                  );

                                  if (!endDate || isNaN(endDate.getTime())) {
                                    return startDateStr + " - Em andamento";
                                  }

                                  return (
                                    <>
                                      {startDateStr} -{" "}
                                      {format(endDate, "dd/MM/yyyy", {
                                        locale: ptBR,
                                      })}
                                    </>
                                  );
                                } catch (error) {
                                  return "Erro ao formatar datas";
                                }
                              })()}
                              {(() => {
                                const startDate = new Date(marathon.start_date);
                                const endDate = marathon.end_date
                                  ? new Date(marathon.end_date)
                                  : null;

                                const isActive =
                                  currentTime >= startDate &&
                                  (!endDate || currentTime <= endDate);

                                return isActive ? (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Em andamento
                                  </span>
                                ) : (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Finalizada
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview and Button to see the report */}
        {selectedMarathonId && (
          <Card>
            <CardHeader>
              <CardTitle>Relatório</CardTitle>
              <CardDescription>
                {selectedMarathon &&
                  `Relatório da maratona "${selectedMarathon.title}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingReport ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Carregando informações do relatório...
                    </span>
                  </div>
                ) : selectedMarathon &&
                  !isMarathonFinished(selectedMarathon) ? (
                  <>
                    <div className="p-3 border rounded-md bg-blue-50 text-blue-700">
                      <div className="space-y-2">
                        <span className="font-medium">
                          Por favor, aguarde a finalização da maratona.
                        </span>
                      </div>
                    </div>
                    <Button className="w-full" disabled={true}>
                      <FileText className="h-4 w-4 mr-2" />
                      Aguarde o término da maratona
                    </Button>
                  </>
                ) : reportError ? (
                  <>
                    <div className="p-3 border rounded-md bg-yellow-50 text-yellow-700">
                      <span>
                        Esta maratona não possui relatório ainda. Clique no
                        botão abaixo para gerar.
                      </span>
                    </div>
                    <Button
                      onClick={handleViewReport}
                      className="w-full"
                      disabled={!selectedMarathonId}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Relatório
                    </Button>
                  </>
                ) : report ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-semibold mb-2">
                        Informações do Relatório
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Classroom:
                          </span>
                          <span className="ml-2 font-medium">
                            {report.classroom_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Total de Erros:
                          </span>
                          <span className="ml-2 font-medium">
                            {report.total_errors}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Data do Relatório:
                          </span>
                          <span className="ml-2 font-medium text-xs ">
                            {format(new Date(report.created_at), "dd/MM/yy")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Categorias:
                          </span>
                          <span className="ml-2 font-medium">
                            {report.report_details?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleViewReport}
                      className="w-full"
                      disabled={!selectedMarathonId}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Relatório Completo
                    </Button>
                  </div>
                ) : (
                  /* Caso fallback */
                  <div className="p-3 border rounded-md bg-red-50 text-red-700">
                    <span>Erro ao carregar informações da maratona.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
