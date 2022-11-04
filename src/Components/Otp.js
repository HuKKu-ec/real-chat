import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase/config';

const Otp = () => {
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  //authenticating using otp
  const verifyotpHandler = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then(async (result) => {
          // User signed in successfully.
          const user = result.user;

          // setUserDetails(user);
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }

          // ...
        })
        .catch((err) => {
          // User couldn't sign in (bad verification code?)
          setError(err.message);
          // ...
        });
    } else {
      setError('Otp must be a 6 digit number');
    }
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1 className="headings">Otp</h1>
        <div className="error-container">
          <p>{error ? error : ''}</p>
        </div>
        <input
          type="number"
          id="otp"
          name="otp"
          placeholder="Otp"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />
        <button className="btn-confirm" onClick={verifyotpHandler}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default Otp;
