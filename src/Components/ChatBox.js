import {
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { db } from '../Firebase/config';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState('');

  const { reciever, currentUser } = useContext(AuthContext);

  //initial fetching real time data from firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const combineId =
        reciever.uid > currentUser.uid
          ? reciever.uid + currentUser.uid
          : currentUser.uid + reciever.uid;
      const docSnap = await onSnapshot(doc(db, 'chats', combineId), (doc) => {
        setMessages(doc.data().messages);
        return () => {
          docSnap();
        };
      });
    };

    reciever.uid && fetchMessages();
  }, [currentUser.uid, reciever.uid]);

  //update button firestore functions
  const messageHandler = async () => {
    try {
      const combineId =
        reciever.uid > currentUser.uid
          ? reciever.uid + currentUser.uid
          : currentUser.uid + reciever.uid;

      await updateDoc(doc(db, 'chats', combineId), {
        messages: arrayUnion({
          chatId: uuid(),
          message,
          recieverUid: reciever.uid,
          senderUid: currentUser.uid,
          timestamp: Timestamp.now(),
        }),
      }).then((data) => {
        setMessage('');
      });
    } catch (err) {
      alert(err.message);
    }
  };

  //delete button firestore functions
  const deleteButtonHandler = async (v) => {
    const m = messages.filter((post) => post !== v);

    try {
      const combineId =
        reciever.uid > currentUser.uid
          ? reciever.uid + currentUser.uid
          : currentUser.uid + reciever.uid;
      await setDoc(doc(db, 'chats', combineId), {
        messages: m,
      }).then((data) => {
        setMessage('');
      });
    } catch (err) {
      alert(err.message);
    }
  };
  //edit button firestore functions (first delete current array object then added new object to array)

  const editButtonHandler = async (v) => {
    var editedMessage = prompt('Enter the new message:', v.message);
    if (editedMessage !== null) {
      for (let i in messages) {
        if (messages[i] === v) {
          messages[i].message = editedMessage;
        }
      }
      const combineId =
        reciever.uid > currentUser.uid
          ? reciever.uid + currentUser.uid
          : currentUser.uid + reciever.uid;
      await setDoc(doc(db, 'chats', combineId), {
        messages,
      });
    }
  };
  return (
    <>
      {reciever.uid ? (
        <div className="chatbox-container">
          <div className="chat-header">
            <p className="profile">{reciever ? reciever.name : ''}</p>
          </div>
          <div className="chat-wrapper">
            {messages &&
              messages.map((value, i) => {
                if (value.senderUid === currentUser.uid) {
                  return (
                    <div key={i} className="messege-box-sender">
                      <p>{value.message}</p>
                      <p
                        className="delete-button"
                        style={{
                          margin: '0px',
                          padding: '0px',
                          display: 'inline',
                          float: 'left',
                        }}
                        onClick={() => deleteButtonHandler(value)}
                      >
                        delete
                      </p>
                      <p
                        style={{
                          margin: '0px',
                          padding: '0px',
                          paddingLeft: '20px',
                          display: 'inline',
                          float: 'left',
                        }}
                        onClick={() => editButtonHandler(value)}
                      >
                        edit
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className="messege-box-reciever">
                      <p>{value.message}</p>
                    </div>
                  );
                }
              })}
          </div>

          <div className="messege-input-field">
            <input
              type="text"
              placeholder="Message"
              className="messege-input"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button className="send-button" onClick={messageHandler}>
              send
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
export default ChatBox;
