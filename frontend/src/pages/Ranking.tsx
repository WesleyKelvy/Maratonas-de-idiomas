import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, Crown, Medal, Trophy, Users, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMarathonIdsAndTitles } from "@/hooks/use-marathon";
import { useLeaderboard } from "@/hooks/use-leaderboard";

const Ranking = () => {
  const { user } = useAuth();
  const [selectedMarathon, setSelectedMarathon] = useState("");

  // Fetch user's marathons
  const { data: userMarathons = [], isLoading: marathonsLoading } =
    useMarathonIdsAndTitles();

  // Fetch leaderboard for selected marathon
  const { data: leaderboardData = [], isLoading: leaderboardLoading } =
    useLeaderboard(selectedMarathon);

  // Create marathons list with "all" option
  const marathons = useMemo(
    () => [
      { id: "all", name: "Todas as Maratonas" },
      ...userMarathons.map((m) => ({ id: m.id, name: m.title })),
    ],
    [userMarathons]
  );

  // Transform leaderboard data for UI
  const rankings = useMemo(() => {
    if (selectedMarathon === "all" || leaderboardData.length === 0) {
      return [];
    }

    // Sort by score (descending) and add position
    const sortedData = [...leaderboardData]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        position: index + 1,
        name: entry.user.name,
        email: entry.user.email,
        score: entry.score,
        marathonsCompleted: 1, // For now, we only have data for the selected marathon
        averageScore: entry.score / 10, // Assuming score is out of 100, so average out of 10
        isCurrentUser: entry.user.id === user?.id,
        completionTime: entry.completion_time,
      }));

    return sortedData;
  }, [leaderboardData, selectedMarathon, user?.id]);

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
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const topThree = rankings.slice(0, 3);
  const currentUserRank = rankings.find((rank) => rank.isCurrentUser);

  // Loading state
  if (marathonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando maratonas...</span>
      </div>
    );
  }

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
            <Select
              value={selectedMarathon}
              onValueChange={setSelectedMarathon}
              disabled={marathonsLoading}
            >
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={
                    marathonsLoading
                      ? "Carregando..."
                      : "Selecione uma maratona"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {marathons.map((marathon) => (
                  <SelectItem key={marathon.id} value={marathon.id.toString()}>
                    {marathon.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {leaderboardLoading && selectedMarathon !== "all" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          {userMarathons.length === 0 && !marathonsLoading && (
            <p className="text-sm text-gray-500 mt-2">
              Você ainda não participou de nenhuma maratona.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Show message for general ranking or empty state */}
      {selectedMarathon === "all" ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ranking de Maratonas
            </h3>
            <p className="text-gray-600">
              Selecione uma maratona específica para ver o ranking dos
              participantes.
            </p>
          </CardContent>
        </Card>
      ) : rankings.length === 0 && !leaderboardLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum Resultado Encontrado
            </h3>
            <p className="text-gray-600">
              Ainda não há participantes nesta maratona ou o leaderboard não foi
              gerado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
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
                    <Card
                      key={rank.position}
                      className={`text-center ${
                        rank.position === 1 ? "ring-2 ring-yellow-500" : ""
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex justify-center mb-4">
                          {getPositionIcon(rank.position)}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">{rank.name}</h3>
                          <Badge
                            className={getPositionBadgeColor(rank.position)}
                          >
                            {rank.position}º Lugar
                          </Badge>
                          <div className="text-2xl font-bold text-blue-600">
                            {rank.score.toLocaleString()} pts
                          </div>
                          <div className="text-sm text-gray-600">
                            Tempo: {Math.round(rank.completionTime / 60)}min
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

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
                  <span className="font-bold text-lg">
                    {currentUserRank.position}º
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{currentUserRank.name}</div>
                  <div className="text-sm text-gray-600">
                    Tempo: {Math.round(currentUserRank.completionTime / 60)}min
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {currentUserRank.score.toLocaleString()} pts
                </div>
                <div className="text-sm text-gray-600">Pontuação final</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Ranking Table */}
      {rankings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ranking Completo
            </CardTitle>
            <CardDescription>
              Classificação de todos os participantes desta maratona
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando ranking...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Posição</TableHead>
                      <TableHead>Participante</TableHead>
                      <TableHead>Pontuação</TableHead>
                      {/* <TableHead>Tempo</TableHead>
                      <TableHead>Status</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((rank) => (
                      <TableRow
                        key={rank.position}
                        className={
                          rank.isCurrentUser ? "bg-blue-50 border-blue-200" : ""
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPositionIcon(rank.position)}
                            <span className="font-bold">{rank.position}º</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div
                              className={`font-semibold ${
                                rank.isCurrentUser ? "text-blue-700" : ""
                              }`}
                            >
                              {rank.name}
                              {rank.isCurrentUser && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800">
                                  Você
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {rank.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-lg">
                            {rank.score.toLocaleString()}
                          </span>
                          <span className="text-gray-500 ml-1">pts</span>
                        </TableCell>
                        {/* <TableCell>
                          <div className="text-center">
                            <div className="font-semibold">
                              {Math.round(rank.completionTime / 60)}min
                            </div>
                            <div className="text-xs text-gray-500">
                              {rank.completionTime % 60}s
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Concluído
                          </Badge>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ranking;
