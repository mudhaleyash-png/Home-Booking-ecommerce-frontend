// src/context/AuthContext.jsx
// This context manages the global authentication state for our application.
// It provides the current user data and functions to log in, log out, and register.
import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

// import authService from '../services/auth.service';
// Why we use createContext:
// React Context provides a way to pass data through the component tree
// without having to pass props[prop drilling](properties) down manually at every level. This is
// perfect for global state like authentication.
const AuthContext = createContext();

// Why we use AuthProvider:
// The provider component wraps our entire application or a part of it,
// making the authentication state available to all nested components.


//const 


//export default Authprovider;

export const AuthProvider = ({ children }) => {  //children parameter madhe recieve krun ghetle
    const [currentUser, setCurrentUser] = useState(null);
    
    const [loading, setLoading] = useState(false);
    
    // Why we use useEffect:
  // We use the effect hook to check for a logged-in user whenever the
  // component mounts. This ensures that if the page is refreshed, the
  // user's session is restored from local storage.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      setCurrentUser(user);
    } else {
      // Token present but no user data (e.g cleared localStorage partially)
      authService.logout();
    }
    setLoading(false);
  }, []);

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
    // The value object contains the state and functions we want to expose.
    const authProvidervalue = {
        currentUser,
        loginAuth,
        logoutAuth,
        registerAuth,
        loading,
    };
    // The provider makes the 'value' object available to its children.
    return (
        <AuthContext.Provider value={authProvidervalue}>

            {/* if loading is true then children(registerpage, loginpage, homepage) will not appear */}
            {/* if loading is false then the children will appear */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
export default AuthContext;
