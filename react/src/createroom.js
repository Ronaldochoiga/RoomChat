import React, { Component } from 'react';

class CreateRoom extends Component {
    state = {
        roomName: ''
    };

    handleChange = (e) => {
        this.setState({ roomName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const roomName = this.state.roomName.trim();
        const username = "ronaldo"; // Assuming you're hardcoding the username here
        if (roomName && this.props.connection) {
            // Ensure connection is available before sending message
            const message = JSON.stringify({ type: 'join', username: username, room: roomName }); // Include room name in the message
            this.props.connection.send(message);
            this.setState({ roomName: '' });
        } else {
            console.error('Connection is not available or room name is empty.');
        }
    }

    render() {
        return (
            <div className="create-room">
                <h2>Create New Room</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter room name"
                        value={this.state.roomName}
                        onChange={this.handleChange}
                    />
                    <button type="submit">Create</button>
                </form>
            </div>
        );
    }
}

export default CreateRoom;
