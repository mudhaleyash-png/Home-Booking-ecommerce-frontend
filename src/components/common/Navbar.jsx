// Import Statements
// ================================
// `React` must always be imported when using JSX,
// because JSX is converted to React.createElement() behind the scenes.
import React, { useContext, useEffect, useRef } from "react";
// Here we also import three React hooks:
// - useContext: allows us to use values from React's Context API.
// - useEffect: lets us run side effects (like event listeners or API calls) after rendering.
// - useRef: lets us create a "reference" (like a pointer) to directly access/manipulate DOM elements.
// `Link` is a component from react-router-dom.
// It replaces <a> tags when navigating between routes inside a React app
// (so the page does NOT reload, only updates the component).
import { Link } from "react-router-dom";
// Importing AuthContext, which is a React Context created separately.
// This stores authentication-related data (like currentUser and logout function)
// so multiple components can access it without prop drilling.
import AuthContext from "../../context/AuthContext";


// Importing icons from react-icons library.
// Each icon is a React component that renders an SVG.
import {
  FaShoppingCart,  // Cart icon
  FaUser,          // User/person icon
  FaHistory,       // History/clock icon
  FaSignOutAlt,    // Logout icon
  FaPlusSquare,    // Add (+) icon
} from "react-icons/fa";
// Importing custom CSS file for navbar-specific styles and animations.
import "../../styles/Navbar.css"

