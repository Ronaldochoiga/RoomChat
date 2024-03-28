// messageUtils.js

const sendMessage = (connection, message) => {
    if (connection && connection.readyState === WebSocket.OPEN) {
        const data = {
            type: 'message',
            message: message
        };
        connection.send(JSON.stringify(data));
    } else {
        console.error('WebSocket connection is not available.');
    }
};

export default sendMessage;
