import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"Student" | "Professor" | "Admin">;
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = "/dashboard",
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Normalizar roles para comparação case-insensitive
  const normalizedUserRole = user?.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  if (!user || !normalizedAllowedRoles.includes(normalizedUserRole as any)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
