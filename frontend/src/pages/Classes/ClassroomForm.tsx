import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const ClassroomForm = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome da Turma</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Turma 6 ano Azul - 2025.1" {...field} />
          </FormControl>
          <FormDescription>
            Nome identificador da turma (3-100 caracteres).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
