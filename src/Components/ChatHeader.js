import React, { useContext, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase/config';
import { doc, getDoc } from 'firebase/firestore';

import { AuthContext } from '../Context/AuthContext';

const ChatHeader = () => {
  const { currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();
  const profileHandler = () => {
    navigate('/profile');
  };
  //logout button firestore function
  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate('/signup');
      })
      .catch((err) => {
        // An error happened.
        alert(err.message);
        navigate('/chat');
      });
  };
  useEffect(() => {
    //fetch users data from firestore
    const fetchUserDetails = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
      if (docSnap.exists()) {
        const name = docSnap.data().name;
        setUserName(name);
      }
    };
    fetchUserDetails();
  }, [currentUser.uid]);

  return (
    <div className="chat-header-container">
      <h1 className="heading">Real Chat</h1>

      <button className="logout" onClick={logoutHandler}>
        Logout
      </button>
      {userName && userName !== 'undefined' ? (
        <p className="profile" onClick={profileHandler}>
          <br></br>change profile
        </p>
      ) : (
        ''
      )}
      <p className="profile">
        {'          '}
        {currentUser ? currentUser.phoneNumber : ''}
      </p>

      {userName === '' || userName === 'undefined' ? (
        <p className="profile" onClick={profileHandler}>
          setup your profile
        </p>
      ) : (
        <p className="profile">{userName}</p>
      )}
    </div>
  );
};

export default ChatHeader;
