import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { auth } from '../Firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
const SignUp = () => {
  const [phone, setPhone] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  //firebase function to generate captcha
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };
  //authentication function
  const submitHandler = () => {
    if (phone.length >= 12) {
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;

          navigate('/otp');
        })
        .catch((err) => {
          //error in relation between firebase while sign in with phone number
          /* global grecaptcha */
          appVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
          });
          grecaptcha.reset(window.recaptchaWidgetId);

          setError(err.message);
        });
    }
    //error when the number is not greater than 12
    else {
      setError(
        'The Number is not in correct format or you missed some numbers'
      );
    }
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1 className="headings">SignUp</h1>
        <div className="error-container">
          <p>{error ? error : ''}</p>
        </div>
        {/* <input
          type="name"
          id="name"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <PhoneInput
          placeholder="Enter phone number"
          value={phone}
          onChange={setPhone}
        />
        <div id="recaptcha-container"></div>
        <button className="btn-confirm" onClick={submitHandler}>
          Send Otp
        </button>
        {/* <Link to="/login">Already have a account</Link> */}
      </div>
    </div>
  );
};

export default SignUp;
