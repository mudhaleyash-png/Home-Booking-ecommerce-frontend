// src/components/common/Footer.jsx
// This component renders a consistent footer at the bottom of every page.
import React from 'react';
// Why a footer is important:
// A footer provides a professional and consistent look across all pages of your application.
// It's a standard practice for web development.
const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="container p-4">
        <div className="text-center p-3">
          &copy; {new Date().getFullYear()} E-commerce App
        </div>
      </div>
    </footer>
  );
};
export default Footer;