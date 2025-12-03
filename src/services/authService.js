// This service is responsible for all authentication-related API calls.
// By centralizing these functions, we keep our components focused on the UI.
// This line defines the base URL for the backend API endpoints.
// It's a constant variable that makes the code easier to maintain, as you only have to change the URL in one place.
const API_URL = "http://localhost:3000/api/users";

// This is an asynchronous function that handles user registration.
// It takes `email` and `password` as input.
/**
 * @description: Registers a new user with the backend API.
 * @param {string} email - The user's email address.
 * @param {string} password_hash - The user's password.
 * @returns {object} The response data from the API.
 */
const register = async (email, password_hash) => {
    // A `try...catch` block is used to handle success and failure of the API call.
    try {
        // `fetch()` is a built-in browser API used to make network requests.
        // It's called with the full registration URL and an options object.
        const response = await fetch(`${API_URL}/register`, {

            // `method: "POST"` specifies that this is a POST request, used for creating a new resource (a new user).
            method: "POST",

            // `headers` contains metadata about the request.
            headers: {

                // `"Content-Type": "application/json"`tells the server that the request body is a JSON object.
                "Content-Type": "application/json",
            },
            // `body` contains the data sent to the server.
            // `JSON.stringify()` converts the JavaScript object `{ email, password }` into a JSON string.
            body: JSON.stringify({ email, password_hash }),
        });
        //response ={"email": "saniya@gmail.com"}

        // `response.json()` parses the JSON response body from the server. It's an asynchronous operation.
        const data = await response.json();
        // `response.ok` is a boolean property that is `true` if the HTTP status code is in the 200-299 range.
        // If it's not `ok`, it means the request failed (e.g., 400 Bad Request, 409 Conflict, 500 Internal Server Error).
        if (!response.ok) {
            // If the response is not OK, we throw a new `Error`.
            // The error message is taken from the backend response (`data.message`) or a default message is used.
            throw new Error(data.message || "Registration failed.");
        }
        // If the registration is successful, the function returns the data from the API.
        return data;
    } catch (error) {
        // If a network error or the `throw new Error` happens, this `catch` block runs.
        // The error is logged to the console for debugging.
        console.error("Error in auth.service.register:", error);

        // The error is re-thrown so the calling component can handle it and update its state (e.g., show an error message).
        throw error;
    }
};

// This asynchronous function handles user login. It's similar to `register`.
/**
 * @description: Logs in a user and stores the token in local storage.
 * @param {string} email - The user's email address.
 * @param {string} password_hash - The user's password.
 * @returns {object} The user and token data.
 */
const login = async (email, password_hash) => {
    try {
        // Make a `POST` request to the `/login` endpoint with the user's credentials.
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password_hash }),
        });
        // Parse the JSON response.
        const data = await response.json();
        // Log the response data for debugging.
        console.log("Step 1: Login API Response Data:", data);
        // Check if the response was successful.
        if (!response.ok) {
            throw new Error(data.message || "Login failed.");
        }

        // Now, correctly extract the token and user data from the nested 'user' object
        // Destructure the `user` object from the `data` response.
        const { user } = data;
        // Destructure the `token` from the `user` object and rename it to `accessToken`.
        const { token: accessToken } = user;
        // Check if the token or user object is missing, which indicates a login failure.
        if (!accessToken || !user) {
            throw new Error("Login failed: Missing token or user data in response.");
        }
        
        // Store the token and user data for persistence across page refreshes.
        // `localStorage.setItem` stores key-value pairs in the browser's local storage.
        // We store the `accessToken` directly.
        localStorage.setItem("accessToken", accessToken);
        // We store the `user` object after converting it to a JSON string using `JSON.stringify()`.
        localStorage.setItem("user", JSON.stringify(user));
        
        // Return the user data to the component.
        return user;
        // Why we store the token:
        // We store the token in local storage so that the user remains logged in
        // even if they refresh the page. This token is a key piece of information
        // that allows us to authenticate future requests to protected routes.
    } catch (error) {
        // Handle errors by logging and re-throwing them.
        console.error("Error in auth.service.login:", error);
        throw error;
    }
};

// This function handles user logout. It's a synchronous operation.
/**
 * @description: Logs out the user by removing their data from local storage.
 * @returns {void}
 */
const logout = () => {
  // `localStorage.removeItem()` removes a specific item from local storage by its key.
  // This is how we log the user out: by deleting their authentication data.
  // Why we use localStorage.removeItem:
  // When the user logs out, we need to completely remove the token and user
  // data from the browser's storage to prevent unauthorized access.
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};

// This objeect bundles all the authentication function together.
const authService = {
    register,
    login,
    logout
}


//export
export default authService;