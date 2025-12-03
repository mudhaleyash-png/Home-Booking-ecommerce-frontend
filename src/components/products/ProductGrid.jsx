/**
 * @fileoverview Component responsible for rendering a list of products in a responsive grid layout.
 * It handles checking for empty product lists and rendering ProductCard components for each item.
 */
// Import the core React library.
import React from "react";
// Import the ProductCard component, which handles the display of individual product details.
import ProductCard from "./ProductCard";
/**
 * Defines the functional component 'ProductGrid'.
 * @param {Array<Object>} products - The list of product objects to render in the grid.
 * @param {Function} handleMessage - A function (likely for showing alerts/notifications, though unused here).
 * @param {Function} handleAddToCart - The callback function for when a user adds a product to the cart.
 */
const ProductGrid = ({ products, handleMessage, handleAddToCart }) => {
  // Professional Debugging: Logs the product array received for tracing data flow.
  console.log("ProductGrid received products:", products);
  // Conditional Rendering Check: Guards against null or empty product lists.
  if (!products || products.length === 0) {
    // Logs a message when no products are available.
    console.log("No products to map.");
    // Returns null, meaning the component renders nothing if the data is missing or empty.
    return null; // Or a placeholder message if desired
  }
  // Returns the JSX structure for the product grid.
  return (
    // Main container (using Bootstrap/Tailwind container class for centered width).
    <div className="container product-grid-container">
      {/* Responsive Grid Row:
        - row: Standard row class for flex-wrapping children.
        - g-4: Sets a gutter (gap) of 4 units between columns and rows.
      */}
      <div className="row g-4">
        {/* Maps over the 'products' array to render a column/card for each product. */}
        {products.map((newproduct) => {
          // Debugging: Logs the ID of the product currently being rendered (useful for large lists).
          console.log("Rendering product:", newproduct.id);
          return (
            // Column Wrapper for Responsiveness:
            // - key: The unique identifier required by React for list performance and stability.
            // - col-lg-4: Takes 4 columns out of 12 on large screens (3 products per row).
            // - col-md-6: Takes 6 columns out of 12 on medium screens (2 products per row).
            // - col-sm-12: Takes 12 columns out of 12 on small screens (1 product per row).
            <div key={newproduct.id} className="col-lg-4 col-md-6 col-sm-12">
              {/* Renders the individual ProductCard component */}
              <ProductCard
                // Passes the entire product object to the card.
                product={newproduct}
                // Passes the cart handler function down to the card's button.
                handleAddToCart={handleAddToCart}
                // Note: 'isFeatured' prop defaults to false in ProductCard, so it's omitted here.
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
// Exports the component for use in parent components (e.g., a ProductsPage).
export default ProductGrid;
