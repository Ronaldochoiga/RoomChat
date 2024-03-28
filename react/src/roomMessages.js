// RoomMessages.js

import React, { useState } from 'react';
import sendMessage from './messageUtils';

const RoomMessages = ({ connection }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(connection, message); // Use sendMessage function
        setMessage('');
    };

    return (
        <div className="room-messages">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default RoomMessages;
