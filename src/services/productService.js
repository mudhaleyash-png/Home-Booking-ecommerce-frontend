// src/services/product.service.js
// This service is responsible for all API calls related to products.
// This line imports the Axios library. Axios is a popular JavaScript library for
// making HTTP requests from a browser or Node.js.
import axios from "axios";
// This line defines the base URL for the product API endpoints. Using a constant
// makes the code easier to maintain, as the URL can be changed in just one place.
const API_URL = "http://localhost:3000/api/products";
/**
 * @description: The `productService` object contains all the methods for
 * interacting with the product API. Defining the methods directly within this object
 * is a common and clean way to structure a service layer.
 */
const productService = {
  // component or object define kela
  /**
   * @description Fetches all products from the backend API.
   * @returns {Promise<Array>} A promise that resolves to an array of product objects.
   */
  // This is an anonymous arrow function that is a property of the `productService` object.
  // It's a cleaner way to define the method compared to creating a separate constant.
  getAllProducts: async () => {
    try {
      // `axios.get()` sends an HTTP GET request to the specified URL.
      const response = await axios.get(`${API_URL}/all`);
      // Axios automatically parses JSON, so `response.data` contains the parsed data.
      //response.data={success:true, message:successfully, products[{}]}
      return response.data.products;
    } catch (error) {
      // Error handling for the request. The error is logged and then re-thrown
      // so it can be handled by the component that called this function.
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * @description Fetches a single product by its ID from the backend API.
   * @param {string} productId - The unique ID of the product.
   * @returns {Promise<Object>} A promise that resolves to a single product object.
   */
  getProductById: async (productId) => {
    try {
      // The product ID is added to the URL path for the request.
      const response = await axios.get(`${API_URL}/${productId}`);
      return response.data.product;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },

  /**
   * @description Creates a new product on the backend.
   * @param {Object} productData - The data for the new product (e.g., name, description).
   * @param {string} token - The user's JWT for authentication.
   * @returns {Promise<Object>} A promise that resolves to the newly created product.
   */
  createProduct: async (productData, token) => {
    try {
      // The `config` object holds request settings, like headers.
      const config = {
        headers: {
          // This header specifies that we are sending JSON data in the request body.
          "Content-Type": "application/json",
          // The `Authorization` header with a "Bearer" token is the standard
          // way to send a JSON Web Token for authentication.
          Authorization: `Bearer ${token}`,
        },
      };
      // `axios.post()` sends an HTTP POST request to create a new resource.
      // It takes the URL, the data to send, and the configuration as arguments.  becuse of use of axios(goes in json format and output in javascript fromat)
      const response = await axios.post(
        `${API_URL}/create`,
        productData,
        config
      );
      return response.data.product;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  },
  /**
   * @description Updates an existing product on the backend.
   * @param {number} id - The ID of the product to update.
   * @param {object} updatedData - The data to update the product with.
   * @param {string} token - The user's JWT for authentication.
   * @returns {object} The updated product object.
   */
  updateProduct: async (id, updatedData, token) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // `axios.put()` sends an HTTP PUT request, typically used to update a resource.
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData, config);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },
  /**
   * @description Deletes a product from the backend.
   * @param {number} id - The ID of the product to delete.
   * @param {string} token - The user's JWT for authentication.
   * @returns {object} The response from the backend.
   */
  deleteProduct: async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // `axios.delete()` sends an HTTP DELETE request.
      const response = await axios.delete(`${API_URL}/delete/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};
// This line exports the `productService` object, making it available for other files
// to import and use. This is the final step in creating a reusable service module.
export default productService;