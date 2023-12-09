// OTPVerification.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

function OTPVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState(''); // Added email state
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'otp') {
      setOTP(e.target.value);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === '') {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}verify-otp`, { email, otp }); // Included email in the request
      console.log('OTP verified:', response.data);
      setLoading(false);
      // Handle successful OTP verification (redirect user, allow access, etc.)
      navigate('/signin');
    } catch (error) {
      console.error('OTP verification failed:', error);
      // Handle OTP verification error (show error message, reset form, etc.)
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleChange}
            required
          />
          {error && <span className="error">{error}</span>}
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      {loading && <Loader percentage={progress} />}
    </div>
  );
}

export default OTPVerification;
