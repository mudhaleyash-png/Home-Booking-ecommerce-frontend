/**
 * @fileoverview A component that renders a horizontal, scrollable list (carousel) of ProductCard components.
 * This is typically used for displaying featured items, recommendations, or a subset of the catalog.
 */
// Import the core React library.
import React from "react";
// Import the ProductCard component, which is the reusable UI element for each product.
import ProductCard from "./ProductCard";
// Import Bootstrap CSS for base styling and utility classes.
// import "bootstrap/dist/css/bootstrap.min.css";
// Import custom CSS for specific carousel styling (e.g., controlling item width, scroll behavior).
import "../../styles/ProductsPage.css";
/**
 * Defines the functional component 'ProductCarousel'.
 * @param {Array<Object>} products - The list of product objects to display.
 * @param {Function} handleAddToCart - The function to call when a user clicks the 'Add to Cart' button.
 */
const ProductCarousel = ({ products, handleAddToCart }) => {
  // Returns the JSX structure for the carousel.
  return (
    // Main container for the carousel layout.
    <div className="product-carousel-container">
      {/* This is the key layout element for the horizontal scroll:
              - d-flex: enables flexbox layout.
              - flex-nowrap: prevents items from wrapping to the next line, forcing horizontal layout.
              - overflow-auto: enables horizontal scrolling if content exceeds container width.
              - py-3: adds vertical padding (padding-top and padding-bottom).
            */}
      <div className="d-flex flex-nowrap overflow-auto py-3">
        {/* Maps over the array of products to render a ProductCard for each item.
         */}
        {products.map((newproduct) => (
          // Outer container for each product card in the carousel.
          <div
            key={newproduct.id}
            // flex-shrink-0: ensures the item does not shrink (crucial for scrollable lists).
            // me-3: adds margin to the end (right) of the item for spacing.
            className="product-carousel-item flex-shrink-0 me-3"
          >
            <ProductCard
              // Passes the individual product data object.
              product={newproduct}
              // Passes the function for adding the product to the cart.
              handleAddToCart={handleAddToCart}
              // Explicitly sets the product as featured, enabling the special badge and hover effects in ProductCard.
              isFeatured={true} // Add this prop
            />
          </div>
        ))}
      </div>
    </div>
  );
};
// Exports the component for use in other parts of the application.
export default ProductCarousel;
