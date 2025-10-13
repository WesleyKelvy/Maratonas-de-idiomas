import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useClassrooms, useDeleteClassroom } from "@/hooks/use-classroom";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ClassroomCard } from "./ClassroomCard";
import { CreateClassroomDialog } from "./CreateClassroomDialog";
import { EditClassroomDialog } from "./EditClassroomDialog";
import { DeleteClassroomAlert } from "./DeleteClassroomAlert";

const INITIAL_MODAL_STATE = { action: "none", classroom: null };

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(INITIAL_MODAL_STATE);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // API hooks
  const { data: classrooms = [], isLoading, error, refetch } = useClassrooms();
  const deleteMutation = useDeleteClassroom();

  const filteredClasses = useMemo(
    () =>
      classrooms.filter((c) =>
        c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ),
    [classrooms, debouncedSearchTerm]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (modal.action !== "delete" || !modal.classroom) return;

    await deleteMutation.mutateAsync(modal.classroom.id, {
      onSuccess: () => {
        toast({
          title: "Turma excluída",
          description: `A turma "${modal.classroom.name}" foi excluída.`,
        });
        setModal(INITIAL_MODAL_STATE);
      },
      onError: (err: any) => {
        const message = err.response?.data?.message.includes("marathons")
          ? "Não é possível excluir turmas com maratonas associadas."
          : "Ocorreu um erro ao excluir a turma.";
        toast({
          title: "Erro ao excluir",
          description: message,
          variant: "destructive",
        });
      },
    });
  }, [modal, deleteMutation]);

  const closeModal = () => setModal(INITIAL_MODAL_STATE);

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-500 mb-4">Erro ao carregar turmas</p>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas turmas</p>
        </div>
        <Button onClick={() => setModal({ action: "create", classroom: null })}>
          <Plus className="mr-2 h-4 w-4" /> Criar Turma
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              onEdit={() => setModal({ action: "edit", classroom })}
              onDelete={() => setModal({ action: "delete", classroom })}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Nenhuma turma encontrada</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar o termo de busca."
                : "Comece criando sua primeira turma."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modals & Dialogs */}
      <CreateClassroomDialog
        open={modal.action === "create"}
        onOpenChange={closeModal}
      />
      <EditClassroomDialog
        open={modal.action === "edit"}
        onOpenChange={closeModal}
        classroom={modal.classroom}
      />
      <DeleteClassroomAlert
        open={modal.action === "delete"}
        onOpenChange={closeModal}
        classroom={modal.classroom}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default Classes;
