import ChatHeader from './ChatHeader';
import ChatMenu from './ChatMenu';
import ChatBox from './ChatBox';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/config';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';

const ChatContainer = () => {
  const users = [];
  const [data, setData] = useState();
  const { currentUser } = useContext(AuthContext);
  //fetching details of users collection to make menu-cards of users
  const allUsersData = async () => {
    const allUsers = await collection(db, 'users');
    onSnapshot(allUsers, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().phone !== currentUser.phoneNumber) {
          users.push(doc.data());
        }
        setData(users);
      });
    });
  };
  useEffect(() => {
    allUsersData();
  });
  return (
    <div className="chat-container">
      <div className="left-container">
        <ChatHeader />
        <ChatMenu data={data} />
      </div>
      <div className="right-container">
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatContainer;
