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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
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
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <Marathons />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:id" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <MarathonDetails />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:id/execute" // STUDENT
      element={
        <ProtectedRoute>
          <MarathonExecution />
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <Classes />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <ClassDetails />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId/marathons" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <ClassMarathons />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/classes/:classId/create-marathon" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <CreateMarathon />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathon-enrollment" //STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <MarathonEnrollment />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-enrollments" // STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <StudentEnrollments />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/question-management/:marathonId" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <QuestionManagement />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathon-submissions" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <Submissions />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-submissions" //STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <StudentSubmissions />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/teacher-submissions" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <TeacherSubmissions />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/submissions/:submissionId" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <SubmissionDetails />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:marathonId/dashboard" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <MarathonDashboard />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/marathons/:marathonId/report" // PROFESSOR
      element={
        <ProtectedRoute>
          <Layout>
            <MarathonReport />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/ranking" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <Ranking />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile" // PROFESSOR AND STUDENT
      element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
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
