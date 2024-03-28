import React, { Component } from 'react';
import MessagingPanel from './MessagingPanel';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: '' // Clear any previous error messages
    });
  }

  login = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    try {
      const response = await fetch('http://localhost:3030/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        console.log('User logged in successfully');
        // Set authenticated state and username in App component
        this.props.setUsername(username);
      } else {
        const data = await response.text();
        this.setState({ error: data });
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ error: 'An error occurred, please try again later.' });
    }
  }

  render() {
    const { error } = this.state;
    const { isAuthenticated } = this.props;

    // If authenticated, render MessagingPanel component
    if (isAuthenticated) {
      return <MessagingPanel username={this.props.username} />;
    }

    return (
      <div id="Login">
        <form onSubmit={this.login}>
          <label>Username:</label><br/>
          <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} /><br/>
          <label>Password:</label><br/>
          <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} /><br/>
          <input type="submit" value="Log In" />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }
}

export default Login;
