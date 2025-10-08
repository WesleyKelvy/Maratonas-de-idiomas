import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyAccount from "./pages/auth/VerifyAccount";
import ClassDetails from "./pages/ClassDetails";
import Classes from "./pages/Classes";
import ClassMarathons from "./pages/ClassMarathons";
import CreateMarathon from "./pages/CreateMarathon";
import Dashboard from "./pages/Dashboard";
import MarathonDetails from "./pages/MarathonDetails";
import MarathonEnrollment from "./pages/MarathonEnrollment";
import MarathonExecution from "./pages/MarathonExecution";
import MarathonReport from "./pages/MarathonReport";
import Marathons from "./pages/Marathons";
import MarathonDashboard from "./pages/MarathonStudentDashboard";
import Profile from "./pages/Profile";
import QuestionManagement from "./pages/QuestionManagement";
import Ranking from "./pages/Ranking";
import StudentEnrollments from "./pages/StudentEnrollments";
import StudentSubmissions from "./pages/StudentSubmissions";
import SubmissionDetails from "./pages/SubmissionDetails";
import Submissions from "./pages/Submissions";
import TeacherSubmissions from "./pages/TeacherSubmissions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Não fazer retry em erros 401/403
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      // Reduzir intervalo de refetch para evitar spam
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />

    {/* Auth Routes */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />
    <Route
      path="/verify-account"
      element={
        <PublicRoute>
          <VerifyAccount />
        </PublicRoute>
      }
    />
    <Route
      path="/reset-password"
      element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      }
    />

    {/* Protected Routes */}
    <Route
      path="/dashboard" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student", "Professor", "Admin"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <Marathons />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:id" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student", "Professor", "Admin"]}>
            <Layout>
              <MarathonDetails />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:id/execute" // STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student"]}>
            <MarathonExecution />
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <Classes />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <ClassDetails />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId/marathons" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <ClassMarathons />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId/create-marathon" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <CreateMarathon />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathon-enrollment" //STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student"]}>
            <Layout>
              <MarathonEnrollment />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-enrollments" // STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student"]}>
            <Layout>
              <StudentEnrollments />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/question-management/:marathonId" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <QuestionManagement />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathon-submissions" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <Submissions />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-submissions" //STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student"]}>
            <Layout>
              <StudentSubmissions />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher-submissions" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <TeacherSubmissions />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/submissions/:submissionId" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student", "Professor", "Admin"]}>
            <Layout>
              <SubmissionDetails />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:marathonId/dashboard" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <MarathonDashboard />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:marathonId/report" // PROFESSOR
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Professor", "Admin"]}>
            <Layout>
              <MarathonReport />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/ranking" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student", "Professor", "Admin"]}>
            <Layout>
              <Ranking />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <RoleBasedRoute allowedRoles={["Student", "Professor", "Admin"]}>
            <Layout>
              <Profile />
            </Layout>
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
    {/* <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Layout>
            <Admin />
          </Layout>
        </ProtectedRoute>
      }
    /> */}
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
