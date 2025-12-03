// This line imports the necessary hooks from React.
// `useState`: Manages the component's state (e.g., form data, loading status).
// `useEffect`: Executes side effects, like fetching data, after the component renders.
import React, { useState, useEffect } from "react";
// This line imports `useParams` to get parameters from the URL, and `useNavigate` for programmatic navigation.
import { useParams, useNavigate } from "react-router-dom";
// This line imports the `useContext` hook to access a context value.
import { useContext } from "react";
// This line imports the `productService` object, which contains all the API call functions for products.
import productService from "../../services/productService";
// This line imports the `AuthContext` to access the current user's authentication data.
import AuthContext from "../../context/AuthContext";
//This line imports the EditProduct css
import '../../styles/EditProduct.css';
// This is a commented-out line that would import Bootstrap CSS.
// import 'bootstrap/dist/css/bootstrap.min.css';
/**
 * @description: A page component for editing an existing product.
 * It fetches the product's current data, pre-populates a form, and handles the update.
 */
// This defines the `EditProduct` functional component.
const EditProduct = () => {
  // We use `useParams` to get the dynamic product ID from the URL.
  // The `{ id }` part destructures the `id` from the parameters object.
  const { id } = useParams();
  // `useNavigate` is initialized here to get the navigation function.
  const navigate = useNavigate();
  // `useContext` is used to get the `currentUser` object from `AuthContext`.
  const { currentUser } = useContext(AuthContext);
  // We use the `useState` hook to manage the form data.
  // The state is an object that mirrors the product's properties.
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock: "",
  });
  // We use state to manage UI feedback and loading status.
  // `loading` is set to `true` initially because the product data needs to be fetched.
  const [loading, setLoading] = useState(true);
  // `message` is for success messages.
  const [message, setMessage] = useState("");
  // `error` is for error messages.
  const [error, setError] = useState(null);
  // We use `useEffect` to fetch the product data as soon as the component mounts.
  
  useEffect(() => {
    /**
     * @description: Fetches the product data from the backend.
     */
    // This inner function is defined to handle the asynchronous API call.
    const fetchProduct = async () => {
      try {
        // Log the product ID to the console for debugging.
        console.log("Id is", id);
        // Call the `getProductById` function from `productService`.
        const response = await productService.getProductById(id);
        // Log the response for debugging.
        console.log("Response is", response);
        // If the response is valid, we pre-populate the form.
        if (response) {
          // Set the `formData` state with the fetched data.
          setFormData({
            name: response.name,
            description: response.description,
            price: response.price,
            image_url: response.image_url || "", // Use a default empty string if `image_url` is not present.
            stock: response.stock,
          });
          // Set `loading` to `false` to hide the loading indicator.
          setLoading(false);
        } else {
          // If no product is found, set an error message.
          setError("Product not found.");
          setLoading(false);
        }
      } catch (err) {
        // If an error occurs during fetching, set an error message.
        setError("Failed to fetch product data.");
        setLoading(false);
      }
    };
    // Call the `fetchProduct` function to initiate the data fetching.
    fetchProduct();
  }, [id]); // The dependency array `[id]` ensures this effect runs only when the `id` parameter changes.
  /**
   * @description: Handles changes to the form input fields.
   * Updates the `formData` state with the new value.
   * @param {object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    // Destructure `name` and `value` from the event target.
    const { name, value } = e.target;
    // Update the `formData` state using a functional update pattern for safety.
    setFormData((prevData) => ({
      ...prevData, // Copy the previous state.
      [name]: value, // Update the specific field that was changed.
    }));
  };
  /**
   * @description: Handles the form submission for updating the product.
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    // `e.preventDefault()` stops the default browser form submission behavior.
    e.preventDefault();
    // Set `loading` to `true` to show the updating status.
    setLoading(true);
    // Clear any previous messages.
    setMessage("");
    // Clear any previous errors.
    setError(null);
    try {
      // Call the `updateProduct` service from our `productService`.
      const response = await productService.updateProduct(
        id, // The product ID.
        formData, // The updated form data.
        currentUser.token // The user's token for authentication.
      );
      // Check for a `success` property in the response from the server.
      if (response.success) {
        // If successful, set a success message.
        setMessage("Product updated successfully!");
        // After a successful update, we use `setTimeout` to redirect the user after 2 seconds.
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      } else {
        // If the server response indicates an error, set the error message.
        setError(response.message || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error("Failed to update product", err)
      // If the API call fails, get the error message from the Axios error object.
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      // The `finally` block runs whether the try or catch block was executed.
      // It ensures `loading` is set to `false`, which re-enables the form.
      setLoading(false);
    }
  };
  // Conditional rendering for different states (loading, error, and success).
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product data...</p>
      </div>
    );
  }
  // If there's an error, display an alert message.
  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
    }
      return (
    <div className="container mt-5 edit-product-page">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Edit Product</h2>
              <form onSubmit={handleSubmit}>
                {/* Product Name Input */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Product Description Input */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                {/* Product Price Input */}
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Product Image URL Input */}
                <div className="mb-3">
                  <label htmlFor="image_url" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                </div>
                {/* Product Stock Input */}
                <div className="mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </form>
              {/* Message Display */}
              {message && (
                <div
                  className="alert alert-success mt-3 text-center"
                  role="alert"
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProduct;