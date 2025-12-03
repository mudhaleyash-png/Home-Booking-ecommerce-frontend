import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// The base URL for the backend API.
const API_ACTUAL_CARTS_URL = `${API_BASE_URL}/cart`;
/**
 * @description This service handles all API calls related to the shopping cart.
 * It separates API logic from React components for cleaner, more maintainable code.
 * All functions here will handle adding, getting, updating, and deleting items from the cart.
 */
const cartService = {
  /**
   * @description Adds an item to the authenticated user's cart.
   * @param {number} productId The ID of the product to add.
   * @param {number} quantity The quantity of the product to add.
   * @returns {Promise<object>} The newly added cart item object.
   */
  addItem: async (productId, quantity, token) => {
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    const response = await axios.post(
      `${API_ACTUAL_CARTS_URL}/add`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  /**
   * @description Retrieves the authenticated user's cart with all of its items.
   * @returns {Promise<object>} The cart object with all its items.
   */
  getCartItems: async (token) => {
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    const response = await axios.get(`${API_ACTUAL_CARTS_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  /**
   * @description Updates the quantity of a specific item in the user's cart.
   * @param {string} cartItemId The ID of the cart item to update.
   * @param {number} quantity The new quantity for the item.
   * @returns {Promise<object>} The updated cart item object.
   */
  updateItem: async (cartItemId, quantity, token) => {
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    const response = await axios.put(
      `${API_ACTUAL_CARTS_URL}/update/${cartItemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  /**
   * @description Deletes a specific item from the authenticated user's cart.
   * @param {string} cartItemId The ID of the cart item to remove.
   * @returns {Promise<object>} A success message.
   */
  removeItem: async (cartItemId, token) => {
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    const response = await axios.delete(
      `${API_ACTUAL_CARTS_URL}/remove/${cartItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  /**
   * @description Completes the purchase by checking out the cart.
   * @returns {Promise<object>} The newly created order object.
   */
  checkout: async (token) => {
    if (!token) {
      throw new Error("User is not authenticated.");
    }
    const response = await axios.post(
      `${API_ACTUAL_CARTS_URL}/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
export default cartService;
