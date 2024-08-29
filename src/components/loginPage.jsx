import { useState, useEffect } from "react";
import axios from 'axios';

const RegisterLogin = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] =useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] =useState("")

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setError("")
  };

  const updateData = (event) =>{
    setFormData({...formData, [event.target.name]: event.target.value});
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Registration API call
      try {
        const response = await axios.post("/api/users", {
          email: formData.email,
          username: formData.username,
          password: formData.password
        });
        alert(response.data.message);
        setIsRegister(false); // Switch to login form after successful registration
      } catch (error) {
        setError(error.response.data.message || "Registration failed");
      }
    } else {
      // Login API call
      try {
        const response = await axios.post("/api/auth/login", {
          username: formData.username,
          password: formData.password
        });
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
      } catch (error) {
        setError(error.response.data.message || "Login failed");
      }
    }
  };

  return (
    <div className="container">
      <div className="login-section">
        {isRegister ? (
          <div>
            <h1>Register</h1>
            <hr></hr>
            <h2>Create a new account</h2>
            <form className="register-form" onSubmit={formSubmit}>
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="New Password" required />
              <button type="submit" className="register-button">
                Sign Up
              </button>
            </form>
            <p>
              Already have an account?{" "}
              <span onClick={toggleForm} className="toggle-link">
                Log In
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h1>LOGIN</h1>
            <hr width="100%"></hr>
            <h2>Login you Legend!</h2>
            <form className="login-form" onSubmit={formSubmit}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit" className="login-button">
                Log In
              </button>
              <a href="#" className="forgot-password">
                Forgotten password?
              </a>
            </form>
            <p>
              Don't have an account?{" "}
              <span onClick={toggleForm} className="toggle-link">
                Sign Up
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterLogin;
