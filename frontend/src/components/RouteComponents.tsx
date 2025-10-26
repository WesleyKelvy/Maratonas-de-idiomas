import React from "react";
import RoleBasedRoute from "./RoleBasedRoute";

interface TeacherRouteProps {
  children: React.ReactNode;
}

export const TeacherRoute: React.FC<TeacherRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
    {children}
  </RoleBasedRoute>
);

interface StudentRouteProps {
  children: React.ReactNode;
}

export const StudentRoute: React.FC<StudentRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["Student"]}>{children}</RoleBasedRoute>
);

interface CommonRouteProps {
  children: React.ReactNode;
}

export const CommonRoute: React.FC<CommonRouteProps> = ({ children }) => (
  <RoleBasedRoute allowedRoles={["Professor", "Student", "Admin"]}>
    {children}
  </RoleBasedRoute>
);
