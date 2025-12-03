// This line imports the main React library, along with the `useState` and `useContext` hooks.
// `useState` is used to manage component-specific data (state).
// `useContext` is used to access data from a React Context.
import React, { useState, useContext } from "react";
// This line imports the `useNavigate` hook from `react-router-dom`,
// which allows us to navigate programmatically to different routes.
import { useNavigate } from "react-router-dom";
// This line imports the `productService` object, which contains the functions
// for making API calls related to products.
import productService from "../../services/productService";
// This line imports the `AuthContext` to access user authentication data.
import AuthContext from "../../context/AuthContext";
import "../../styles/AddProduct.css"; // Keep custom CSS for styling details
// This is the functional component for adding a new product.
const AddProduct = () => {
    // `useNavigate` is initialized here to get the navigation function.
    const navigate = useNavigate();
    // `useContext` is used to get the `currentUser` object from `AuthContext`.
    // The `currentUser` object contains user details and the authentication token.
    const { currentUser } = useContext(AuthContext);
    // This `useState` hook manages the form data.
    // The state is an object with keys for each form input field.
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
        stock: "",
    });
    // This `useState` hook manages the message to be displayed to the user
    // after an action (success or error).
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // This `useState` hook manages the loading state, which is used to
    // disable the submit button and show a loading indicator.

    const [loading, setLoading] = useState(false);
    // This function handles changes to any of the form input fields.
    const handleChange = (e) => {
        // Destructure `name` and `value` from the event target (`e.target`).
        // `name` corresponds to the `name` attribute of the input, and `value` is its current value.
        const { name, value } = e.target;
        // Update the `formData` state.
        setFormData({
            // The spread operator (`...`) copies all existing key-value pairs from `formData`.
            ...formData,
            // Computed property name `[name]: value` updates the specific field
            // that was changed, without affecting others.
            [name]: value,
        });
    };
    // This asynchronous function handles the form submission.
    const handleSubmit = async (e) => { //(e) event referrence
        // `e.preventDefault()` stops the default browser behavior of refreshing the page on form submission.
        e.preventDefault();
        // Set `loading` to `true` to start the loading state.
        setLoading(true);
        // Clear any previous messages.
        setMessage("");
        //Clear any previous errors
        setError("");

        // A `try...catch` block is used to handle success and failure of the API call.
        try {
            // Call the `createProduct` function from the `productService`.
            // We pass the `formData` and the user's `token` for authentication.
            const newProduct = await productService.createProduct(
                formData,
                currentUser.token
            );
            // If `newProduct` is a truthy value, it means the product was created successfully.
            if (newProduct) {
                // Set a success message.
                setMessage("Product created successfully!");
                // `setTimeout` is used to wait 2 seconds before navigating.
                setTimeout(() => {
                    // The `Maps` function redirects the user to the `/products` route.
                    navigate("/products");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            // If an error occurs, this block is executed.
            // We try to get a specific error message from the Axios response
            // (`error.response?.data?.message`), or use a generic one if it's not available.
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred.";
            
            // Set the error message to be displayed.
            setError(`Error: ${errorMessage}`);

        } finally {
            // The `finally` block runs after either the `try` or `catch` block.
            // It ensures that `loading` is set to `false`, regardless of the outcome.
            setLoading(false);
        }
    };
    // The `return` statement renders the component's JSX.
    return (
        // The main container div for the page, with a custom class for styling.
        <div className="add-product-page ">
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {" "}
                        {/* Adjusted column size for a wider card */}
                        {/* A card component with a shadow and custom class for styling. */}
                        <div className="card shadow-lg product-form-card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4 product-form-title">
                                    Add New Product 🛍️
                                </h2>
                                {/* The form element with an `onSubmit` event handler. */}
                                <form onSubmit={handleSubmit} className="product-form">
                                    <div className="row">
                                        {/* Product Name Input */}
                                        <div className="col-md-6 mb-3 form-group">
                                            <label htmlFor="name" className="form-label">
                                                Product Name
                                            </label>
                                            {/* The input field. `value` and `onChange` bind it to the state. */}
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
                                        {/* Product Price Input */}
                                        <div className="col-md-6 mb-3 form-group">
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
                                    </div>
                                    {/* Product Description Input (full width) */}
                                    <div className="mb-3 form-group">
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
                                    <div className="row">
                                        {/* Product Image URL Input */}
                                        <div className="col-md-6 mb-3 form-group">
                                            <label htmlFor="imageUrl" className="form-label">
                                                Image URL
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="imageUrl"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {/* Product Stock Input */}
                                        <div className="col-md-6 mb-3 form-group">
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
                                    </div>
                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-50 btn-add-product"
                                            // The `disabled` attribute prevents users from submitting the form while the request is in progress.
                                            disabled={loading}
                                        >
                                            {/* The button text changes based on the `loading` state. */}
                                            {loading ? "Adding..." : "Add Product"}
                                        </button>
                                    </div>
                                </form>
                                
                                {/* Message Display */}
                                {/* This uses conditional rendering to display the message only if it's not empty. */}
                                {message && (
                                    <div
                                        className={`alert ${"alert-success"} mt-3 text-center`}
                                        role="alert"
                                    >
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div
                                        className={`alert ${"alert-danger"} mt-3 text-center`}
                                        role="alert"
                                    >
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Export the component for use in other parts of the application.
export default AddProduct;