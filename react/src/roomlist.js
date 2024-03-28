import React, { Component } from 'react';
import RoomPanel from './roompanel'; // Import RoomPanel component

class RoomList extends Component {
    state = {
        rooms: [],
        selectedRoom: null // Add selectedRoom state
    };

    componentDidMount() {
        // Fetch available rooms when the component mounts
        this.fetchRooms();
    }

    fetchRooms = () => {
        // Fetch available rooms from the backend
        fetch('http://localhost:3030/rooms')
            .then(response => response.json())
            .then(data => {
                this.setState({ rooms: data });
            })
            .catch(error => {
                console.error('Error fetching rooms:', error);
            });
    }

    handleJoinRoom = (roomName) => {
        // Handle joining a room
        console.log('Joining room:', roomName);
        // Find the selected room by name
        const selectedRoom = this.state.rooms.find(room => room.name === roomName);
        // Set the selected room in the state
        this.setState({ selectedRoom });
    }

    render() {
        const { rooms, selectedRoom } = this.state;

        // Render RoomPanel if a room is selected
        if (selectedRoom) {
            return <RoomPanel room={selectedRoom} />;
        }

        return (
            <div className="room-list">
                <h2>Available Rooms</h2>
                <button onClick={this.fetchRooms}>Refresh Rooms</button>
                <ul>
                    {rooms.map(room => (
                        <li key={room.id}>
                            {room.name}
                            <button onClick={() => this.handleJoinRoom(room.name)}>Join</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default RoomList;
