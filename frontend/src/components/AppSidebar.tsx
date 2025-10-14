import { useLogout } from "@/hooks/use-auth";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Medal,
  Settings,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const location = useLocation();
  const currentPath = location.pathname;

  const studentItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Minhas Maratonas", url: "minhas/my-enrollments", icon: Trophy },
    {
      title: "Inscrever em Maratona",
      url: "/marathon-enrollment",
      icon: Medal,
    },
    { title: "Minhas Submissões", url: "/my-submissions", icon: FileText },
    { title: "Ranking", url: "/ranking", icon: Medal },
    { title: "Perfil", url: "/profile", icon: User },
  ];

  const teacherItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Turmas", url: "/classes", icon: Users },
    { title: "Maratonas", url: "/marathons", icon: Trophy },
    { title: "Submissões", url: "/submissions", icon: FileText },
    { title: "Relatórios", url: "/reports", icon: BarChart3 },
    { title: "Ranking", url: "/ranking", icon: Medal },
    { title: "Perfil", url: "/profile", icon: User },
  ];

  const adminItems = [
    ...teacherItems,
    { title: "Administração", url: "/admin", icon: Settings },
  ];

  const getItems = () => {
    if (user?.role === "Admin") return adminItems;
    if (user?.role === "Professor") return teacherItems;
    return studentItems;
  };

  const items = getItems();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };
  // const getNavCls = ({ isActive }: { isActive: boolean }) =>
  //   isActive ? "bg-primary font-medium" : "hover:bg-muted ";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4">
          <h2
            className={`font-bold text-lg ${
              state === "collapsed" ? "text-xs text-center" : ""
            }`}
          >
            {state === "collapsed" ? "EDU" : "EduMarathon"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-medium [&:hover]:bg-primary [&:hover]:text-primary-foreground"
                          : ""
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenuButton
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {state !== "collapsed" && (
              <span>{logoutMutation.isPending ? "Saindo..." : "Sair"}</span>
            )}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
