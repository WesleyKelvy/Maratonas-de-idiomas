import React from "react";
import { useCurrentUser, useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const AuthTest: React.FC = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();

  const handleTestLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: "test@example.com",
        password: "Test123!@#",
      });
      toast({
        title: "Login successful!",
        description: "Connected to backend successfully.",
      });
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Check console for details.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    console.error("Current user error:", error);
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Auth Test Component</h3>

      <div>
        <strong>Current User:</strong>
        {user ? (
          <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <span className="text-gray-500 ml-2">Not authenticated</span>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <Button
        onClick={handleTestLogin}
        disabled={loginMutation.isPending}
        className="w-full"
      >
        {loginMutation.isPending ? "Logging in..." : "Test Login"}
      </Button>

      {loginMutation.error && (
        <div className="text-red-600 text-sm">
          <strong>Login Error:</strong> {loginMutation.error.message}
        </div>
      )}
    </div>
  );
};
