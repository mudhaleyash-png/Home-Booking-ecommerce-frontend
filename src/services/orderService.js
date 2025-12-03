import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ACTUAL_ORDERS_URL = `${API_BASE_URL}/orders`;
/**
 * @description This service handles all API calls related to user orders.
 * It encapsulates the logic for fetching and deleting orders from the backend.
 */
const orderService = {
  /**
   * @description Fetches all orders for the authenticated user from the backend.
   * @returns {Promise<Array>} A promise that resolves to an array of order objects.
   */
  getOrders: async (token) => {
    try {
      // Get the user's authentication token from local storage.
      if (!token) {
        throw new Error("No authentication token found.");
      }
      // Send a GET request to the backend with the token in the Authorization header.
      const response = await axios.get(`${API_ACTUAL_ORDERS_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in orderService.getOrders:", error);
      throw error;
    }
  },
  /**
   * @description Deletes a specific order for the authenticated user.
   * @param {number} orderId - The unique ID of the order to delete.
   * @returns {Promise<boolean>} A promise that resolves to true on successful deletion.
   */
  deleteOrder: async (orderId, token) => {
    try {
      if (!token) {
        throw new Error("No authentication token found.");
      }
      // Send a DELETE request to the backend. The orderId is a URL parameter.
      const response = await axios.delete(
        `${API_ACTUAL_ORDERS_URL}/delete/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Return true to indicate successful deletion.
      return true;
    } catch (error) {
      console.error("Error in orderService.deleteOrder:", error);
      throw error;
    }
  },
};
export default orderService;
