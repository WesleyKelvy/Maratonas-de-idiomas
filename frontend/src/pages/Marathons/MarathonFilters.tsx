import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export const MarathonFilters = ({ classrooms, filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    onFilterChange("searchTerm", debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar maratonas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.selectedClassroomId || "all"}
            onValueChange={(value) =>
              onFilterChange(
                "selectedClassroomId",
                value === "all" ? "" : value
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              {classrooms.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.statusFilter}
            onValueChange={(value) => onFilterChange("statusFilter", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Aberta">Aberta</SelectItem>
              <SelectItem value="Finalizada">Finalizada</SelectItem>
              <SelectItem value="Aguardando início">
                Aguardando início
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.difficultyFilter}
            onValueChange={(value) => onFilterChange("difficultyFilter", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as dificuldades</SelectItem>
              <SelectItem value="Iniciante">Iniciante</SelectItem>
              <SelectItem value="Intermediário">Intermediário</SelectItem>
              <SelectItem value="Avançado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
