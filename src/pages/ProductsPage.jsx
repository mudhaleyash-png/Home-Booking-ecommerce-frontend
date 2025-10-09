/*
* @fileoverview ProductPage Component
 *
 * This is the main container component responsible for fetching product data,
 * managing the application state (loading, error, filtering, messages),
 * and rendering the full product catalog view using sub-components.
 */
// Import the core React library.
import React, {
    // useState: Hook for adding state variables to functional components.
    useState,
    // useEffect: Hook for performing side effects (like data fetching) and lifecycle events.
    useEffect,
    // useContext: Hook for consuming values from a React Context.
    useContext
} from "react";
// Import Link for internal navigation and useNavigate for programmatic routing.
import {
    // Link: Component to create navigation links without full page reload.
    Link,
    // useNavigate: Hook to get the function for history navigation.
    useNavigate
} from "react-router-dom";
// Import external Bootstrap CSS (often leads to resolution errors in single-file environments).
import "bootstrap/dist/css/bootstrap.min.css";
// Import specific icons from react-icons/fa (often leads to resolution errors).
import {
    // FaPlusCircle: Icon for 'add' action.
    FaPlusCircle,
    // FaBoxes: Icon often used for empty state.
    FaBoxes,
    // FaSpinner: Icon used for loading/spinner visualization.
    FaSpinner
} from "react-icons/fa";
// Import the service layer for product-related API calls.
import productService from "../services/productService";
// Import the authentication context to get user state.
import AuthContext from "../context/AuthContext";
// Import ProductGrid component for displaying filtered products.
import ProductGrid from "../components/products/ProductGrid";
// Import ProductCarousel component for displaying featured products.
import ProductCarousel from "../components/products/ProductCarousel";
// Import Hero component for the top banner and search bar.
import ProductHero from "../components/products/ProductHero";
// Import the service layer for cart-related API calls.
import cartService from "../services/productService";
// Import local stylesheet (often leads to resolution errors).
import "../styles/ProductsPage.css";