const email ="yash@gmail.com"
// ================================
// Navbar Component
// ================================
// Define a functional component `Navbar`.
// In React, a function that returns JSX is a functional component.
const Navbar = () => {
  // useContext hook:
  // We extract `currentUser` and `logout` from AuthContext.
  // - currentUser stores the logged-in user’s details.
  // - logout is a function that clears authentication and logs the user out.
  const { currentUser, logoutAuth } = useContext(AuthContext);
  // useRef hook:
  // Creates a reference object (`navRef`) that points to a DOM element.
  // Initially, navRef.current = null. Later, it will point to the <nav> element.
  const navRef = useRef(null);
  // useEffect hook:
  // Runs after the component is rendered (mounted).
  // Dependency array [] means: run this only once.
  useEffect(() => {
    // Get the DOM element (the <nav>) from navRef.
    const navElement = navRef.current;
    // If navElement does not exist yet (like during initial render), stop here.
    if (!navElement) return;
    // Define an event handler for mouse movement inside navbar.
    const handleMouseMove = (e) => {
      // Get position and size of navbar relative to viewport.
      const rect = navElement.getBoundingClientRect();
      // Calculate x position of mouse inside navbar:
      // e.clientX = mouse x position in viewport.
      // rect.left = navbar’s left boundary.
      // Subtracting gives mouse position relative to navbar only.
      const x = e.clientX - rect.left;
      // Set CSS custom property (--x) on navbar.
      // This value will be used in CSS animations for glow effect.
      navElement.style.setProperty("--x", `${x}px`);
    };
    // Add mousemove event listener to navbar.
    navElement.addEventListener("mousemove", handleMouseMove);
    // Cleanup function:
    // Runs when component unmounts (removed from UI).
    // Removes event listener to prevent memory leaks.
    return () => {
      navElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty array → run only once.
  // ================================
  // JSX Render (Return Statement)
  // ================================
  return (
    // <nav> element is the container for the whole navbar.
    // ref={navRef} → connects nav element to navRef for DOM access.
    <nav
      ref={navRef}
      // Bootstrap classes:
      // - navbar: makes it a Bootstrap navbar.
      // - navbar-expand-lg: expands fully on large screens, collapses on small.
      // - navbar-dark-pro: custom dark theme class (from Navbar.css).
      // - shadow-sm: small box-shadow.
      // - animate__fadeInDown: animation effect.
      // - fixed-top: sticks navbar to top of page.
      className="navbar navbar-expand-lg navbar-dark-pro shadow-sm animate__fadeInDown fixed-top"
    >
      {/* Div for glowing effect background (CSS uses --x variable for glow animation). */}
      <div className="navbar-glow"></div>
      {/* Container for navbar content (fluid = full width). */}
      <div className="container-fluid">
        {/* Brand/Logo → navigates to home page ("/Home"). */}
        <Link className="navbar-brand fw-bold brand-link text-font" to="/Home">
          E-Commerce
        </Link>
        {/* Button for mobile toggle (hamburger menu).
            Appears only on smaller screens. */}
        <button
          className="navbar-toggler"        // Bootstrap toggler button class
          type="button"                     // HTML button type
          data-bs-toggle="collapse"         // Tells Bootstrap: toggles collapse effect
          data-bs-target="#navbarNav"       // Specifies which element collapses/expands
          aria-controls="navbarNav"         // Accessibility: element being controlled
          aria-expanded="false"             // Accessibility: initial collapsed state
          aria-label="Toggle navigation"    // Accessibility: description for screen readers
        >
          {/* Icon inside button (three lines icon). */}
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Collapsible menu content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Unordered list of navigation items.
              ms-auto → pushes items to right side of navbar. */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Always visible Products link */}
            <li className="nav-item">
              <Link className="nav-link nav-link-pro text-font" to="/products">
                Products
              </Link>
            </li>
            {/* Conditional Rendering:
                If user is logged in (currentUser exists), show logged-in menu.
                Else, show login/register buttons. */}
            {currentUser ? (
              <>
                {/* Check if current user is admin (email === "sanu@gmail.com").
                    If yes, show "Add Product" link. */}
                {currentUser.email === email && (
                  <li className="nav-item">
                    <Link
                      className="nav-link nav-link-pro d-flex align-items-center text-font"
                      to="/create-list"
                    >
                      <FaPlusSquare className="me-2 icon-pro" /> Product List
                    </Link>
                  </li>
                )}
                {/* Cart link */}
                <li className="nav-item">
                  <Link
                    className="nav-link nav-link-pro d-flex align-items-center text-font"
                    to="/carts"
                  >
                    <FaShoppingCart className="me-2 icon-pro" /> Cart
                  </Link>
                </li>
                {/* Order history link */}
                <li className="nav-item">
                  <Link
                    className="nav-link nav-link-pro d-flex align-items-center text-font"
                    to="/order-history"
                  >
                    <FaHistory className="me-2 icon-pro" /> Orders
                  </Link>
                </li>
                {/* User dropdown menu */}
                <li className="nav-item dropdown">
                  {/* Dropdown toggle link (click to expand). */}
                  <a
                    className="nav-link nav-link-pro dropdown-toggle d-flex align-items-center text-font"
                    href="#"                // Dummy link (required for dropdown)
                    id="navbarDropdown"     // ID to match aria-labelledby
                    role="button"           // Role for accessibility
                    data-bs-toggle="dropdown" // Bootstrap JS makes it dropdown
                    aria-expanded="false"   // Default collapsed
                  >
                    <FaUser className="me-2 icon-pro" /> Hello,{" "}
                    {currentUser.email}   {/* Shows user’s email */}
                  </a>
                  {/* Dropdown menu items */}
                  <ul
                    className="dropdown-menu dropdown-menu-end dropdown-menu-pro"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      {/* Profile link */}
                      <Link
                        className="dropdown-item dropdown-item-pro text-font"
                        to="/profile"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      {/* Divider line inside dropdown */}
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      {/* Logout button */}
                      <button
                        className="dropdown-item dropdown-item-pro text-danger text-font"
                        onClick={logoutAuth}   // Calls logout function from AuthContext
                      >
                        <FaSignOutAlt className="me-2 icon-pro" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // If user not logged in → show Login and Register buttons.
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light nav-btn-pro me-2 text-font"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-primary nav-btn-pro text-font"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Export Navbar component so it can be imported in other files.
export default Navbar;
