import { doc, setDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';
import { db } from '../Firebase/config';

const Profile = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //function to add user details to user collection in firestore
  const setUserDetails = async () => {
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: name,
        phone: currentUser.phoneNumber,
        uid: currentUser.uid,
      }).then(() => {
        navigate('/chat');
      });
    } catch (e) {
      setError('Not able to store user data to database:' + e);
    }
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1 className="headings">Set up your Profile</h1>
        <p>{error ? error : ''}</p>

        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn-confirm" onClick={setUserDetails}>
          confirm
        </button>
        {/* <Link to="/signup">Create a new account</Link> */}
      </div>
    </div>
  );
};

export default Profile;
