// This component serves as the main landing page for the application.
// It displays a hero section and a list of featured products fetched from an API.
// Import necessary React hooks and components from third-party libraries.
// `useState` is used for managing component state (e.g., products, loading status).
// `useEffect` is used for performing side effects, such as fetching data after the component renders.

import React, { useState, useEffect } from 'react';
// `Link` is a component from `react-router-dom` used for declarative navigation within the app.
import { Link } from 'react-router-dom';
// This imports the Bootstrap CSS file to apply its styling classes.
import "bootstrap/dist/css/bootstrap.min.css";
// These lines import specific icons from the `react-icons` library.
import { FaArrowRight, FaSpinner, FaChevronDown } from 'react-icons/fa';
// This imports the `productService` object, which contains functions for making API calls.
import productService from '../services/productService';
// This imports a custom CSS file specific to this component's styling.
import '../styles/HomePage.css';



/**
 * @description This component serves as the main landing page for the application.
 * @component
 * This version features an innovative, animated liquid background and advanced
 * interactive elements, with all styling contained in a separate CSS file.
 */
// This defines the `HomePage` functional component.
const HomePage = () => {
  // `useState` hook to manage the list of products. It's initialized as an empty array.
  const [products, setProducts] = useState([]); //to store a list of items  //(setProducts) updater, setter function   //products variable 
  // `useState` hook to manage the loading state. It's initialized as `true` because data starts loading as soon as the component mounts.//mount= visible
  const [loading, setLoading] = useState(true);
  // `useState` hook to manage any error messages. It's initialized as `null`.
  const [error, setError] = useState(null);
  
  // `useEffect` hook is used to fetch data from the API. The empty dependency array `[]`
  // ensures this effect runs only once after the initial render, like `componentDidMount`.
  
  // useEffect (() => {executable code}
  //useEffecy\t must have two arguments first is {} executable code and second is [] dependency array where we define is it dependent or not
  useEffect(() => {
    // This inner function is defined to handle the asynchronous data fetching logic.
    const fetchProducts = async () => {
      try {
        // Set `loading` to `true` to show the loading spinner.
        setLoading(true);
        // Call the `getAllProducts` function from the `productService` to fetch product data.
        const fetchedProducts = await productService.getAllProducts();
        // Update the `products` state with the fetched data.
        setProducts(fetchedProducts);
      } catch (err) {//(err) parameter
        // If an error occurs during fetching, log it to the console.
        console.error("Failed to fetch products:", err);
        // Update the `error` state with a user-friendly message.
        setError("Failed to load products. Please try again later.");
      } finally {
        // The `finally` block runs regardless of whether the `try` or `catch` block finished.
        // It sets `loading` to `false` to hide the loading indicator.
        setLoading(false);
      }
    };
    // Call the `fetchProducts` function to start the data fetching process.
    fetchProducts();
  }, []);
  
  // Conditional Rendering: If `loading` is true, this JSX is returned.
  // It displays a centered loading spinner and a message.
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-primary"> 
        <FaSpinner className="spinner-border mb-3" size={60} role="status" style={{ animation: 'spin 1s linear infinite' }} />
        <p className="lead text-muted">Loading your new shopping experience...</p>
      </div>
    );
  }
  
  // Conditional Rendering: If `error` is not null, this JSX is returned.
  // It displays a Bootstrap alert with the error message.
  if (error) {
    return (
      <div className="alert alert-danger text-center my-5 shadow-sm" role="alert">
        <h4 className="alert-heading">Uh-oh!</h4>
        <p>{error}</p>
      </div>
    );
  }
  
  // Main Component JSX: This is rendered when the data has been successfully loaded.
  return (
    <div>
      {/* Hero Section */}
      {/* This is the main header section with a full-screen height (`vh-100`) and a `hero-section` class for custom styling. */}
      <header className="hero-section d-flex align-items-center justify-content-center text-white text-center vh-100 w-100 position-relative">
        {/* A custom `div` for the animated liquid background. */}
        <div className="liquid-blob"></div>
        {/* A container for the hero content, with a high z-index to appear above the background. */}
        <div className="container py-5 position-relative z-index-1">
          {/* Main heading with Bootstrap classes and custom animation classes. */}
          <h1 className="display-1 fw-bold mb-4 animate__fadeInUp">
            Find Your Style. Discover Your Story.
          </h1>
          {/* A subheading with Bootstrap classes and custom animation classes. */}
          <p className="lead fw-light mt-3 mb-5 animate__fadeInUp animate__delay-1s">
            Explore a curated collection of premium products, designed for you.
          </p>
          {/* A `Link` component that navigates the user to the `/products` page when clicked. */}
          <Link to="/products" className="btn btn-light btn-lg rounded-pill shadow-lg animate__fadeInUp animate__delay-2s">
            Start Shopping <FaArrowRight className="ms-2" />
          </Link>
        </div>
        {/* A scroll indicator icon. */}
        <div className="scroll-indicator position-absolute bottom-0 mb-5 text-white">
          <FaChevronDown size={30} />
        </div>
      </header>
      {/* Featured Products Section */}
      {/* The main content area for featured products. */}
      <main className="container-fluid  py-5 main-section">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2 text-dark">Handpicked for You</h2>
          <p className="lead text-muted">A showcase of our most popular and loved products.</p>
        </div>
        {/* A responsive grid layout for the product cards. */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5 px-5">
          {/* We use `slice(0, 6)` to display only the first 6 products. */}
          {products.slice(0, 6).map((product, index) => (// returns a new object
            // A `div` for each product card in the grid. `key` is essential for React list rendering.
            <div key={product.id} className="col">
              {/* The card component with custom styling classes. */}
              <div
                className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden product-card product-card-animation"
                // This inline style sets a custom CSS variable for animation delays.
                style={{ '--animation-delay': `${index * 0.1}s` }}
              >
                {/* Image container with custom styling. */}
                <div className="product-card-img-container">
                  {/* The `img` tag. If `product.image_url` is not available, it uses a placeholder image. */}
                  <img src={product.image_url || `https://placehold.co/400x300?text=${product.name}`} className="card-img-top" alt={product.name} />
                </div>
                {/* The card body contains the product details and a link. */}
                <div className="card-body d-flex flex-column text-center p-4">
                  <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  {/* parseFloat is used to convert sting into a number to ensure it ia always a number */}
                  {/* and .toFixed(2) used for always show proper currency forat in 2 decimal */}
                  <p className="card-text fs-4 fw-bold text-primary mb-3">${parseFloat(product.price).toFixed(2)}</p>
                  {/* A `Link` to the individual product page. */}
                  <Link
                    to={`/products/${product.id}`}// to is used where to navigaate to
                    className="btn btn-outline-primary mt-auto rounded-pill fw-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Call-to-Action Section */}
      {/* A section to encourage users to explore more products. */}
      <section className="action-section text-white text-center py-5 my-5 shadow-sm">
        <div className="container">
          <h3 className="fw-bold mb-3">Ready to find more?</h3>
          <p className="lead mb-4">Our full catalog is waiting for you.</p>
          <Link to="/products" className="btn btn-light btn-lg rounded-pill shadow-sm">
            Explore All Products
          </Link>
        </div>
      </section>
    </div>
  );
};
// This line exports the `HomePage` component, making it available for use in the main application file.
export default HomePage;









