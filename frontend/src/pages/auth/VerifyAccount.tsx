import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  verifyAccountSchema,
  type VerifyAccountFormData,
} from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerifyAccount = () => {
  const [resending, setResending] = useState(false);
  const { verifyAccount, resendVerificationCode, logout } = useAuth();
  const navigate = useNavigate();

  const form = useForm<VerifyAccountFormData>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  const onSubmit = async (data: VerifyAccountFormData) => {
    try {
      await verifyAccount(data.confirmationCode);
      toast({
        title: "Conta verificada!",
        description: "Sua conta foi ativada com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Código inválido",
        description: "Verifique o código e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await resendVerificationCode();
      toast({
        title: "Código reenviado",
        description: "Um novo código foi enviado para seu email.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o código. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verificar Conta
          </CardTitle>
          <CardDescription>
            Enviamos um código de verificação para seu email. Digite o código
            abaixo para ativar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="confirmationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de 9 dígitos</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Abc578"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        className="text-center text-2xl tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar e Ativar Conta"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {resending ? "Reenviando..." : "Reenviar código"}
            </button>

            <div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sair e voltar ao login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;
