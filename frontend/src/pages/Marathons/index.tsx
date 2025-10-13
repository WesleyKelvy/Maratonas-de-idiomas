import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useClassrooms } from "@/hooks/use-classroom";
import { useMarathons, useUserMarathons } from "@/hooks/use-marathon";
import { getDifficultyDisplay, getMarathonStatus } from "@/utils/marathonUtils";
import { BookText, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateMarathonDialog } from "./CreateMarathonDialog";
import { MarathonCard } from "./MarathonCard";
import { MarathonFilters } from "./MarathonFilters";

const Marathons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("search") || "",
    statusFilter: searchParams.get("status") || "all",
    difficultyFilter: searchParams.get("difficulty") || "all",
    selectedClassroomId: searchParams.get("classroom") || "",
  });
  const [dialogOpen, setDialogOpen] = useState(
    searchParams.get("create") === "true"
  );

  // Data Fetching
  const { data: classrooms = [], isLoading: loadingClassrooms } =
    useClassrooms();
  const {
    data: classroomMarathons = [],
    isLoading: loadingClassroomMarathons,
  } = useMarathons(filters.selectedClassroomId || "skip");
  const { data: userMarathons = [], isLoading: loadingUserMarathons } =
    useUserMarathons();

  // Derived State
  const marathons = filters.selectedClassroomId
    ? classroomMarathons
    : userMarathons;
  const isLoading =
    loadingClassrooms ||
    (filters.selectedClassroomId
      ? loadingClassroomMarathons
      : loadingUserMarathons);

  // Otimização: Memoize a filtragem
  const filteredMarathons = useMemo(() => {
    return marathons.filter((marathon) => {
      const marathonStatus = getMarathonStatus(marathon);
      const marathonDifficultyDisplay = getDifficultyDisplay(
        marathon.difficulty
      );

      const matchesSearch =
        filters.searchTerm === "" ||
        marathon.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStatus =
        filters.statusFilter === "all" ||
        marathonStatus === filters.statusFilter;
      const matchesDifficulty =
        filters.difficultyFilter === "all" ||
        marathonDifficultyDisplay === filters.difficultyFilter;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [marathons, filters]);

  // Sincroniza a URL com o estado do filtro
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (filters.searchTerm) newSearchParams.set("search", filters.searchTerm);
    if (filters.statusFilter !== "all")
      newSearchParams.set("status", filters.statusFilter);
    if (filters.difficultyFilter !== "all")
      newSearchParams.set("difficulty", filters.difficultyFilter);
    if (filters.selectedClassroomId)
      newSearchParams.set("classroom", filters.selectedClassroomId);
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  // Otimização: Handler para todos os filtros
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  }, []);

  return (
    <div className="space-y-6 h-full w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maratonas</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "Professor"
              ? "Visualize todas as suas maratonas criadas"
              : "Explore maratonas disponíveis"}
          </p>
        </div>
        {user?.role === "Professor" && (
          <>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Maratona
            </Button>
            <CreateMarathonDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              classrooms={classrooms}
            />
          </>
        )}
        {user?.role === "Student" && (
          <Button onClick={() => navigate("/marathon-enrollment")}>
            <Plus className="mr-2 h-4 w-4" />
            Inscrever em Maratona
          </Button>
        )}
      </div>

      <MarathonFilters
        classrooms={classrooms}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando maratonas...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {filteredMarathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto h-[65dvh] rounded-lg">
              {filteredMarathons.map((marathon) => (
                <MarathonCard
                  key={marathon.id}
                  marathon={marathon}
                  classrooms={classrooms}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BookText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma maratona encontrada
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros para encontrar maratonas.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Marathons;
