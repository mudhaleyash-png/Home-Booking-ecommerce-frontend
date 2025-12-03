import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AddProduct from "./components/products/AddProduct";
import PrivateRoute from "./components/common/PrivateRoute";
import EditProduct from "./components/products/EditProduct";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProductListPage from "./pages/ProductListPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetails from "./components/products/ProductDetails";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex column min-vh-100">
          <>
            <Navbar />
          </>
          <main className="flex-grow-1">
            {/* public */}
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              {/* private */}
              <Route
                path="/addProduct"
                element={
                  <PrivateRoute>
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/update-product/:id"
                element={
                  <PrivateRoute>
                    <EditProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/product-list"
                element={
                  <PrivateRoute>
                    <ProductListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carts"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrderPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </AuthProvider>
    </Router>
  );
};
export default App;
