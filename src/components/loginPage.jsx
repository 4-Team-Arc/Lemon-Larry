import { useState, useEffect } from "react";

const RegisterLogin = () => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="container">
      <div className="login-section">
        <h1>LOGIN</h1>
        {isRegister ? (
          <div>
            <h2>Create a new account</h2>
            <form className="register-form">
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
            <form className="login-form">
              <hr width="100%"></hr>
              <input type="email" placeholder="Username" required />
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
