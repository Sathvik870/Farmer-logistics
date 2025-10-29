import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/admin/AdminAuthProvider";
import { CustomerAuthProvider } from "./context/customer/CustomerAuthProvider";
import { AlertProvider } from "./context/common/AlertContext";

import AdminLogin from "./pages/admin/AdminLoginPage";
// import AdminSignup from "./pages/admin/AdminSignupPage";
import Dashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import PurchaseOrdersPage from "./pages/admin/PurchaseOrdersPage";

import LoginPage from "./pages/customer/CustomerLoginPage";
import SignupPage from "./pages/customer/CustomerSignupPage";
import ShoppingPage from "./pages/customer/ShoppingPage";

import MainLayout from "./layouts/admin/MainLayout";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute"; 

function App() {
  return (
    <CustomerAuthProvider>
      <AdminAuthProvider>
        <AlertProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ShoppingPage />} />
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}

              {/* ProtectedRoutes */}
              <Route element={<AdminProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/products" element={<ProductsPage />} />
                  <Route path="/admin/purchase-orders" element={<PurchaseOrdersPage />} />
                </Route>
              </Route>
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </Router>
        </AlertProvider>
      </AdminAuthProvider>
    </CustomerAuthProvider>
  );
}

export default App;
