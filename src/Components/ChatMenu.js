import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { db } from '../Firebase/config';
import { AuthContext } from '../Context/AuthContext';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ChatMenu = ({ data }) => {
  const { currentUser, setReciever } = useContext(AuthContext);

  //fethching chats of users from firestore
  const clickPersonHandler = async (reciever) => {
    setReciever(reciever);
    const combineId =
      reciever.uid > currentUser.uid
        ? reciever.uid + currentUser.uid
        : currentUser.uid + reciever.uid;
    const res = await getDoc(doc(db, 'chats', combineId));
    if (!res.exists()) {
      await setDoc(doc(db, 'chats', combineId), {
        messages: [],
      }).catch((err) => {
        alert(err.message);
      });
    }
  };
  return (
    <div className="chat-menu-container">
      <Scrollbars autoHide style={{ height: '78vh' }}>
        {data ? (
          data.map((value, i) => {
            return (
              <div
                key={i}
                className="box"
                onClick={() => clickPersonHandler(value)}
              >
                {value.name}
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </Scrollbars>
    </div>
  );
};

export default ChatMenu;
