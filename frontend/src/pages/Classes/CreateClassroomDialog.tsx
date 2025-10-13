import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateClassroom } from "@/hooks/use-classroom";
import { toast } from "@/hooks/use-toast";
import {
  createClassroomFormSchema,
  type CreateClassroomFormData,
} from "@/schemas/classroom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { ClassroomForm } from "./ClassroomForm";

export const CreateClassroomDialog = ({ open, onOpenChange }) => {
  const createMutation = useCreateClassroom();

  const form = useForm<CreateClassroomFormData>({
    resolver: zodResolver(createClassroomFormSchema),
    defaultValues: { name: "" },
  });

  const handleCreate = async (data: CreateClassroomFormData) => {
    const requestData = {
      name: data.name,
    };
    
    await createMutation.mutateAsync(requestData, {
      onSuccess: () => {
        toast({
          title: "Turma criada!",
          description: `A turma "${data.name}" foi criada.`,
        });
        form.reset();
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao criar a turma.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Turma</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova turma.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Criar Turma
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
