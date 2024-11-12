import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/category";

export const loadCategories = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  
    const data = response.data

    if (!response.ok) {
      throw new Error("Failed to fetch orders: " + response.statusText);
    }
  
    if (!Array.isArray(data.values)) {
      throw new Error("Data format is not as expected");
    }
    return data.values; 
  };

  export const saveCategory = async (token, data) => {
    const response = await axios.post(`${API_BASE_URL}/save`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch category: " + response.statusText);
    }
  
    const data = response.data;
  
    return data.values; 
  };

  export const disableCategory = async (id, token) => {
    const response = await axios.put(`${API_BASE_URL}/disable/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to change status");
    }
  
    return await response.data;
  };