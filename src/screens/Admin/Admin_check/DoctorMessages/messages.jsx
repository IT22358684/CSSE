import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import './messages.css'; // Import the CSS file

const Messages = () => {
  const [messages, setMessages] = useState([]);

  // Fetch Messages data from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Messages'));
        const messagesList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Document ID
          ...doc.data() // All the document data
        }));

        setMessages(messagesList);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="messages-container">
      <h1 className="messages-title">Admin Review - Messages</h1>
      <table className="messages-table">
        <thead>
          <tr>
          <th>Subject</th>
            <th>Message</th>
           
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map(message => (
              <tr key={message.id}>
                <td>{message.subject}</td>
                <td>{message.message}</td>
                
                <td>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No messages found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Messages;
