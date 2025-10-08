import React from "react";
import RoleBasedRoute from "./RoleBasedRoute";

interface TeacherRouteProps {
  children: React.ReactNode;
}

export const TeacherRoute: React.FC<TeacherRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["teacher", "professor", "admin"]}>
    {children}
  </RoleBasedRoute>
);

interface StudentRouteProps {
  children: React.ReactNode;
}

export const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["student"]}>{children}</RoleBasedRoute>
);

interface CommonRouteProps {
  children: React.ReactNode;
}

export const CommonRoute: React.FC<CommonRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["teacher", "professor", "student", "admin"]}>
    {children}
  </RoleBasedRoute>
);
