/**
 * @fileoverview CartPage Component
 *
 * This file defines the React component for the shopping cart page.
 * It manages state, interacts with the cart API service, and displays items.
 */
// Import the core React library.
import React, {
  // useState: Hook to manage data that changes (like cart items).
  useState,
  // useEffect: Hook to run code after rendering (like fetching data).
  useEffect,
  // useContext: Hook to access shared data (like user info).
  useContext,
} from "react";
// Import the hook to move between different pages in the application.
import {
  // useNavigate: Hook that provides the navigation function.
  useNavigate,
} from "react-router-dom";
// Import the shared authentication context.
import AuthContext from "../context/AuthContext";
// Import icons for the UI.
import {
  // FaShoppingCart: Icon for the shopping cart.
  FaShoppingCart,
  // FaTrashAlt: Icon for deleting an item.
  FaTrashAlt,
  // FaPlus: Icon for increasing quantity.
  FaPlus,
  // FaMinus: Icon for decreasing quantity.
  FaMinus,
} from "react-icons/fa";
// Import the service functions for talking to the cart API.
import cartService from "../services/cartService";
/**
 * @description Renders the shopping cart page, displaying all items and providing options to manage them.
 */
// Define the main CartPage component.
const CartPage = () => {
  // State to hold the cart data (null until fetched).
  const [cart, setCart] = useState(null);
  // State to show if data is being fetched. Starts as true.
  const [loading, setLoading] = useState(true);
  // State to hold any error message. Starts as null.
  const [error, setError] = useState(null);
  // Get the current logged-in user details from AuthContext.
  const { currentUser } = useContext(AuthContext);
  // Get the navigation function.
  const navigate = useNavigate();
  // Get the user's token (needed for API calls). Safe check for currentUser.
  const token = currentUser?.token;
  /**
   * @description Asynchronously fetches the cart items from the backend API.
   */
  const fetchCartItems = async () => {
    try {
      // We set loading to true to show a loading state while fetching data.
      setLoading(true);
      // Clear any previous errors.
      setError(null);
      // Call the service layer to get the cart data using the user's token.
      const data = await cartService.getCartItems(token);
      // Set the main cart state (assuming the API returns { cart: ... }).
      setCart(data?.cart);
    } catch (err) {
      // Catch any errors and set the error state.
      setError(err.message || "An error occurred while fetching cart items.");
    } finally {
      // Set loading to false once the fetching is complete (always runs).
      setLoading(false);
    }
  };
  // We use a useEffect hook to fetch the cart data when the component mounts.
  // The dependency array `[currentUser]` ensures this runs when the user's auth status changes.
  useEffect(() => {
    // Only try to fetch if a user is logged in.
    if (currentUser) {
      // Start the fetching process.
      fetchCartItems();
    } else {
      // If no user, stop loading and show an error/prompt.
      setLoading(false);
      setError("Please log in to view your cart.");
    }
    // Effect runs when 'currentUser' changes.
  }, [currentUser]);
  /**
   * @description Handles updating the quantity of a cart item.
   * @param {string} cartItemId - The ID of the cart item to update.
   * @param {number} newQuantity - The new quantity.
   */
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      // If the new quantity is zero or less, we'll remove the item.
      if (newQuantity <= 0) {
        // Call the service to remove the item.
        await cartService.removeItem(cartItemId, token);
      } else {
        // Call the service to update the item's quantity.
        await cartService.updateItem(cartItemId, newQuantity, token);
      }
      // After a successful update, we re-fetch the cart to reflect the changes.
      await fetchCartItems();
    } catch (err) {
      // Set error state if the update fails.
      setError(err.message || "Failed to update cart item.");
    }
  };
  /**
   * @description Handles removing an item from the cart.
   * @param {string} cartItemId - The ID of the cart item to remove.
   */
  const handleRemoveItem = async (cartItemId) => {
    try {
      // Call the service to remove the item from the cart.
      await cartService.removeItem(cartItemId, token);
      // Re-fetch the cart items to show the updated cart.
      await fetchCartItems();
    } catch (err) {
      // Set error state if removal fails.
      setError(err.message || "Failed to remove cart item.");
    }
  };
  /**
   * @description Handles the checkout process.
   */
  const handleCheckout = async () => {
    try {
      // Call the service to complete the transaction.
      await cartService.checkout(token);
      // After successful checkout, navigate to the order history page or home page.
      navigate("/orders"); // Assuming you will have an orders page.
    } catch (err) {
      // Set error state if checkout fails.
      setError(err.message || "Failed to checkout. Please try again.");
    }
  };
  // Render the loading state.
  if (loading) {
    // If loading, show a centered Bootstrap spinner.
    return (
      // Flex container to center content horizontally.
      <div className="d-flex justify-content-center my-5">
        {/* Bootstrap spinner component. */}
        <div className="spinner-border" role="status">
          {/* Screen-reader text for accessibility. */}
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  // Render the error state.
  if (error) {
    // If an error occurred, show a centered Bootstrap danger alert.
    return (
      // Alert container with danger styling.
      <div className="alert alert-danger text-center my-5" role="alert">
        {/* Display the error message. */}
        {error}
      </div>
    );
  }
  // Render a message if the cart is empty.
  // Checks if cart is null, or if cart.items is null, or if the array length is zero.
  if (!cart || !cart.items || cart.items.length === 0) {
    // If empty, show a centered empty cart message and a button.
    return (
      // Centered container.
      <div className="container my-5 text-center">
        {/* Shopping Cart icon, large size, secondary color, margin bottom. */}
        <FaShoppingCart size={80} className="text-secondary mb-3" />
        {/* Main empty cart heading. */}
        <h2 className="mb-3">Your Cart is Empty</h2>
        {/* Encouraging message. */}
        <p>Looks like you haven't added anything to your cart yet.</p>
        {/* Button to navigate back to the products page. */}

        <button
          // Styling class from local CSS.
          className="btn btn-primary"
          // Click handler navigates one step back in browser history.
          onClick={() => navigate("/products")}
        >
          {/* Button text. */}
          Start Shopping
        </button>
      </div>
    );
  }
  // Calculate the total amount of the cart.
  const totalAmount = cart.items.reduce(
    // 'acc' is the accumulator (running total), 'item' is the current cart item.
    (acc, item) =>
      // Add the item's extended price (quantity * price) to the total.
      acc + item.quantity * item.product.price,
    // Initial value of the accumulator is 0.
    0
  );
  // Main rendering block for a non-empty cart.
  return (
    // Main page container with margins.
    <div className="container my-5">
      {/* // Card wrapper for the whole cart view with a shadow. */}
      <div className="card shadow-sm">
        {/* // Card body content area. */}
        <div className="card-body">
          {/* // Main page heading. */}
          <h1 className="mb-4 d-flex align-items-center">
            {/* Shopping Cart icon inside the heading. */}
            <FaShoppingCart className="me-3 text-primary" />
            {/* Heading text. */}
            Shopping Cart
          </h1>
          {/* // Responsive grid layout (Bootstrap row). */}
          <div className="row">
            {/* // Left column for the list of cart items (takes 8 columns on large screens). */}
            <div className="col-lg-8">
              {/* Map through each item in the cart. */}
              {cart.items.map((item) => (
                // Outer card for a single cart item.
                <div key={item.id} className="card mb-3 shadow-sm">
                  {/* // Card body for the item details. */}
                  <div className="card-body">
                    {/* // Row to align image, details, and price/remove button. */}
                    <div className="row align-items-center">
                      {/* // Column for the product image (3 columns on medium screens and up). */}
                      <div className="col-md-3">
                        {/* // Image element. */}
                        <img
                          // Source URL from product data, with a placeholder fallback.
                          src={
                            item.product.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          // Alt text for accessibility.
                          alt={item.product.name}
                          // Classes for fluid image size and rounded corners.
                          className="img-fluid rounded"
                        />
                      </div>
                      {/* // Column for name and quantity controls (5 columns). */}
                      <div className="col-md-5">
                        {/* Product name heading. */}
                        <h5 className="card-title mb-1">{item.product.name}</h5>
                        {/* Individual product price, muted text. */}
                        <p className="text-muted mb-2">${item.product.price}</p>
                        {/* // Flex container for quantity controls. */}
                        <div className="d-flex align-items-center">
                          {/* Decrease Quantity button. */}
                          <button
                            // Calls handler: decreases quantity by 1. If quantity becomes 0, it will be removed.
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            // Small, outline button, rounded for circular look.
                            className="btn btn-sm btn-outline-secondary me-2 rounded-circle"
                          >
                            {/* Minus icon. */}
                            <FaMinus />
                          </button>
                          {/* Quantity display badge. */}
                          <span className="badge bg-secondary rounded-pill px-3 py-2 me-2">
                            {item.quantity}
                          </span>
                          {/* Increase Quantity button. */}
                          <button
                            // Calls handler: increases quantity by 1.
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            // Small, outline button, rounded for circular look.
                            className="btn btn-sm btn-outline-secondary rounded-circle"
                          >
                            {/* Plus icon. */}
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      {/* // Column for subtotal and remove button (4 columns, right-aligned text). */}
                      <div className="col-md-4 text-end">
                        {/* Item subtotal display (Quantity * Price), fixed to 2 decimals. */}
                        <h4 className="text-primary">
                          ₹{(item.quantity * item.product.price).toFixed(2)}
                        </h4>
                        {/* Remove Item button. */}
                        <button
                          // Calls the remove item handler.
                          onClick={() => handleRemoveItem(item.id)}
                          // Small, danger (red) button.
                          className="btn btn-sm btn-danger mt-2"
                        >
                          {/* Trash icon with right margin. */}
                          <FaTrashAlt className="me-1" />
                          {/* Button text. */}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* // Right column for Cart Summary (takes 4 columns). */}
            <div className="col-lg-4 mt-4 mt-lg-0">
              {/* Summary Card. */}
              <div className="card shadow-sm">
                {/* // Summary Card body. */}
                <div className="card-body">
                  {/* Summary title. */}
                  <h5 className="card-title">Cart Summary</h5>
                  {/* List group for details like subtotal and shipping. */}
                  <ul className="list-group list-group-flush">
                    {/* List item for Subtotal. */}
                    <li className="list-group-item d-flex justify-content-between">
                      {/* Subtotal label. */}
                      <span>Subtotal:</span>
                      {/* Subtotal value, bolded, fixed to 2 decimals. */}
                      <strong>${totalAmount.toFixed(2)}</strong>
                    </li>
                    {/* List item for Shipping. */}
                    <li className="list-group-item d-flex justify-content-between">
                      {/* Shipping label. */}
                      <span>Shipping:</span>
                      {/* Shipping value (hardcoded to Free). */}
                      <span>Free</span>
                    </li>
                    {/* List item for Total (bolded). */}
                    <li className="list-group-item d-flex justify-content-between fw-bold">
                      {/* Total label. */}
                      <span>Total:</span>
                      {/* Total value (same as subtotal here). */}
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </li>
                  </ul>
                  {/* Grid wrapper for the checkout button to make it full width. */}
                  <div className="d-grid mt-3">
                    {/* Checkout button. */}
                    <button
                      // Calls the checkout handler.
                      onClick={handleCheckout}
                      // Large, success (green) button.
                      className="btn btn-success btn-lg"
                    >
                      purchase
                      {/* // Button text.Proceed to Checkout */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Export the component.
export default CartPage;
