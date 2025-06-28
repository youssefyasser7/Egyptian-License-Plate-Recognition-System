import axios from 'axios';

export const login = async (username, password) => {
  const response = await axios.post('http://localhost:8000/api/token/', {
    username,
    password,
  });
  return response.data.access;
};
