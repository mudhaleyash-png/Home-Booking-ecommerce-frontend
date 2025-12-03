/**
 * @fileoverview ProductDetailsPage Component
 *
 * This component handles fetching and displaying the detailed view of a single product.
 * It manages state for loading, errors, and cart interaction messages.
 */
// Import the core React library.
import React, {
  // useState: Hook for managing state variables.
  useState,
  // useEffect: Hook for performing side effects like data fetching.
  useEffect,
} from "react";
// Import hooks specific to React Context.
import {
  // useContext: Hook to consume context values.
  useContext,
} from "react";
// Import hooks specific to React Router for dynamic routing.
import {
  // useParams: Hook to access URL parameters (like the product ID).
  useParams,
  // useNavigate: Hook to get the function for programmatic navigation.
  useNavigate,
} from "react-router-dom";
// Import specific icons from the Font Awesome icon library (Fa).
import {
  // FaShoppingCart: Icon for "Add to Cart" button.
  FaShoppingCart,
  // FaSpinner: Icon for the loading state indicator.
  FaSpinner,
  // FaBox: Icon for the error/not found state.
  FaBox,
  // FaLongArrowAltLeft: Icon for the "Back" button.
  FaLongArrowAltLeft,
} from "react-icons/fa";
// Import the authentication context to get user state.
import AuthContext from "../../context/AuthContext";
// Import the service layer for product-related API calls.
import productService from "../../services/productService";
// Import the service layer for cart-related API calls.
import cartService from "../../services/cartService";
// Import the local stylesheet for styling this specific page.
import "../../styles/ProductDetails.css";
/**
 * @description This component displays a product using a professional,
 * Bootstrap-native layout with animated elements.
 */
