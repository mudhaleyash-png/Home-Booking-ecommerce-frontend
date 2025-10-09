import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AddProduct from './components/products/AddProduct';
import PrivateRoute from './components/common/PrivateRoute';
import EditProduct from './components/products/EditProduct';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProductListPage from './pages/ProductListPage';
import ProductsPage from './pages/ProductsPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar/>
          <Footer/>
        <main className="flex-grow-1">
          
          <Routes>
            {/*Mensiion Publically accessible*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />}/>


            {/* */}
            <Route path="/create-products" 
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            } 
            />

            <Route
            path ="/product-update/:id"
            element= {
              <PrivateRoute>
                <EditProduct/>
              </PrivateRoute>
            } />

            <Route
            path ="/product-list"
            element= {
              <PrivateRoute>
                <ProductListPage/>
              </PrivateRoute>
            } />

          </Routes>
        </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;