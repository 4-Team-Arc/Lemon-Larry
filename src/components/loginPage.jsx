import { useState, useEffect } from "react";
import axios from 'axios';

const RegisterLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] =useState({
    email: "",
    username: "",
    password: ""
  });
  const [error, setError] =useState("")
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setAuthenticated(true);
    }
  },[]);

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
        const response = await axios.post("/api/v1/users", {
          email: formData.email,
          username: formData.username,
          password: formData.password
        });
        setIsRegister(false); // Switch to login form after successful registration

      } catch (error) {
        setError(error.response.data.message || "Registration failed");
      }
    } else {
      // Login API call
      try {
        const response = await axios.post("/api/v1/users/Login", {
          username: formData.username,
          password: formData.password
        });
        // alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        window.location.href = "/"
      } catch (error) {
        setError(error.response.data.message || "Login failed");
      }
    }
  };

  const loggingOut = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    window.location.href = "/Login"
  }

  if(authenticated) {
    return (
      <div>
        <h1>Welcome back, Legend!</h1>
        <h3>Top scores here</h3>
        <button onClick={loggingOut}>Logout</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="login-section">
        {isRegister ? (
          <div>
            <h1>Register</h1>
            <hr></hr>
            <h2>Become a Legend!</h2>
            <form className="register-form" onSubmit={formSubmit}>
              <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={updateData}
              required />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={updateData}
                required />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={updateData}
                required />
              <button type="submit" className="register-button">
                Sign Up
              </button>
            </form>
            <p>
              Already Legendary?{" "}
              <span onClick={toggleForm} className="toggle-link">
                Log In
              </span>
            </p>
          </div>
        ) : (
          <div>
            <h1>LOGIN</h1>
            <hr width="100%"></hr>
            <h2>Login, Legend!</h2>
            <form className="login-form" onSubmit={formSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={updateData}
                required />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={updateData}
                required />
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
