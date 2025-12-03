// src/context/AuthContext.jsx
// This context manages the global authentication state for our application.
// It provides the current user data and functions to log in, log out, and register.
import React, { createContext, useState, useEffect, useRef } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// import authService from '../services/auth.service';
// Why we use createContext:
// React Context provides a way to pass data through the component tree
// without having to pass props down manually at every level. This is
// perfect for global state like authentication.
const AuthContext = createContext();
// Why we use AuthProvider:
// The provider component wraps our entire application or a part of it,
// making the authentication state available to all nested components.

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // Why we use useEffect:
  // We use the effect hook to check for a logged-in user whenever the
  // component mounts. This ensures that if the page is refreshed, the
  // user's session is restored from local storage.
  // Use a ref to store the timeout ID to clear it later.
  // useRef is used here because we need a mutable variable that does NOT trigger a re-render when changed.
  const logoutTimer = useRef(null);
  // Get the navigate function from React Router for redirection.
  const navigate = useNavigate(); // Get the navigate function
  // Function to handle logout and clear the timer
  /**
   * Defines the central logout logic: clears session data and the auto-logout timer.
   */
  const handleLogout = () => {
    // Calls the service function to clean up local storage (e.g., removing tokens).
    authService.logout();
    // Clears the user state, effectively logging the user out in the UI.
    setCurrentUser(null);
    // Checks if a timer is currently set.
    if (logoutTimer.current) {
      // Clears the scheduled timeout to prevent unexpected execution.
      clearTimeout(logoutTimer.current);
    }
    // Programmatically redirects the user to the login page.
    navigate("/login"); // Redirect to the login page
  };
  /**
   * useEffect hook runs once on mount to check for an existing session and set up the auto-logout timer.
   */
  useEffect(() => {
    // Retrieve the raw access token string from local storage.
    const accessToken = localStorage.getItem("accessToken");
    // Retrieve the user data object from local storage.
    const user = JSON.parse(localStorage.getItem("user"));
    // Check for both user data and a valid access token
    // This conditional ensures a session exists before proceeding with validation.
    if (user && user.token && accessToken) {
      try {
        // Decode the JWT to access the payload claims (synchronous operation).
        const decodedToken = jwtDecode(accessToken);
        // Calculate the current time in seconds (standard format for JWT 'exp' claim).
        const currentTime = Date.now() / 1000; // current time in seconds
        // Check if the token is already expired
        // Compares the token's expiration timestamp ('exp') with the current time.
        if (decodedToken.exp < currentTime) {
          console.log("Token expired. Logging out...");
          // If expired, immediately execute the logout sequence.
          handleLogout();
        } else {
          // If the token is valid, set the user state.
          setCurrentUser(user);
          // Calculate the time remaining until expiration in milliseconds.
          const timeLeft = (decodedToken.exp - currentTime) * 1000;
          console.log(
            `Token expires in ${Math.round(timeLeft / 1000)} seconds.`
          );
          // Set a timeout to automatically log out the user
          // Schedule the 'handleLogout' function to run precisely when the token expires.
          logoutTimer.current = setTimeout(() => {
            console.log("Token expired. Logging out automatically.");
            handleLogout();
          }, timeLeft); // The delay is set to the calculated remaining time.
        }
      } catch (error) {
        // Handle malformed or invalid tokens (e.g., if jwtDecode fails).
        console.error("Invalid token. Logging out.", error);
        // If the token is invalid, force a logout to clear the bad session data.
        handleLogout();
      }
    } else {
      // If no token or user data is found, ensure the app state is clean (logged out).
      // This is a safety check for cold starts or manually cleared sessions.
      handleLogout();
    }
    // After the initial session check (successful or failed), stop the loading state.
    setLoading(false);
    // Cleanup function to clear the timer when the component unmounts
    return () => {
      // Ensure the timeout is cleared to prevent memory leaks or delayed execution.
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only ONCE on mount.
  // Register function that calls the service.
  const registerAuth = async (email, password_hash) => {
    await authService.register(email, password_hash);
  };

  // Login function that calls the service and updates state.
  const loginAuth = async (email, password_hash) => {
    const user = await authService.login(email, password_hash);
    setCurrentUser(user);
    return user;
  };
  // Logout function that calls the service and updates state.
  const logoutAuth = () => {
    authService.logout();
    setCurrentUser(null);
  };
  // userProfileUpdate = () => {};
  // The value object contains the state and functions we want to expose.
  const authProviderValue = {
    currentUser,
    loginAuth,
    logoutAuth,
    registerAuth,
    // userProfileUpdate,
  };
  // The provider makes the 'value' object available to its children.
  return (
    <AuthContext.Provider value={authProviderValue}>
      {/* if loading is true then children will not appear  */}
      {/* if loading is false then children will appear */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
