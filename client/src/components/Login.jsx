// SignIn.js
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
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

    if (!formData.username.trim()) {
      newErrors.email = 'username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}signin`, formData);
        console.log('User signed in:', response.data);
        setLoading(false);
        dispatch(setUser(response.data));
        // Handle successful signin (redirect user, set authentication token, etc.)
        navigate('/Topics');
      } catch (error) {
        console.error('Signin failed:', error);
        setLoading(false);
        setErrors({ ...errors, login: error.response.data.error });
        // navigate('/otp-verify')

        // Handle signin error (show error message, reset form, etc.)
      }
    }
  };

  return (
    <div>
      <Header />
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">UserName:</label>
          <input
            type="username"
            id="email"
            name="username"
            value={formData.username}
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
        <button type="submit">Sign In</button>
      </form>
      {loading && <Loader percentage={progress} />}
      {errors.login && <span className="error">{errors.login} <Link to={'/otp-verify'}><button>Verify</button></Link></span>}
    </div>
  );
}

export default SignIn;
