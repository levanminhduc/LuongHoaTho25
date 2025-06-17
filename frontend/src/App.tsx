import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TestPageDirect from "@/pages/TestPage";
import LoginDirect from "@/pages/Login";
import SimpleLogin from "@/pages/SimpleLogin";
import SimpleDashboard from "@/pages/SimpleDashboard";
import SimpleEmployeeManagement from "@/pages/SimpleEmployeeManagement";
import SimpleEmployeeProfile from "@/pages/SimpleEmployeeProfile";
import SimpleImportExcel from "@/pages/SimpleImportExcel";
import SimplePayrollDetail from "@/pages/SimplePayrollDetail";
import SimplePayrollList from "@/pages/SimplePayrollList";
import SimplePayrollListBasic from "@/pages/SimplePayrollListBasic";
import SSETestPage from "@/pages/SSETestPage";
import { SSEProvider } from "@/contexts/SSEContext";
import { Toaster } from "react-hot-toast";

// Lazy load pages for code splitting
const Login = React.lazy(() => import("@/pages/Login"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const PayrollList = React.lazy(() => import("@/pages/PayrollList"));
const ImportExcel = React.lazy(() => import("@/pages/ImportExcel"));
const PayrollDetail = React.lazy(() => import("@/pages/PayrollDetail"));
const EmployeeManagement = React.lazy(
  () => import("@/pages/EmployeeManagement")
);
const EmployeeProfile = React.lazy(() => import("@/pages/EmployeeProfile"));
const TestPage = React.lazy(() => import("@/pages/TestPage"));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <SSEProvider autoConnect={true} showNotifications={true}>
      <Router>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginDirect />} />
              <Route path="/simple-login" element={<SimpleLogin />} />
              <Route path="/simple-dashboard" element={<SimpleDashboard />} />
              <Route path="/employees" element={<SimpleEmployeeManagement />} />
              <Route path="/profile" element={<SimpleEmployeeProfile />} />
              <Route path="/import" element={<SimpleImportExcel />} />
              <Route path="/simple-payroll" element={<SimplePayrollDetail />} />
              <Route
                path="/simple-payroll-list"
                element={<SimplePayrollList />}
              />
              <Route
                path="/simple-payroll-list-basic"
                element={<SimplePayrollListBasic />}
              />
              <Route path="/sse-test" element={<SSETestPage />} />
              <Route path="/test-simple" element={<TestPageDirect />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        {/* Default redirect */}
                        <Route
                          index
                          element={<Navigate to="/simple-dashboard" replace />}
                        />

                        {/* Dashboard - accessible to all authenticated users */}
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Test page */}
                        <Route path="test" element={<TestPageDirect />} />

                        {/* Admin only routes */}
                        <Route
                          path="payroll"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <PayrollList />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="import"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <ImportExcel />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="employees"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <EmployeeManagement />
                            </ProtectedRoute>
                          }
                        />

                        {/* Employee routes */}
                        <Route
                          path="my-payroll"
                          element={
                            <ProtectedRoute requiredRole="employee">
                              <PayrollDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="profile"
                          element={
                            <ProtectedRoute requiredRole="employee">
                              <EmployeeProfile />
                            </ProtectedRoute>
                          }
                        />

                        {/* Redirect employees to their payroll page */}
                        {user?.role === "employee" && (
                          <Route
                            path="dashboard"
                            element={<Navigate to="/my-payroll" replace />}
                          />
                        )}

                        {/* Catch all - redirect to dashboard */}
                        <Route
                          path="*"
                          element={<Navigate to="/simple-dashboard" replace />}
                        />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all routes */}
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/simple-dashboard" replace />
                  ) : (
                    <Navigate to="/simple-login" replace />
                  )
                }
              />
            </Routes>
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </SSEProvider>
  );
};

export default App;
