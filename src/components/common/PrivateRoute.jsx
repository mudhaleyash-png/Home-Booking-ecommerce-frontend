import React from 'react';
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ children }) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('accessToken');
    // Check for token existence and validity
    // You can add more robust checks here (e.g., JWT expiration check)
    if (!token) {
        // If no token exists, redirect to the login page
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default PrivateRoute;