import Profile from './Components/Profile';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Otp from './Components/Otp';
import ChatContainer from './Components/ChatContainer';
import { AuthContext } from './Context/AuthContext';
import React, { useContext } from 'react';
function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={!currentUser ? <SignUp /> : <ChatContainer />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<Otp />} />
          <Route
            path="/chat"
            element={!currentUser ? <SignUp /> : <ChatContainer />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
