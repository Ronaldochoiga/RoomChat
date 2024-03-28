import axios from 'axios';

const API_URL = 'http://localhost:3030';

export const saveMessage = async (roomId, message, sender) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, {
      room_id: roomId,
      message: message,
      sender: sender
    });
    return response.data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};
