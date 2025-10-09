/* 
* @fileoverview ProductCard Component
 *
 * This functional component displays a single product item with dynamic features
 * like hover effects, conditional badges, and stock information.
 * It is designed to work within a grid or carousel layout.
 */
// Import the core React library.
import React, {
    // useState: Hook for adding state to track hover status.
    useState
} from "react";
// Import Link component for routing to the product details page.
import {
    // Link: Used for client-side navigation.
    Link
} from "react-router-dom";
/**
 * Defines the ProductCard functional component.
 * @param {object} props - The component properties.
 * @param {object} props.product - The product data object to display.
 * @param {function} props.handleAddToCart - Callback function to add the product to the cart.
 * @param {boolean} [props.isFeatured=false] - Flag to apply featured styling/logic.
 * @returns {JSX.Element} The rendered product card.
 */
const ProductCard = ({
    // Destructure the product data object from props.
    product,
    // Destructure the function to add to cart.
    handleAddToCart,
    // Destructure the optional feature flag, defaulting to false.
    isFeatured = false
}) => {
    // State hook to track if the mouse is currently hovering over the card.
    const [isHovered, setIsHovered] = useState(false);
    /**
     * Logic to determine the product image URL.
     * Uses the product's image_url if it exists and is not empty.
     * Otherwise, generates a placeholder image URL with the product name.
     */
    const imageUrl =
        // Check if the image_url exists on the product object.
        product.image_url &&
        // Check if the trimmed string is not empty.
        product.image_url.trim() !== ""
        // If true, use the product's URL.
        ? product.image_url
        // If false, construct a placeholder URL using the product name.
        : `https://placehold.co/400x400?text=${product.name}`;
    /**
     * Logic to format the price string.
     * Ensures the price is a valid number and formats it to two decimal places.
     */
    const formattedPrice =
        // Check if the price can be parsed as a number (returns true if it's a number).
        !isNaN(parseFloat(product.price))
        // If it's a valid number: prepend '$', parse as float, fix to 2 decimals.
        ? `$${parseFloat(product.price).toFixed(2)}`
        // If not a valid number, display a generic message.
        : "Price not available";
    // Initialize variable to hold the content and style type for the badge.
    let badgeContent = null;
    // Conditional logic: only run if the product is featured AND has stock.
    if (isFeatured && product.stock != 0) {
        // Sub-condition 1: If stock is low (less than 5 but greater than 0).
        if (product.stock < 5 && product.stock > 0) {
            // Set badge content to "Limited Stock" with danger (red) styling.
            badgeContent = { text: "Limited Stock", type: "danger" };
        // Sub-condition 2: If the price is high (over 2000).
        } else if (product.price > 2000) {
            // Set badge content to "Top Seller" with warning (yellow) styling.
            badgeContent = { text: "Top Seller", type: "warning" };
        // Sub-condition 3: Default badge for all other featured, in-stock items.
        } else {
            // Set badge content to "New" with primary (blue) styling.
            badgeContent = { text: "New", type: "primary" };
        }
    }
    // Return the JSX structure for the product card.
    return (
        // Main container div for the product card.
        <div
            // Dynamic Bootstrap classes: 'card' base, 'h-100' for full height, 'shadow-sm' for light shadow.
            // 'position-relative' is needed for absolute positioning of the badge/quick look.
            // Conditional class: applies a 'border-primary' if the card is featured.
            className={`card h-100 shadow-sm position-relative ${isFeatured ? "border-primary" : ""}`}
            // Event handler: sets 'isHovered' state to true when the mouse enters.
            onMouseEnter={() => setIsHovered(true)}
            // Event handler: sets 'isHovered' state to false when the mouse leaves.
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Comment indicating the Badge section. */}
            {/* Badge */}
            {/* // Conditional rendering: show badge only if it's featured AND badgeContent exists. */}
            {isFeatured && badgeContent && (
                // Span element for the badge.
                <span
                    // Dynamic Bootstrap classes for positioning (top-left) and styling (bg-color based on 'type').
                    className={`badge position-absolute top-0 start-0 m-2 bg-${badgeContent.type}`}
                >
                    {/* Display the badge text (e.g., "Limited Stock"). */}
                    {badgeContent.text}
                </span>
            )}
            {/* Comment indicating the Quick Look section. */}
            {/* Quick Look */}
            {/* // Conditional rendering: show link only if it's featured AND the mouse is hovering. */}
            {isFeatured && isHovered && (
                // Link component for navigation.
                <Link
                    // Sets the destination URL to the product detail page.
                    to={`/products/${product.id}`}
                    // Dynamic Bootstrap classes for positioning (top-right), button style, and small shadow.
                    className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light shadow-sm"
                >
                    {/* Unicode for an eye icon. */}
                    :eye:
                    {/* Text for the quick look action. */}
                    Quick Look
                </Link>
            )}
            {/* Comment indicating the Image section. */}
            {/* Image */}
            {/* // Bootstrap wrapper for ensuring the image maintains a 1:1 aspect ratio. */}
            <div className="ratio ratio-1x1">
                {/* // Image element. */}
                <img
                    // Sets the source URL determined by the logic above.
                    src={imageUrl}
                    // Bootstrap class for card image at the top.
                    className="card-img-top object-fit-cover"
                    // Alt text for accessibility.
                    alt={product.name}
                />
            </div>
            {/* Comment indicating the Body section. */}
            {/* Body */}
            {/* // Card body container. 'd-flex flex-column' ensures content stacks vertically. */}
            <div className="card-body d-flex flex-column">
                {/* // Main product title, bolded. */}
                <h5 className="card-title fw-bold">{product.name}</h5>
                {/* // Product description, muted text, 'flex-grow-1' makes it fill available space. */}
                <p className="card-text text-muted flex-grow-1">{product.description}</p>
                {/* // Price display, large font size (fs-5), bold, and primary color. */}
                <p className="card-text fs-5 fw-bold text-primary">{formattedPrice}</p>
            </div>
            {/* Comment indicating the Footer section. */}
            {/* Footer */}
            {/* // Card footer container, light background, flexible layout for button arrangement. */}
            <div className="card-footer bg-white d-flex flex-column flex-sm-row justify-content-between gap-2">
                {/* // Link to View Details button. */}
                <Link
                    // Sets the destination URL.
                    to={`/products/${product.id}`}
                    // Button styling: outline secondary, full width by default, auto width on small screens and up.
                    className="btn btn-outline-secondary w-100 w-sm-auto"
                >
                    {/* Button text. */}
                    View Details
                </Link>
                {/* // Conditional rendering based on stock level. */}
                {product.stock > 0 ? (
                    // Button for Add to Cart (if stock is positive).
                    <button
                        // Primary button styling. Centers content and sets responsive width.
                        className="btn btn-primary d-flex align-items-center justify-content-center w-100 w-sm-auto"
                        // Click handler calls the passed-in function with the product ID.
                        onClick={() => handleAddToCart(product.id)}
                    >
                        {/* Unicode for a shopping cart icon. */}
                        :shopping_trolley:
                        {/* Button text. */}
                        Add to Cart
                    </button>
                ) : (
                    // Span for Out of Stock message (if stock is 0 or less).
                    <span className="badge bg-danger text-white p-2 text-center w-100 w-sm-auto">
                        {/* Unicode for a box icon. */}
                        :package:
                        {/* Status text. */}
                        Out of Stock
                    </span>
                )}
            </div>
        </div>
    );
};
// Export the component for use in other parts of the application.
export default ProductCard;