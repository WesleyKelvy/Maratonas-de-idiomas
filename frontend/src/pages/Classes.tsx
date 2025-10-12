import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useClassrooms,
  useCreateClassroom,
  useDeleteClassroom,
  useUpdateClassroom,
} from "@/hooks/use-classroom";
import { toast } from "@/hooks/use-toast";
import {
  createClassroomFormSchema,
  updateClassroomFormSchema,
  type CreateClassroomFormData,
  type UpdateClassroomFormData,
} from "@/schemas/classroom.schema";
import type {
  Classroom,
  ClassroomWithMarathonIds,
} from "@/services/classroom.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Eye, Loader2, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Classes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classroomToDelete, setClassroomToDelete] =
    useState<ClassroomWithMarathonIds | null>(null);
  const [classroomToEdit, setClassroomToEdit] =
    useState<ClassroomWithMarathonIds | null>(null);

  // API hooks
  const { data: classrooms = [], isLoading, error, refetch } = useClassrooms();
  const createMutation = useCreateClassroom();
  const deleteMutation = useDeleteClassroom();
  const updateMutation = useUpdateClassroom();

  // Form hooks
  const createForm = useForm<CreateClassroomFormData>({
    resolver: zodResolver(createClassroomFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const editForm = useForm<UpdateClassroomFormData>({
    resolver: zodResolver(updateClassroomFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const getMarathonCount = (classroom: any) => {
    return classroom.marathons ? classroom.marathons.length : 0;
  };

  const filteredClasses = classrooms.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClass = async (data: CreateClassroomFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        // invite_expiration: new Date(data.invite_expiration).toISOString(),
      });

      toast({
        title: "Turma criada!",
        description: `A turma "${data.name}" foi criada com sucesso.`,
      });

      createForm.reset();
      setShowCreateModal(false);
    } catch (error) {
      toast({
        title: "Erro ao criar turma",
        description: "Ocorreu um erro ao criar a turma. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditClass = (classroom: ClassroomWithMarathonIds) => {
    setClassroomToEdit(classroom);
    editForm.reset({
      name: classroom.name,
    });
    setShowEditModal(true);
  };

  const handleUpdateClass = async (data: UpdateClassroomFormData) => {
    if (!classroomToEdit) return;

    try {
      await updateMutation.mutateAsync({
        id: classroomToEdit.id,
        data: {
          name: data.name,
        },
      });

      toast({
        title: "Turma atualizada!",
        description: `A turma "${data.name}" foi atualizada com sucesso.`,
      });

      editForm.reset();
      setShowEditModal(false);
      setClassroomToEdit(null);
    } catch (error) {
      toast({
        title: "Erro ao atualizar turma",
        description: "Ocorreu um erro ao atualizar a turma. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleOpenDeleteDialog = (classroom: ClassroomWithMarathonIds) => {
    setClassroomToDelete(classroom);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!classroomToDelete) return;

    try {
      await deleteMutation.mutateAsync(classroomToDelete.id);
      toast({
        title: "Turma excluída",
        description: `A turma "${classroomToDelete.name}" foi excluída com sucesso.`,
      });
      setShowDeleteDialog(false);
      setClassroomToDelete(null);
    } catch (error: any) {
      console.error("Delete error:", error);

      // Verificar se é o erro específico de turma com maratonas
      const errorMessage =
        error?.response?.data?.message || error?.message || "";

      let description = "Ocorreu um erro ao excluir a turma. Tente novamente.";

      if (
        errorMessage.includes(
          "Not allowed to delete a classroom with marathons"
        ) ||
        errorMessage.includes("marathons")
      ) {
        description = "Não é possível excluir turmas com maratonas associadas.";
      }

      toast({
        title: "Erro ao excluir turma",
        description,
        variant: "destructive",
      });
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    createForm.reset();
  };

  const handleOpenChangeCreateModal = (open: boolean) => {
    if (open) {
      setShowCreateModal(true);
    } else {
      handleCloseCreateModal();
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setClassroomToEdit(null);
    editForm.reset();
  };

  const handleOpenChangeEditModal = (open: boolean) => {
    if (open) {
      setShowEditModal(true);
    } else {
      handleCloseEditModal();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas turmas</p>
        </div>
        <Dialog
          open={showCreateModal}
          onOpenChange={handleOpenChangeCreateModal}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Turma</DialogTitle>
              <DialogDescription>
                Preencha as informações da nova turma
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleCreateClass)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Turma</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: JavaScript Avançado - 2024.1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome identificador da turma (3-100 caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseCreateModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar Turma"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
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

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando turmas...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <p>Erro ao carregar turmas</p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Classes List */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[65dvh] rounded-lg">
          {filteredClasses.map((classItem) => (
            <Card
              key={classItem.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <div className="flex gap-2"></div>
                  </div>
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600 text-sm col-span-2">
                    {getMarathonCount(classItem)} maratonas vinculadas
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/classes/${classItem.id}`)}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClass(classItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDeleteDialog(classItem)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar o termo de busca."
                : "Comece criando sua primeira turma."}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Turma
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Classroom Dialog */}
      <Dialog open={showEditModal} onOpenChange={handleOpenChangeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>
              Atualize as informações da turma
            </DialogDescription>
          </DialogHeader>
          {classroomToEdit && (
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit((data) => {
                  handleUpdateClass(data);
                })}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Turma</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: JavaScript Avançado - 2024.1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome identificador da turma (3-100 caracteres)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseEditModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      updateMutation.isPending || !editForm.formState.isValid
                    }
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma "{classroomToDelete?.name}
              "?
              <br />
              Esta ação não pode ser desfeita e removerá todas as maratonas
              associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setClassroomToDelete(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir Turma"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Classes;
