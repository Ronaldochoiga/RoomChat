import React, { Component, Fragment } from 'react';
import RoomList from './roomlist';
import CreateRoom from './createroom';
import RoomPanel from './roompanel'; // Import RoomPanel component

class MessagingPanel extends Component {
  state = {
    rooms: [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' },
      { id: 3, name: 'Room 3' }
    ],
    connection: null,
    isConnectionEstablished: false, // Track connection establishment
    currentRoom: null // Track the current room name
  };

  componentDidMount() {
    const connection = new WebSocket('ws://localhost:8080/');
    connection.onopen = () => {
      console.log('WebSocket connection established.');
      this.setState({ connection, isConnectionEstablished: true });
    };

    connection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  componentWillUnmount() {
    const { connection } = this.state;
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.close();
    }
  }

  createRoom = (roomName) => {
    const newRoom = { id: this.state.rooms.length + 1, name: roomName };
    this.setState({ rooms: [...this.state.rooms, newRoom] });
  };

  joinRoom = (roomId) => {
    const { connection } = this.state;
    if (connection && connection.readyState === WebSocket.OPEN) {
      const data = { type: 'join', roomId: roomId };
      connection.send(JSON.stringify(data));
      const roomName = this.state.rooms.find(room => room.id === roomId).name; // Get the room name
      this.setState({ currentRoom: roomName }); // Update the current room name in state
    } else {
      console.error('WebSocket connection is not available.');
    }
  };

  render() {
    const { rooms, connection, isConnectionEstablished, currentRoom } = this.state;
    return (
      <Fragment>
        <RoomList rooms={rooms} joinRoom={this.joinRoom} connection={connection} isConnectionEstablished={isConnectionEstablished} />
        <CreateRoom createRoom={this.createRoom} connection={connection} isConnectionEstablished={isConnectionEstablished} />
        {currentRoom && <RoomPanel roomName={currentRoom} connection={connection} />} {/* Render RoomPanel with the current room name */}
      </Fragment>
    );
  }
}

export default MessagingPanel;
