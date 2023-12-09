// TopicList.js
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header'

function TopicList() {
  const user = useSelector(selectUser);
  
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [currentTopic, setCurrentTopic] = useState(null);
  // console.log(topics)
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}all_posts`);
        setTopics(response.data.foundpost);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        setError('Failed to fetch topics');
      }
    };

    fetchTopics();
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (topicId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}posts/${topicId}/comments`, 
      {
        description: newComment,
      },{
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      },);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}comment/${topicId}`);
      const updatedTopics = topics.map((topic) => {
        if (topic._id === topicId) {
          return { ...topic, comments: response.data.foundcomment };
        }
        return topic;
      });
      setTopics(updatedTopics);
      console.log(topics)
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleShowComments = async (topicId) => {
    if (currentTopic === topicId) {
      setCurrentTopic(null);
    } else {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}comment/${topicId}`);
        const updatedTopics = topics.map((topic) => {
          if (topic._id === topicId) {
            return { ...topic, comments: response.data.foundcomment };
          }
          return topic;
        });
        setTopics(updatedTopics);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setError('Failed to fetch comments');
      }
      setCurrentTopic(topicId);
    }
  };

  return (
    <>
    <Header />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
      <h2>This is a Feed</h2>
      {error && <span className="error">{error}</span>}
      <div className="topics-container">
        {topics.map((topic) => (
          <div key={topic._id} className="topic">
            <div className='topic-head'>
              <p>{topic.postedBy.username}</p>
              <p className="topic-date">{topic.date}</p>
            </div>
            <div className="topic-content">
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <button onClick={() => handleShowComments(topic._id)}>
                {currentTopic === topic._id ? 'Hide Comments' : 'See Comments'}
              </button>
              {currentTopic === topic._id && (
                <div className="comments-section">
                  <h4>Comments</h4>
                  {topic.comments && topic.comments.length > 0 ? (
                    topic.comments.map((comment, index) => (
                      <div className='comment' key={index}>
                        <p>{comment.postedBy.username} - </p>
                        <p >{comment.description}</p>
                      </div>
                      
                    ))
                  ) : (
                    <p>No comments yet</p>
                  )}
                  <textarea value={newComment} onChange={handleCommentChange} />
                  <button onClick={() => handleCommentSubmit(topic._id)}>Add Comment</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link to="/create">Create a Topic</Link>
      </>
      ):(<p>You must be logged in</p>)}
    </div>
    </>
  );
}

export default TopicList;
