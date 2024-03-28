import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';
import MessagingPanel from './MessagingPanel';
import RoomPanel from './roompanel'; // Import the RoomPanel component

class App extends Component {
  state = {
    username: null,
    authenticated: false,
    joinRoom: false // New state to track if the user has joined a room
  };

  setUsername = (username) => {
    this.setState({ username, authenticated: true });
  };

  handleSignupSuccess = () => {
    this.setState({ authenticated: true });
  };

  handleJoinRoom = () => {
    this.setState({ joinRoom: true });
  };

  render() {
    const { authenticated, username, joinRoom } = this.state;

    return (
      <div className="App">
        {authenticated && !joinRoom ? ( // Render MessagingPanel if not joining a room
          <MessagingPanel username={username} onJoinRoom={this.handleJoinRoom} />
        ) : authenticated && joinRoom ? ( // Render RoomPanel if joining a room
          <RoomPanel username={username} />
        ) : (
          <>
            <Login setUsername={this.setUsername} setAuthenticated={this.handleSignupSuccess} />
            <Signup onSignupSuccess={this.handleSignupSuccess} />
          </>
        )}
      </div>
    );
  }
}

export default App;
