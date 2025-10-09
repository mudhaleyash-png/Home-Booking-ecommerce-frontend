import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import productService from "../services/productService";
/**
 * @description The ProductList component allows a user to manage their own products.
 * It fetches the list of products associated with the logged-in user and displays them
 * with options to edit or delete each one. This version uses a professional table layout.
 * @file This component lives at src/pages/ProductList.jsx
 */
const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const response = await productService.getAllProducts();
        // You would typically filter on the backend for better performance,
        // but for this example, we'll keep the client-side filter.
        const userProducts = response.filter(
          (product) => product.userId === currentUser.id
        );
        setProducts(userProducts);
      } catch (err) {
        setError(err.message || "Failed to fetch products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentUser]);
  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!isConfirmed) return;
    try {
      const token = currentUser.token;
      await productService.deleteProduct(productId, token);
      setProducts(products.filter((product) => product.id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };
  if (!currentUser) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="fw-bold text-danger">Access Denied</h2>
        <p className="lead">Please log in to manage your products.</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Login
        </Link>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading your products...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <strong>Oops!</strong> {error}
        </div>
      </div>
    );
  }
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h1 className="h2 fw-bold text-dark">Your Products</h1>
        <Link to="/create-products" className="btn btn-success d-flex align-items-center">
          <i className="bi bi-plus-lg me-2"></i> Add New Product
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="alert alert-info text-center py-4 my-5" role="alert">
          <h4 className="alert-heading">No Products Found!</h4>
          <p className="mb-0">You haven't added any products yet. Click the button above to get started. :rocket:</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle shadow-sm">
            <caption className="caption-top">
              A list of all your products for management.
            </caption>
            <thead className="table-light">
              <tr>
                <th scope="col" className="text-center">#</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <th scope="row" className="text-center">{index + 1}</th>
                  <td>{product.name}</td>
                  <td className="text-success fw-bold">${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock} units</td>
                  <td className="text-center">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <Link
                        to={`/product-update/${product.id}`}
                        className="btn btn-info btn-sm text-white"
                        title="Edit Product"
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Product"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ProductListPage;