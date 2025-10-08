import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="max-h-dvh flex w-full bg-gray-100">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-x-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
