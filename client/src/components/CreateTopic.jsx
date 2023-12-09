// CreateTopic.js
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function CreateTopic() {
  const user = useSelector(selectUser);
  // console.log(user)
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError('');
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') {
      setError('Please enter a title and description');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}posts`, { title, description },{
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log('Topic created successfully');
      setTitle('');
      setDescription('');
      navigate('/topics');
    } catch (error) {
      console.error('Topic creation failed:', error);
      setError('Failed to create topic');
    }
  };

  return (
    <>
    <Header />
    <div>
      <h2>Create a Topic</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            required
          ></textarea>
        </div>
        {error && <span className="error">{error}</span>}
        <button type="submit">Create Topic</button>
      </form>
    </div>
    </>
  );
}

export default CreateTopic;
