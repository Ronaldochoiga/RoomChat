import React from 'react';

const DisplayConversation = ({ roomName, messages }) => {
    return (
        <div className="display-conversation">
            <h2>Conversation in Room "{roomName}"</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{message.username}: </strong>
                        {message.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DisplayConversation;
