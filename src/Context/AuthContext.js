import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [reciever, setReciever] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setReciever, reciever }}>
      {children}
    </AuthContext.Provider>
  );
}
