// Signup.js
import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css'; 
import { toast } from 'react-toastify';
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Form Data", formData);
    // Add your signup logic here
    let response = await axios.post('https://client-management-backend.onrender.com/api/v1/register', formData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log("Response Data: ",response.data.user);
    toast.success('User Regitered successfully');
    navigate('/event-dashboard');
    
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
        <h2>Create Account</h2>
        <p className="welcome-text">Join our community</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>


          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        <div className="alternative-options">
          <p className="signup-link">
            Already have an account?{' '}
            <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;