// Define the functional component 'ProductPage'.
const ProductsPage = () => {
    // State to store the complete array of fetched products. Initialized as an empty array.
    const [products, setProducts] = useState([]);
    // State to track if product data is currently being loaded. Initialized to true.
    const [loading, setLoading] = useState(true);
    // State to store an error message if data fetching fails. Initialized to null.
    const [error, setError] = useState(null);
    // State to store a temporary message object (text and type) for user feedback. Initialized as an empty string.
    const [message, setMessage] = useState("");
    // State to hold the text entered by the user in the search bar. Initialized as an empty string.
    const [searchTerm, setSearchTerm] = useState("");
    // State to store the list of products after search filtering is applied. Initialized as an empty array.
    const [filteredProducts, setFilteredProducts] = useState([]);
    // State to store the subset of products selected as featured items. Initialized as an empty array.
    const [featuredProducts, setFeaturedProducts] = useState([]);
    // Destructure the 'currentUser' object from the AuthContext.
    const { currentUser } = useContext(AuthContext);
    // Initialize the function to navigate programmatically.
    const navigate = useNavigate();
    // Safely retrieve the authentication token from 'currentUser' (optional chaining '?.').
    const token = currentUser?.token;
    /**
     * Effect Hook: Fetches all product data from the service layer once on mount.
     */
    useEffect(() => {
        // Define an asynchronous function to handle the fetching logic.
        const fetchProducts = async () => {
            try {
                // Await the result of the API call to get all products.
                const response = await productService.getAllProducts();
                // Update the 'products' state with the response data (or an empty array if undefined).
                setProducts(response || []);
                // Initialize 'filteredProducts' with the full product list.
                setFilteredProducts(response || []);
                // Comment describing the simple business logic for determining featured products.
                // Simple logic for featured products: products with a price over $1000 & stock is not 0
                // Filter the response: keeps products where the price is greater than $1000 AND stock is not 0.
                setFeaturedProducts(response.filter((p) => p.price > 1000 && p.stock !=0));
            } catch (err) {
                // If an error occurs during fetching, set the error state with a friendly message.
                setError("Failed to fetch products. Please try again later.");
            } finally {
                // Always set 'loading' to false when the API call (success or fail) finishes.
                setLoading(false);
            }
        };
        // Execute the data fetching function.
        fetchProducts();
    // Dependency array is empty, ensuring the fetch only runs after the initial render.
    }, []);
    /**
     * Effect Hook: Runs search filtering logic whenever 'searchTerm' or 'products' changes.
     */
    useEffect(() => {
        // Create a new array 'result' by filtering the original 'products' array.
        const result = products.filter(
            // Callback function for filtering each 'product'.
            (product) =>
                // Check if product name (converted to lowercase) includes the search term (lowercase).
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // OR check if product description (lowercase) includes the search term (lowercase).
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Update the state of the filtered product list.
        setFilteredProducts(result);
    // Runs when 'searchTerm' (from Hero) or 'products' (from initial fetch) state changes.
    }, [searchTerm, products]);
    /**
     * Function to handle displaying temporary messages to the user (e.g., success/error toasts).
     * @param {string} msg - The message text.
     * @param {string} type - The message type (defaults to "success").
     */
    const handleMessage = (msg, type = "success") => {
        // Set the 'message' state as an object containing the text and type.
        setMessage({ text: msg, type });
        // Set a timer to automatically clear the message after 3000 milliseconds (3 seconds).
        setTimeout(() => setMessage(null), 3000);
    };
    /**
     * Function to handle adding a product to the user's shopping cart.
     * @param {string} productId - The unique identifier of the product to add.
     */
    const handleAddToCart = async (productId) => {
        // Check: If 'currentUser' is falsy (not logged in).
        if (!currentUser) {
            // Display an error message to prompt login.
            handleMessage("Please log in to add products to your cart.", "danger");
            // Exit the function immediately.
            return;
        }
        try {
            // Await the API call to the 'cartService' to add the item (ID, quantity 1, token).
            await cartService.addItem(productId, 1, token);
            // Display a success message.
            handleMessage("Product added to cart successfully!", "success");
        } catch (err) {
            // Display a generic failure message.
            handleMessage(
                "Failed to add product to cart. Please try again.",
                "danger"
            );
            // Log the detailed error object to the console for debugging.
            console.error("Add to cart error:", err);
        }
    };
    // --- Conditional Rendering for Loading State ---
    // Check if the 'loading' state is true.
    if (loading) {
        // If true, return the loading screen JSX.
        return (
            // Outer div for centering the content (d-flex, justify-content-center, align-items-center).
            // vh-100 sets the height to 100% of the viewport height. bg-light sets a light background.
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                {/* Renders the Font Awesome Spinner icon (FaSpinner). */}
                {/* className="spinner-border" is a Bootstrap class for visual spin effect. */}
                {/* size={60} sets the visual size of the icon. */}
                <FaSpinner className="spinner-border text-primary" size={60} />
            </div>
        );
    }
    // --- Conditional Rendering for Error State ---
    // Check if the 'error' state is not null.
    if (error) {
        // If an error exists, return the error message JSX.
        return (
            // Alert box styling (alert, alert-danger, mt-5) centered.
            <div className="alert alert-danger mt-5 text-center" role="alert">
                {/* Display the content of the error message state. */}
                {error}
            </div>
        );
    }
    // --- Main Component Rendering ---
    // Return the main structure of the ProductPage.
    return (
        // Main container div for the product page content.
        <div className="product-page-content">
            {/* Conditional message display (if 'message' is not null). */}
            {message && (
                // Div for the toast message.
                // Dynamic class names: combines base class with the message 'type' (success/danger).
                <div
                    className={`custom-toast-message ${message.type}`}
                >
                    {/* Display the message text content. */}
                    {message.text}
                </div>
            )}
            {/* 1. Featured Products Section */}
            {/* Conditionally render this section only if there are featured products. */}
            {featuredProducts.length > 0 && (
                // Semantic <section> tag for grouping content.
                <section className="featured-section py-5 bg-white">
                    {/* Bootstrap container for centered and constrained width. */}
                    <div className="container">
                        {/* Section title, centered with bottom margin. */}
                        <h2 className="section-title text-center mb-4">
                            {/* Title text. */}
                            Featured Products
                        </h2>
                        {/* Render the ProductCarousel component. */}
                        <ProductCarousel
                            // Pass the filtered list of featured products.
                            products={featuredProducts}
                            // Pass the handler function for adding products to cart.
                            handleAddToCart={handleAddToCart}
                        />
                    </div>
                </section>
            )}
            {/* 2. Hero Section with Search Bar */}
            {/* Render the Hero component. */}
            <ProductHero
                // Pass the current search term state down.
                searchTerm={searchTerm}
                // Pass the function to update the search term state up.
                setSearchTerm={setSearchTerm}
            />
            {/* 3. All Products Section */}
            {/* // Semantic <section> tag for grouping the main product listing. */}
            <section className="all-products-section py-5">
                {/* // Bootstrap container. */}
                <div className="container">
                    {/* // Title for the main product grid. */}
                    <h2 className="section-title text-center mb-4">All Products</h2>
                    {/* Conditional rendering: check if any filtered products exist. */}
                    {filteredProducts.length > 0 ? (
                        // If products exist, render the ProductGrid.
                        <ProductGrid
                            // Pass the list of products (filtered by search term).
                            products={filteredProducts}
                            // Pass the message handler function.
                            handleMessage={handleMessage}
                            // Pass the cart handler function.
                            handleAddToCart={handleAddToCart}
                        />
                    ) : (
                        // If no products match the search or the list is empty, display an empty state.
                        <div className="col-12 text-center my-5 empty-state">
                            {/* Renders the Font Awesome Boxes icon (FaBoxes). */}
                            {/* size={80} sets a large size, text-secondary is a gray color. */}
                            <FaBoxes size={80} className="text-secondary mb-3" />
                            {/* Main empty state heading. */}
                            <h2 className="mb-2">No products found.</h2>
                            {/* Lead paragraph explaining the empty state. */}
                            <p className="lead">
                                It looks like our shelves are empty for now.
                            </p>
                            {/* Conditional link: only show if a user is logged in. */}
                            {currentUser && (
                                // Link to the product creation page.
                                <Link
                                    to="/create-products"
                                    // Bootstrap styling for a primary button, large size, rounded pill shape.
                                    className="btn btn-primary mt-3 btn-lg rounded-pill"
                                >
                                    {/* Renders the Font Awesome Plus Circle icon (FaPlusCircle). */}
                                    <FaPlusCircle className="me-2" /> {/* Icon margin to the right. */}
                                    {/* Link text. */}
                                    Add Your First Product
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
{/* // Export the component for use in the application router. */}
export default ProductsPage;