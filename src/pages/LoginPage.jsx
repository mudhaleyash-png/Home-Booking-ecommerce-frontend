import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//react-icons/fa package for icons
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import '../styles/LoginPage.css'; // Custom styles for a modern, animated look.

/**
 * @description This component provides a professional, animated, and
 * innovative login page UI. It maintains the original authentication logic
 * while enhancing the user experience with modern design principles.
 */
const LoginPage = () => {
    // State management for form inputs, errors, and loading status.
    const [email, setEmail] = useState('');
    const [password_hash, setPassword_Hash] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Accessing the login function from the authentication context.
    const { loginAuth } = useContext(AuthContext);
    // for navigation we define navigate variable and assign useNavigate function to it.

    const navigate = useNavigate();
    /**
     * @description Handles the form submission for user authentication.
     * It's an async function to manage the network request to the backend.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); //default action stop using this
        setLoading(true);
        setError(null);
        try {
            await loginAuth(email, password_hash);
            navigate('/home');
        } catch (err) {
            console.error(err);
            setError('Failed to log in. Please check your email and password_hash.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-page-container d-flex flex-column justify-content-center align-items-center vh-100 position-relative text-white overflow-hidden">
            {/* Dynamic Floating Shapes Background */}
            <div className="animated-shapes"></div>
            {/* Login Card - A minimalist, interactive panel */}
            <div className="login-panel p-5 rounded-4 shadow-lg animate__fadeInUp">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-1 text-primary">Login</h2>
                    <p className="text-muted">Welcome back to your account</p>
                </div>
                {/* Error message display */}
                {error && (
                    <div className="alert alert-danger animate__shake" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Email Input Field */}
                    <div className="form-group mb-4">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text"><FaUser /></span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* password_hash Input Field */}
                    <div className="form-group mb-4">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text"><FaLock /></span>
                            <input
                                type="password_hash"
                                className="form-control"
                                placeholder="password_hash"
                                value={password_hash}
                                onChange={(e) => setPassword_Hash(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* Submit Button with Loading State */}
                    <div className="d-grid mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg rounded-pill fw-bold login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner me-2" />
                                    <span className="ms-2">Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className="me-2" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
