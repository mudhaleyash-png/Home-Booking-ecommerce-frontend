/** @fileoverview OrderHistoryPage Component
 *
 * This file defines the main component for displaying the authenticated user's
 * past purchases, including functionality to delete (cancel) an order via a modal.
 */
// Import the core React library.
import React, {
  // useState: Hook for managing state (data that changes).
  useState,
  // useEffect: Hook for side effects (like fetching data when the component loads).
  useEffect,
  // useContext: Hook to access shared data (like the current user).
  useContext,
} from "react";
// Import navigation components from React Router.
import {
  // Link: Component for internal navigation links.
  Link,
} from "react-router-dom";
// Import Bootstrap's main CSS file (relies on external setup).
import "bootstrap/dist/css/bootstrap.min.css";
// Import various icons from the Font Awesome icon library.
import {
  // FaHistory: Icon for the order history or empty state.
  FaHistory,
  // FaTrashAlt: Icon for the delete/cancel action.
  FaTrashAlt,
  // FaSpinner: Icon for the loading state.
  FaSpinner,
  // FaShoppingBag: Icon for the "Start Shopping" button.
  FaShoppingBag,
  // FaCalendarAlt: Icon for displaying the order date.
  FaCalendarAlt,
  // FaDollarSign: Icon for displaying the total amount.
  FaDollarSign,
  // FaExclamationCircle: Icon for the modal warning.
  FaExclamationCircle,
  FaRupeeSign,
} from "react-icons/fa";
// Import the authentication context to get user details.
import AuthContext from "../context/AuthContext";
// Import the service functions for talking to the order API.
import orderService from "../services/orderService";
// Import the date formatting library.
import {
  // format: Function to neatly format date objects.
  format,
} from "date-fns";
// Import the local stylesheet for custom styling.
import "../styles/OrderPage.css";
/**
 * @description Renders the order history page for the authenticated user.
 * It features a professional UI with an animated confirmation modal.
 */
