import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";


const RegisterPage = () => {

// Here we define javascript code
// // why we useState
// we use the `useState` hook to manage the form's input state for email and password
// as well as any loading or error states
// this line initializes the `email` state variable with an empty string and provides the `setEmail` function to update it
const[email, setEmail] = useState('');

// This line initialize the `password` state variable and its updater function `setPassword`
const[password_hash, setPassword_Hash] = useState('');

// This line initialize the `loading` state variable which tracks whether the registration process in progress
const [loading, setLoading] = useState(false);

// This line initialize the `error` state which will storre any registration error meassage
const [error, setError] = useState(null);

const{registerAuth} =useContext(AuthContext)

//Why we use an asynchronous function for `handleSubmit`:
// The registration process involves a request to the backend, which is an asynchronous operation.
//  Using async/await makes the code more readable and helps 
// us handle the sequence of events(sending the request, waiting for a response)....
//This asynchronous function is called when the form is submitted
const handleSubmit = async (e) => {
    //`e.preventDefault()` prevents the default from submission behaviour which could cause a page reload
    e.preventDefault();

    //Set the loading` state to `true` to indicate that the registration process has started
    setLoading(true);

    //Clear any previous error messages before attempting a new registration
    setError(null);

    // A `try...catch` block is used to handle success and failure of the asynchronous operation
    try{
        // Call the `register` function from the AuthContext
        // The `await` keyword pauses the execution until the `register` promise is resolve
     await registerAuth(email, password_hash)

    }catch (error) {
        //If an error during registration, the `catch` block is executed...
        //Log the error to the console for  debugging purposes
        console.error(error);

        // We check for a specific error message to provide better feedback to the user
        // The `?` operator is a ternary operator which is shorthand for an `if...else` statement
        const errorMessage =
        error.message ==='Email already exist' 
        ? 'This email is already in use. Please try a different one '
        :'failed to register. Please try again later' //logic error

        //set 'error' state with the appropriate message, which will be displayed to the user.
        setError(errorMessage);
     }finally{
        setLoading(false);
        setEmail('');
        setPassword_Hash('');
     }
    
    };

    // The `return`statement renders the component's JSX(React's syntax fo HTML- like code_)
    return(
        // we use the standard HTML tags with bootstrap classses for styling to maintain 
        // consistency across our components...
        // This is the main container `div` with bootstrrap classes for centering content
        <div className="container d-flex justify-content-center align-items-center" style={{minHeight:'80vh'}}>
            {/* This `div` acts as a card with padding a shadow and a fixed width*/}
            <div className="card p-4 shadow-sm" style={{width:'25rem'}}>
                {/* A heading for the form */}
                <h2 className="text-center mb-4">Register</h2>
                {/*we use conditinaol rendering to show an error message if the error state is not null */}
                {/** If `error` is a truty false,the div the alert will be rendered */}
                {error && <div className="alert alert-danger">{error}</div>}
                {/*The `form` elemsnt with an `onsubmit` event handler that calls `handleSubmit` function*/}
                <form onSubmit={handleSubmit}>
                    {/*A `div` for the email input*/}
                    <div className="mb-3">
                        {/*A label forr the email input. `htmlFor` links it to the input field's id */}
                        <label htmlFor="formEmail" className="form-label">Email Address</label>
                        {/* The email input field */}
                        <input 
                        type="email" 
                        className="form-control"
                        id="formEmail" 
                        placeholder="Enter email"
                        //`value={email}` binds the input's value to the `email` state 
                        value={email}
                        //`onChange` updates the `email` the state whenever the user types...
                        onChange={(e)=>setEmail (e.target.value)}
                        //`required` is an html attribute that makes the field mandatory
                        required
                        />
                    </div>

                    <div className="mb-3">
                        {/*A label for the password input. `htmlFor` links it to the input field's id */}
                        <label htmlFor="formPassword" className="form-label">Password</label>
                        {/* The email input field */}
                        <input
                        type="password"
                        className="form-control"
                        id="formPassword"
                        placeholder="Password"
                        //`value={email}` binds the input's value to the `email` state 
                        value={password_hash}
                         //`onChange` updates the `email` the state whenever the user types...
                        onChange={(e) => setPassword_Hash(e.target.value)}
                         //`required` is an html attribute that makes the field mandatory
                        required
                        />
                    </div>

                    {/* The submit Button */}
                    <button type="submit" className="btn btn-primary w-100"
                    // THe `disabled` attribute is set to `true` if `loading` true
                    // preventing multiple submission while a request is in progress
                    >

                    {/* This uses aternary operator to conditionally change the button's text */}    
                    {/* based on the `loading state` */}
                    {loading ? 'Registering...': 'Register'}
                    </button>    
                    
                </form>

            </div>
        </div>
    )
}

export default RegisterPage;