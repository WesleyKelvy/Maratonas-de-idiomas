import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMarathon } from "@/hooks/use-marathon";
import {
  CreateMarathonFormData,
  createMarathonFormSchema,
} from "@/schemas/marathon.schema";
import {
  DIFFICULTY_DISPLAY,
  DIFFICULTY_LEVELS,
  formatDateTimeLocal,
  parseLocalDateTime,
} from "@/utils/marathonUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const CreateMarathonDialog = ({ open, onOpenChange, classrooms }) => {
  const navigate = useNavigate();
  const createMarathonMutation = useCreateMarathon();
  const { isPending: isCreating } = createMarathonMutation;

  const form = useForm<CreateMarathonFormData>({
    resolver: zodResolver(createMarathonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      context: "",
      difficulty: "",
      timeLimit: "",
      startDate: "",
      endDate: "",
      number_of_questions: "1",
      classroom_id: "",
    },
  });

  const startDate = form.watch("startDate");
  const timeLimit = form.watch("timeLimit");
  const isTimeLimitFilled = timeLimit && timeLimit.trim() !== "";

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    return formatDateTimeLocal(now);
  }, []);

  const minEndDateTime = useMemo(() => {
    const minTimeFromNow = new Date();
    minTimeFromNow.setMinutes(minTimeFromNow.getMinutes() + 10);
    if (!startDate || !startDate.trim())
      return formatDateTimeLocal(minTimeFromNow);
    const startDateObj = new Date(startDate);
    const laterDate =
      startDateObj > minTimeFromNow ? startDateObj : minTimeFromNow;
    return formatDateTimeLocal(laterDate);
  }, [startDate]);

  useEffect(() => {
    const currentEndDate = form.getValues("endDate");
    if (startDate && currentEndDate) {
      if (parseLocalDateTime(currentEndDate) <= parseLocalDateTime(startDate)) {
        form.setValue("endDate", "");
      }
    }
  }, [startDate, form]);

  const onSubmit = async (values: CreateMarathonFormData) => {
    try {
      const marathonData = {
        title: values.title,
        description: values.description || null,
        context: values.context || null,
        difficulty: values.difficulty as
          | "Beginner"
          | "Intermediate"
          | "Advanced",
        number_of_questions: parseInt(values.number_of_questions),
        startDate: values.startDate
          ? parseLocalDateTime(values.startDate)
          : null,
        endDate: values.endDate ? parseLocalDateTime(values.endDate) : null,
        timeLimit: values.timeLimit ? parseInt(values.timeLimit) : null,
      };
      const newMarathon = await createMarathonMutation.mutateAsync({
        classroomId: values.classroom_id,
        data: marathonData,
      });
      onOpenChange(false);
      form.reset();
      navigate(`question-management/${newMarathon.id}`);
    } catch (error) {
      console.error("Error creating marathon:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar nova Maratona</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova maratona.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Maratona de JavaScript"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classroom_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma turma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descrição da maratona (opcional)"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contexto *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Contexto técnico da maratona, tecnologias abordadas..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dificuldade *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DIFFICULTY_LEVELS.BEGINNER}>
                          {DIFFICULTY_DISPLAY[DIFFICULTY_LEVELS.BEGINNER]}
                        </SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.INTERMEDIATE}>
                          {DIFFICULTY_DISPLAY[DIFFICULTY_LEVELS.INTERMEDIATE]}
                        </SelectItem>
                        <SelectItem value={DIFFICULTY_LEVELS.ADVANCED}>
                          {DIFFICULTY_DISPLAY[DIFFICULTY_LEVELS.ADVANCED]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Limite (min) *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="120"
                        min="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number_of_questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Questões *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="10"
                        min="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        min={minDateTime}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Deve ser pelo menos 10 minutos no futuro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        disabled={isTimeLimitFilled}
                        min={minEndDateTime}
                      />
                    </FormControl>
                    {isTimeLimitFilled ? (
                      <FormDescription className="text-xs text-gray-500">
                        Campo bloqueado pois tempo limite está definido.
                      </FormDescription>
                    ) : (
                      <FormDescription className="text-xs text-gray-500">
                        Deve ser posterior à data de início
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreating ? "Criando..." : "Criar Maratona"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
