import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AdminAuthProvider } from "./context/admin/AdminAuthProvider";
import { CustomerAuthProvider } from "./context/customer/auth/CustomerAuthProvider";
import { CartProvider } from "./context/customer/cart/CartProvider";
import { LocationProvider } from "./context/customer/location/LocationProvider";
import { AlertProvider } from "./context/common/AlertContext";
import { CategoryProvider } from "./context/customer/category/CategoryProvider";
import { SearchProvider } from "./context/customer/search/SearchProvider";
import { ProductProvider } from "./context/customer/product/ProductProvider";

import AdminLogin from "./pages/admin/AdminLoginPage";
// import AdminSignup from "./pages/admin/AdminSignupPage";
import Dashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import PurchaseOrdersPage from "./pages/admin/PurchaseOrdersPage";

import LoginPage from "./pages/customer/CustomerLoginPage";
import SignupPage from "./pages/customer/CustomerSignupPage";
import ShoppingPage from "./pages/customer/ShoppingPage";
import CartPage from "./pages/customer/CartPage";
import ProfilePage from "./pages/customer/ProfilePage";
import OrdersPage from "./pages/customer/OrdersPage";

import MainLayout from "./layouts/admin/MainLayout";
import CustomerLayout from "./layouts/customer/CustomerLayout";

import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

function App() {
  return (
    <CustomerAuthProvider>
      <AdminAuthProvider>
        <AlertProvider>
          <LocationProvider>
            <ProductProvider>
              <CartProvider>
                <SearchProvider>
                  <CategoryProvider>
                    <Router>
                      <Routes>
                        <Route element={<CustomerLayout />}>
                          <Route path="/" element={<ShoppingPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                        </Route>
                        <Route element={<PublicOnlyRoute />}>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignupPage />} />
                        </Route>

                        <Route path="/admin/login" element={<AdminLogin />} />
                        {/* <Route path="/admin/signup" element={<AdminSignup />} /> */}

                        {/* ProtectedRoutes */}
                        <Route element={<AdminProtectedRoute />}>
                          <Route element={<MainLayout />}>
                            <Route
                              path="/admin/dashboard"
                              element={<Dashboard />}
                            />
                            <Route
                              path="/admin/products"
                              element={<ProductsPage />}
                            />
                            <Route
                              path="/admin/purchase-orders"
                              element={<PurchaseOrdersPage />}
                            />
                          </Route>
                        </Route>
                        <Route
                          path="*"
                          element={<div>404 - Page Not Found</div>}
                        />
                      </Routes>
                    </Router>
                  </CategoryProvider>
                </SearchProvider>
              </CartProvider>
            </ProductProvider>
          </LocationProvider>
        </AlertProvider>
      </AdminAuthProvider>
    </CustomerAuthProvider>
  );
}

export default App;
