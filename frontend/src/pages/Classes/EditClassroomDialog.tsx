import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useUpdateClassroom } from "@/hooks/use-classroom";
import { toast } from "@/hooks/use-toast";
import {
  updateClassroomFormSchema,
  type UpdateClassroomFormData,
} from "@/schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClassroomForm } from "./ClassroomForm";

export const EditClassroomDialog = ({ open, onOpenChange, classroom }) => {
  const updateMutation = useUpdateClassroom();

  const form = useForm<UpdateClassroomFormData>({
    resolver: zodResolver(updateClassroomFormSchema),
  });

  useEffect(() => {
    if (classroom) {
      form.reset({ name: classroom.name });
    }
  }, [classroom, form]);

  if (!classroom) return null;

  const handleUpdate = async (data: UpdateClassroomFormData) => {
    await updateMutation.mutateAsync(
      { id: classroom.id, data },
      {
        onSuccess: () => {
          toast({
            title: "Turma atualizada!",
            description: `A turma foi atualizada para "${data.name}".`,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Ocorreu um erro ao atualizar a turma.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Turma</DialogTitle>
          <DialogDescription>
            Atualize as informações da turma.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <ClassroomForm form={form} />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
