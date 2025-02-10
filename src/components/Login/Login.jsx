// Login.js
import { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your login logic here

    let response = await axios.post('https://client-management-backend.onrender.com/api/v1/login', formData);
    console.log("Response is: ", response);

    if (response) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success('User LoggedIn successfully');
      navigate('/event-dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  let user;
  useEffect(() => {
    user = localStorage.getItem("user");
    if (user) {
      navigate("/event-dashboard")
    }
  }, [user, navigate])


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <p className="welcome-text">Welcome to login</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="alternative-options">
          <p className="signup-link">
            Don't have an account?{''}
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;