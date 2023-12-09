// SignUp.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Header from './Header'
import Loader from './Loader'
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Track progress from 0 to 100
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Simple validation - check if fields are empty
    if (!formData.username.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}signup`, formData);
        // Handle successful signup (redirect user, show success message, etc.)
        console.log('User signed up:', response.data);
        setLoading(false);
        navigate('/otp-verify')
      } catch (error) {
        // Handle signup error (show error message, reset form, etc.)
        console.error('Signup failed:', error);
      }
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10; // Increment by 10 (adjust as needed)
          return newProgress >= 100 ? 100 : newProgress; // Cap progress at 100
        });
      }, 1000); // Change the interval time (milliseconds) as needed

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div>
      <Header />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {loading && <Loader percentage={progress} />}
    </div>
  );
}

export default SignUp;