// Define the functional component 'ProductDetailsPage'.
const ProductDetails = () => {
  // Extract the 'id' parameter from the current URL path.
  const { id } = useParams();
  // Get the function used for navigating between pages.
  const navigate = useNavigate();
  // Get the 'currentUser' object from the AuthContext.
  const { currentUser } = useContext(AuthContext);
  // State to hold the fetched product data object. Initialized to null.
  const [product, setProduct] = useState(null);
  // State to track if product data is currently being loaded. Initialized to true.
  const [loading, setLoading] = useState(true);
  // State to hold any error message during fetching. Initialized to null.
  const [error, setError] = useState(null);
  // State to hold temporary feedback messages (e.g., "Added to Cart"). Initialized as an empty string.
  const [message, setMessage] = useState("");
  // Safely retrieve the authentication token from 'currentUser'.
  const token = currentUser?.token;
  /**
   * Effect Hook: Fetches the specific product data based on the URL 'id'.
   */
  useEffect(() => {
    // Define an asynchronous function to handle the fetching.
    const fetchProduct = async () => {
      try {
        // Await the API call to get the product by its ID.
        const data = await productService.getProductById(id);
        // Update the 'product' state with the fetched data.
        setProduct(data);
      } catch (err) {
        // Log the detailed error to the console for debugging.
        console.error("Failed to fetch product:", err);
        // Set the error state with a message (either the error message or a default).
        setError(err.message || "Failed to fetch product details.");
      } finally {
        // Set 'loading' to false when the operation completes (success or failure).
        setLoading(false);
      }
    };
    // Execute the data fetching function.
    fetchProduct();
    // Dependency array: runs when the component mounts or the URL 'id' changes.
  }, [id]);
  /**
   * Function to handle the "Add to Cart" action.
   */
  const handleAddToCart = async () => {
    // Check 1: If the user is not logged in.
    if (!currentUser) {
      // Set a message prompt to log in.
      setMessage("Please log in to add products to your cart.");
      // Set a timeout to wait 1 second, then navigate to the login page.
      setTimeout(() => navigate("/login"), 1000);
      // Exit the function.
      return;
    }
    try {
      // Await the API call to the 'cartService' to add 1 item.
      await cartService.addItem(product.id, 1, token);
      // Set a success message.
      setMessage("Product added to cart successfully!");
      // Set a timeout to wait 1.5 seconds, then navigate to the cart page.
      setTimeout(() => navigate("/carts"), 1500);
    } catch (err) {
      // Set a failure message if the API call fails.
      setMessage("Failed to add product to cart. Please try again.");
      // Log the error to the console.
      console.error("Add to cart error:", err);
    }
  };
  // --- Conditional Rendering for Loading State ---
  // Check if the 'loading' state is true.
  if (loading) {
    // If true, return the loading indicator JSX.
    return (
      // Loading container styling (likely centered on screen via external CSS).
      <div className="loading-state">
        {/* Renders the Spinner icon. */}
        <FaSpinner
          // 'spin-animation' class likely applies rotating CSS animation.
          className="spin-animation"
          // Sets the icon size.
          size={60}
        />
        {/* Text label beneath the spinner. */}
        <span className="h5 mt-3">Loading product...</span>
      </div>
    );
  }
  // --- Conditional Rendering for Error State ---
  // Check if the 'error' state is not null.
  if (error) {
    // If an error exists, return the error message JSX.
    return (
      // Error container styling.
      <div className="error-state">
        {/* Renders the Box icon. */}
        <FaBox size={60} />
        {/* Display the error message content. */}
        <p className="mt-3 mb-0">Error: {error}</p>
      </div>
    );
  }
  // --- Conditional Rendering for Not Found State ---
  // Check if loading is false but the 'product' state is null (i.e., not found).
  if (!product) {
    // If not found, return the not-found message JSX.
    return (
      // Not Found container styling.
      <div className="not-found-state">
        {/* Renders the Box icon. */}
        <FaBox size={60} />
        {/* Display the "Product not found" message. */}
        <p className="mt-3 mb-0">Product not found.</p>
      </div>
    );
  }
  // --- Main Component Rendering ---
  // If no loading or error, return the main product details layout.
  return (
    // Main page container, applies container fluid wrapper with margins.
    <div className="product-page-container-pro container my-5">
      {/* // Back button element. */}
      <button
        // Styling class from local CSS.
        className="back-button-pro btn btn-primary"
        // Click handler navigates one step back in browser history.
        onClick={() => navigate(-1)}
      >
        {/* Renders the left arrow icon with right margin. */}
        <FaLongArrowAltLeft />
        {/* Button text. */}
        Back to Products
      </button>
      {/* // Main card container for product display.
            // Uses Bootstrap grid (row), spacing (g-4), padding (p-4), shadow, and rounded corners.
            // 'animate__fadeInUp' likely provides an entrance animation from external CSS. */}
      <div className="product-card-pro row g-4 p-4 shadow-lg rounded-4 animate__fadeInUp">
        {/* // Left column for the image (takes 6 columns on large screens).
                // Flex utilities center the content vertically and horizontally. */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center animate__fadeInUp animate__delay-1">
          {/* // Wrapper for the image, likely defining max size/ratio via local CSS. */}
          <div className="product-image-container-pro">
            {/* // Image element. */}
            <img
              // Source URL logic: use image_url if available, otherwise use a placeholder with the product name.
              src={
                product.image_url ||
                `https://placehold.co/800x800?text=${product.name}`
              }
              // Alt text for accessibility.
              alt={product.name}
              // Classes for responsive image size and custom styling.
              className="img-fluid product-hero-image-pro"
            />
          </div>
        </div>
        {/* // Right column for product details (takes 6 columns on large screens). */}
        <div className="col-lg-6 animate__fadeInUp animate__delay-2">
          {/* // Wrapper for the text content. */}
          <div className="product-details-content-pro">
            {/* // Product name as the main title. */}
            <h1 className="product-title-pro">{product.name}</h1>
            {/* // Product description paragraph. */}
            <p className="product-description-pro">{product.description}</p>
            {/* // Horizontal rule for visual separation. */}
            <hr className="my-4" />
            {/* // Product price display. */}
            <h2 className="product-price-pro">₹{product.price}</h2>
            {/* // Stock status label. */}
            <p className="product-stock-status-pro">
              Stock: {/* // Conditional rendering for the stock value. */}
              {product.stock > 0 ? (
                // If in stock, show quantity in green text.
                <span className="text-success">{product.stock} in stock</span>
              ) : (
                // If out of stock, show text in red danger text.
                <span className="text-danger">Out of Stock</span>
              )}
            </p>
            {/* // Conditional rendering for the Add to Cart button (only show if stock > 0). */}
            {product.stock > 0 && (
              // Add to Cart button.
              <button
                // Styling class from local CSS.
                className="add-to-cart-btn-pro"
                // Click handler calls the async function to add the product to the cart.
                onClick={handleAddToCart}
                // Disable button if user is not logged in OR if stock is zero.
                disabled={!currentUser || product.stock === 0}
              >
                {/* Renders the Shopping Cart icon with right margin. */}
                <FaShoppingCart className="me-2" />
                {/* Button text. */}
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
      {/* // Message/Toast display section. */}
      {message && (
        // Message div.
        <div
          // Dynamic class: 'toast-message' base class combined with 'success' or 'danger' styling.
          className={`toast-message ${
            // Logic checks if the message string includes "successfully".
            message.includes("successfully") ? "success" : "danger"
          }`}
        >
          {/* Display the content of the message state. */}
          {message}
        </div>
      )}
    </div>
  );
};
// Export the component for use in the application router.
export default ProductDetails;
