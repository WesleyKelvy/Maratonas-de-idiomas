import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { Loader2 } from "lucide-react";
import { useLogin, useCurrentUser } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { refetch: refetchUser } = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Garantir que os dados estão no formato correto
      const loginData = {
        email: data.email!,
        password: data.password!,
      };

      // console.log("Attempting login with:", loginData);

      await loginMutation.mutateAsync(loginData);

      // console.log("Login successful, fetching user data...");

      // Buscar dados do usuário após login bem-sucedido
      const { data: userData } = await refetchUser();

      // console.log("User data fetched:", userData);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo(a) de volta.",
      });

      // Aguardar um pouco antes de navegar para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      // console.error("Login error:", error);
      let errorMessage = "Email ou senha inválidos.";

      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            EduMarathon
          </CardTitle>
          <CardDescription>
            Entre na sua conta para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link
              to="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-800 block"
            >
              Esqueci minha senha
            </Link>
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-800 block"
            >
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
