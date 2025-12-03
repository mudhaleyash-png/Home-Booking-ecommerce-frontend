/**
 * @fileoverview Defines the Hero component, which serves as a prominent
 * introductory section featuring a title, tagline, and a functional search bar.
 * This component relies on external libraries like react-icons, react-router-dom,
 * and external Bootstrap/CSS imports.
 */
// Import the core React library for building the component.
import React from "react";
// Import the specific search icon (FaSearch) from the Font Awesome icon library.
import { FaSearch } from "react-icons/fa";
// Import the Link component from React Router for navigation without full page reloads.
import { Link } from "react-router-dom";
// Import the necessary external CSS file for Bootstrap styling.
// import "bootstrap/dist/css/bootstrap.min.css";
// Import a local stylesheet specific to the product page/layout.
import "../../styles/ProductsPage.css"; // Use the same stylesheet
/**
 * Defines the functional component 'Hero'.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.searchTerm - The current value of the search input, managed by the parent.
 * @param {Function} props.setSearchTerm - The function to update the search term state in the parent.
 */
const ProductHero = ({ searchTerm, setSearchTerm }) => {
  /**
   * Event handler for the search input's change event.
   * It is responsible for lifting the input state up to the parent component.
   * @param {Object} e - The React synthetic event object.
   */
  const handleSearchChange = (e) => {
    // Calls the setter function from the parent, passing the new value from the input field.
    setSearchTerm(e.target.value);
  };
  // Returns the JSX structure for the Hero section.
  return (
    // <header> semantic tag used for introductory content.
    // Class Breakdown:
    // - hero-section: Custom class from ProductPage.css for background image/color and height.
    // - text-center: Centers all inline content.
    // - text-white: Sets text color to white.
    // - py-5: Adds padding vertically (top and bottom) using Bootstrap's spacing utility.
    // - mb-4: Adds margin at the bottom using Bootstrap.
    <header className="hero-section text-center text-white py-5 mb-4">
      {/* Bootstrap container for standard centered content width. */}
      <div className="container">
        {/* Main Title */}
        <h1 className="display-3 fw-bold animate__animated animate__fadeInDown">
          {/* display-3: Large, prominent Bootstrap heading size. */}
          {/* fw-bold: Font weight bold. */}
          {/* animate__animated animate__fadeInDown: Classes from the external 'animate.css' library for animation effects. */}
          Browse Fresh Groceries
        </h1>
        {/* Tagline / Subtitle */}
        <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
          {/* lead: Bootstrap class to make the text stand out slightly. */}
          {/* animate__delay-1s: Delays the animation start by 1 second. */}
          Everything you need, just a click away
        </p>
        {/* Search Bar Wrapper */}
        <div className="search-bar mt-4 animate__animated animate__fadeIn animate__delay-2s">
          {/* Input Group: Bootstrap utility for combining form controls and accompanying elements (like the icon). */}
          <div className="input-group mx-auto" style={{ maxWidth: "600px" }}>
            {/* Input Group Text: The span wrapping the search icon. */}
            <span className="input-group-text">
              {/* Renders the search icon from react-icons/fa. */}
              <FaSearch />
            </span>
            {/* The main search input field. */}
            <input
              type="text"
              className="form-control" // Bootstrap class for form input styling.
              placeholder="Search for products..."
              // Controlled input: Its value is tied directly to the parent's state.
              value={searchTerm}
              // Calls the local handler which updates the parent's state on every key stroke.
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
// Exports the component for use in other parts of the React application.
export default ProductHero;
