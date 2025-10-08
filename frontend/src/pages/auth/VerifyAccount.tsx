import React, { useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyAccountSchema,
  type VerifyAccountFormData,
} from "@/schemas/authSchemas";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
  const [resending, setResending] = useState(false);
  const { verifyAccount } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<VerifyAccountFormData>({
    resolver: zodResolver(verifyAccountSchema),
  });

  const watchedCode = watch("code");

  const onSubmit = async (data: VerifyAccountFormData) => {
    try {
      await verifyAccount(data.code);
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Código reenviado",
      description: "Um novo código foi enviado para seu email.",
    });
    setResending(false);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de 6 dígitos</Label>
              <Input
                id="code"
                placeholder="123456"
                maxLength={6}
                {...register("code", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
                className="text-center text-lg tracking-widest"
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting || !watchedCode || watchedCode.length !== 6
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar e Ativar Conta"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {resending ? "Reenviando..." : "Reenviar código"}
            </button>

            <div>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAccount;
