// App.js
import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import OTPVerification from './components/OtpVerify.jsx';
import TopicsList from './components/TopicsList';
import TopicDetails from './components/TopicDetails.jsx';
import CreateTopic from './components/CreateTopic.jsx';

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
        <Routes>
              <Route path='/signin' element={<Login />}>
              </Route>
              <Route path='/otp-verify' element={<OTPVerification />}>
              </Route>
              <Route path='/signup' element={<SignUp />}>
              </Route>
              <Route exact path='/Topics' element={<TopicsList />}>
              </Route>
              <Route path='/Topic/:id' element={<TopicDetails />}>
              </Route>
              <Route path='/create' element={<CreateTopic />}>
              </Route>
          </Routes>
    </BrowserRouter>
    </Provider>
   
  );
}

export default App;
