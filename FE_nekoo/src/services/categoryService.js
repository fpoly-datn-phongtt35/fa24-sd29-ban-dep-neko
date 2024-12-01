import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/category";

export const loadCategories = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/getAlll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};

export const loadCategoriesAvailable = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};

export const saveCategory = async (token, data) => {
  const response = await axios.post(`${API_BASE_URL}/save`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};

export const disableCategory = async (id, token) => {
  const response = await axios.put(`${API_BASE_URL}/disable/${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values;
};