// Define the functional component 'OrderHistoryPage'.
const OrderPage = () => {
  // State to hold the fetched list of orders.
  const [orders, setOrders] = useState([]);
  // State to track if data is currently being fetched. Starts as true.
  const [loading, setLoading] = useState(true);
  // State to hold any error message from API calls. Starts as null.
  const [error, setError] = useState(null);
  // State for the custom confirmation modal visibility.
  const [showModal, setShowModal] = useState(false);
  // State to temporarily store the ID of the order we plan to delete.
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  // State for temporary success or error messages (toasts).
  const [message, setMessage] = useState("");
  // Get current user and token from AuthContext.
  const { currentUser } = useContext(AuthContext);
  // Safely get the user's authentication token.
  const token = currentUser?.token;
  /**
   * @description Fetches all orders from the backend for the current user.
   */
  const fetchOrders = async () => {
    try {
      // Indicate that loading is starting.
      setLoading(true);
      // Clear any previous error messages.
      setError(null);
      // Call the service to get orders, awaiting the response.
      const response = await orderService.getOrders(token);
      // Update the state with the received list of orders.
      setOrders(response.orders || []);
    } catch (err) {
      // Log the detailed error for debugging.
      console.error("Error fetching orders:", err);
      // Set a user-friendly error message.
      setError(err.message || "An error occurred while fetching your orders.");
    } finally {
      // Always set loading to false when the API request is finished.
      setLoading(false);
    }
  };
  /**
   * @description Handles the initial click to open the confirmation modal.
   * @param {number} orderId - The ID of the order to be deleted.
   */
  const handleOpenModal = (orderId) => {
    // Store the ID of the order being targeted.
    setOrderIdToDelete(orderId);
    // Show the confirmation modal.
    setShowModal(true);
  };
  /**
   * @description Handles the confirmation of the order deletion.
   */
  const confirmDelete = async () => {
    // Hide the modal immediately.
    setShowModal(false);
    // Safety check: if there's no ID to delete, stop the function.
    if (!orderIdToDelete) return;
    try {
      // Call the service to delete the order, awaiting the result.
      await orderService.deleteOrder(orderIdToDelete, token);
      // Re-fetch the entire list of orders to update the UI.
      fetchOrders();
      // Show a success message to the user.
      setMessage("Order deleted successfully!");
    } catch (err) {
      // Log the error if deletion fails.
      console.error("Error deleting order:", err);
      // Show an error message to the user.
      setMessage(err.message || "Failed to delete the order.");
    } finally {
      // Clear the stored ID regardless of success or failure.
      setOrderIdToDelete(null);
    }
  };
  /**
   * @description Closes the confirmation modal without deleting the order.
   */
  const cancelDelete = () => {
    // Hide the modal.
    setShowModal(false);
    // Clear the stored order ID.
    setOrderIdToDelete(null);
  };
  // Fetch orders on component mount or when user status changes.
  useEffect(() => {
    // Check if a user is logged in.
    if (currentUser) {
      // If logged in, fetch the orders.
      fetchOrders();
    } else {
      // If not logged in, stop loading and show an error prompt.
      setLoading(false);
      setError("Please log in to view your order history.");
    }
    // Dependency array: runs when currentUser or token changes.
  }, [currentUser, token]);
  // Helper function to map status strings to Bootstrap badge styling classes.
  const getStatusBadgeClass = (status) => {
    // Use a switch statement for clean conditional logic based on status.
    switch (status.toLowerCase()) {
      // If status is 'pending', use yellow warning badge.
      case "pending":
        return "bg-warning text-dark";
      // If status is 'canceled', use red danger badge.
      case "canceled":
        return "bg-danger";
      // If status is 'success', use green success badge.
      case "success":
        return "bg-success";
      // For any other status, use a gray secondary badge.
      default:
        return "bg-secondary"; // fallback
    }
  };
  // --- Conditional Rendering for Loading State ---
  // Check if loading is true.
  if (loading) {
    // Return a full-screen, centered loading spinner view.
    return (
      // Flex container to center content vertically (vh-100) and horizontally.
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        {/* Spinner Icon */}
        <FaSpinner
          // Primary text color, margin bottom.
          className="text-primary mb-3"
          // Large icon size.
          size={60}
          // Inline style to explicitly set the spin animation (in case external CSS fails).
          style={{ animation: "spin 2s linear infinite" }}
        />
        {/* Loading text message. */}
        <p className="lead text-muted">Loading your order history...</p>
      </div>
    );
  }
  // --- Conditional Rendering for Error State ---
  // Check if there is an error.
  if (error) {
    // Return a centered error alert box.
    return (
      // Container with vertical padding.
      <div className="container py-5">
        {/* Bootstrap danger alert with shadow and centered text. */}
        <div className="alert alert-danger text-center shadow-sm" role="alert">
          {/* Prominent heading for the error. */}
          <h4 className="alert-heading">Oops, something went wrong!</h4>
          {/* Display the specific error message. */}
          <p>{error}</p>
        </div>
      </div>
    );
  }
  // --- Conditional Rendering for Empty State ---
  // Check if orders list is empty or null.
  if (!orders || orders.length === 0) {
    // Return a full-screen, centered "No Orders Found" message.
    return (
      // Full-screen centered container.
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        {/* History Icon */}
        <FaHistory size={80} className="text-secondary mb-4" />
        {/* Main empty state heading. */}
        <h2 className="fw-bold mb-2">No Orders Found</h2>
        {/* Informational paragraph, limited width. */}
        <p className="text-muted col-md-6 mb-4">
          It looks like you haven't placed any orders with us yet. Let's change
          that!
        </p>
        {/* Button to navigate to the products page. */}
        <Link
          // Target path.
          to="/products"
          // Large, primary button styling with rounded corners and shadow.
          className="btn btn-primary btn-lg rounded-pill shadow-sm"
        >
          {/* Shopping Bag icon with right margin. */}
          <FaShoppingBag className="me-2" />
          {/* Button text. */}
          Start Shopping Now
        </Link>
      </div>
    );
  }
  // --- Main Rendering Block (Orders Exist) ---
  return (
    // React Fragment to return multiple elements (main content and modal).
    <>
      {/* Main content of the page */}
      <div className="container py-5">
        {/* Toast message display (appears at the top/bottom of the page). */}
        {message && (
          // Dynamic class styling based on the message content (success or danger).
          <div
            className={`toast-message ${
              message.includes("successfully") ? "success" : "danger"
            }`}
          >
            {/* Display the temporary message text. */}
            {message}
          </div>
        )}
        {/* Page Header */}
        <div className="mb-4 text-center">
          {/* Main title of the page. */}
          <h1 className="fw-bold mb-2 text-primary">Your Order History</h1>
          {/* Subtitle/tagline. */}
          <p className="lead text-muted">
            Review your past purchases and track your deliveries.
          </p>
        </div>
        {/* Grid for Order Cards */}
        <div className="row g-4 justify-content-center">
          {/* Map through each order in the state. */}
          {orders.map((order) => (
            // Grid column for the order card (takes 12/10/8 columns responsively).
            <div className="col-12 col-md-10 col-lg-8" key={order.id}>
              {/* Order Card */}
              <div
                // Card styling with shadow, no border, rounded corners, and hidden overflow.
                className="card shadow-lg border-0 h-100 rounded-4 overflow-hidden"
                // Inline style for transition effects (for hover/interaction).
                style={{
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                {/* Card content area. */}
                <div className="card-body p-4">
                  {/* Header Row (Order ID, Date, Total, Status) */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    {/* Left side: ID and Date */}
                    <div>
                      {/* Order ID display. */}
                      <h5 className="fw-bold text-uppercase text-secondary mb-1">
                        Order #{order.id}
                      </h5>
                      {/* Date container. */}
                      <div className="d-flex align-items-center">
                        {/* Calendar Icon */}
                        <FaCalendarAlt className="me-2 text-muted" />
                        {/* Formatted Date */}
                        <small className="text-muted">
                          {/* Uses date-fns to format the createdAt timestamp. */}
                          {format(new Date(order.createdAt), "MMMM d, yyyy")}
                        </small>
                      </div>
                    </div>
                    {/* Right side: Total Amount and Status */}
                    <div className="text-end">
                      {/* Total Amount display. */}
                      <h4 className="fw-bold text-success mb-0 d-flex align-items-center">
                        {/* Dollar Sign Icon */}
                        <FaRupeeSign size={20} className="me-3" />
                        {/* Total amount, parsed and fixed to 2 decimals. */}
                        {parseFloat(order.total_amount).toFixed(2)}
                      </h4>
                      {/* Status Badge */}
                      <span
                        // Dynamic badge class based on the order status (e.g., bg-success).
                        className={`badge rounded-pill text-uppercase mt-1 ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {/* Display the status text. */}
                        {order.status}
                      </span>
                    </div>
                  </div>
                  {/* Separator */}
                  <hr className="my-4" />
                  {/* Details Subheading */}
                  <h6 className="fw-bold text-secondary mb-3">
                    Order Details:
                  </h6>
                  {/* List Group for Order Items */}
                  <ul className="list-group list-group-flush border rounded-3 p-2">
                    {/* Check if items exist before mapping. */}
                    {order.items &&
                      // Map through each product item in the order.
                      order.items.map((item) => (
                        <li
                          // Unique key for the list item
                          key={item.id}
                          // Styling for the list item (flex, transparent background, no border).
                          className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-2"
                        >
                          {/* Left side: Image and Name */}
                          <div className="d-flex align-items-center">
                            {/* Product Image */}
                            <img
                              // Source URL with safe optional chaining for product.
                              src={
                                item.product?.image_url ||
                                `https://placehold.co/400x400?text=${item.product.name}`
                              }
                              // Alt text with safe optional chaining.
                              alt={item.product?.name || "Product image"}
                              // Image styling classes.
                              className="img-fluid rounded-3 me-3"
                              // Inline style for fixed size and object fit.
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                            {/* Product Name */}
                            <span className="fw-medium">
                              {/* Display product name with safe optional chaining. */}
                              {item.product?.name || "Unknown Product"}
                            </span>
                          </div>
                          {/* Right side: Quantity Badge */}
                          <span className="badge bg-light text-dark rounded-pill border py-2 px-3">
                            {/* Display Quantity. */}
                            Qty: {item.quantity}
                          </span>
                        </li>
                      ))}
                  </ul>
                  {/* Button Section for Cancel Order */}
                  <div className="d-grid mt-4">
                    {/* Cancel Button */}
                    {order.status.toLowerCase() !== "canceled" && (
                      <button
                        // Danger outline button styling.
                        className="btn btn-outline-danger btn-lg rounded-pill"
                        style={{
                          width: "auto",
                          display: "inline-block",
                          marginTop: "8px",
                        }}
                        // Click handler calls modal opener, passing the current order's ID.
                        onClick={() => handleOpenModal(order.id)}
                      >
                        {/* Trash icon with right margin. */}
                        <FaTrashAlt className="me-2" />
                        {/* Button text. */}
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* The new professional modal component */}
      {/* Renders the modal only if showModal state is true. */}
      {showModal && (
        // Full-screen overlay for the modal background.
        <div className="modal-overlay">
          {/* The centered modal content box. */}
          <div className="modal-content-pro">
            {/* Warning Icon */}
            <FaExclamationCircle className="modal-icon" />
            {/* Modal Heading */}
            <h4 className="fw-bold">Confirm Deletion</h4>
            {/* Warning Message */}
            <p className="text-muted">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            {/* Button Group */}
            <div className="modal-buttons">
              {/* Cancel Button (Closes modal without action) */}
              <button
                // Outline secondary button styling.
                className="btn btn-outline-secondary rounded-pill"
                // Calls the function to close the modal.
                onClick={cancelDelete}
              >
                Cancel
              </button>
              {/* Delete/Confirm Button (Triggers API call) */}
              <button
                // Danger (red) button styling.
                className="btn btn-danger rounded-pill"
                // Calls the function to perform the delete action.
                onClick={confirmDelete}
              >
                {/* Trash Icon */}
                <FaTrashAlt className="me-2" />
                {/* Button text. */}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// Export the component for use in the application router.
export default OrderPage;
