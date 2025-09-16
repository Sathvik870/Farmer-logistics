// src/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ApprovalPage from './pages/ApprovalPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: "signup",
        element: <PublicRoute><SignUpPage /></PublicRoute>,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
      },
      {
        path: "approve-users",
        element: <ProtectedRoute><ApprovalPage /></ProtectedRoute>,
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);