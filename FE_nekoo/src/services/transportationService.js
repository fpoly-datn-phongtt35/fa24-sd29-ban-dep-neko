import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/transportation";

export const loadTransportations = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/getAlll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};

export const saveTransportation = async (token, data) => {
  const response = await axios.post(`${API_BASE_URL}/save`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};

export const disableTransportation = async (id, token) => {
  const response = await axios.put(`${API_BASE_URL}/disable/${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};
