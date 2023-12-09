import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { Link } from 'react-router-dom';

const Header = () => {
  const user = useSelector(selectUser);
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <a href="/signin">
          <img src="/vite.svg" alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </a>
      </div>
      <div style={buttonContainer}>
        {user ? (
          <>
          <Link to="/topics">
            <button style={buttonStyle}>Feed</button>
          </Link>
          <Link to="/create">
            <button style={buttonStyle}>Create</button>
          </Link>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button style={buttonStyle} onClick={toggleForm}>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button style={buttonStyle} onClick={toggleForm}>
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

// Your existing styles remain unchanged

const headerStyle = {
  width:'1376px',
  maxWidth:'100%',
  display: 'flex',
  justifyContent:'space-between',
  alignItems: 'center',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  background: 'black',
  color: '#fff',
};

const logoStyle = {
  // flex: '1',
  marginLeft : '50px'
};

const buttonContainer = {
  display:'flex',
  padding: '0.5rem 1rem',
  borderRadius: '40px',
  textAlign: 'right',
  marginRight : '50px',
  background: 'black',
  cursor: 'pointer',
};

const buttonStyle = {
//   padding: '0.5rem 1rem',
  fontSize: '1rem',
  border:'none',
  outline:'none',
  background: 'black',
  color: 'white',
  cursor: 'pointer',
};

export default Header;
