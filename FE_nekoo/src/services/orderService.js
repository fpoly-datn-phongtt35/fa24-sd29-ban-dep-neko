import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const GET_ALL_ORDERS_URL = `${API_BASE_URL}/order/getAll`;
const GET_CODE_ORDER_URL = `${API_BASE_URL}/order/get`;
const CREATE_ORDER_URL = `${API_BASE_URL}/order/create`;
const CHANGESTATUS_ORDER_URL = `${API_BASE_URL}/order/changeStatus`;

export const loadOrders = async (token) => {
    const response = await axios.get(`${GET_ALL_ORDERS_URL}`, {
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
    return data.values; // Return the list of products
  };

  export const loadOrderByCode = async (token, code) => {
    const response = await axios.get(`${GET_CODE_ORDER_URL}/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch order: " + response.statusText);
    }
  
    const data = response.data;
 
    return data.values; // Return the list of products
  };

  export const changeStatus = async (id, status, toStatus, token) => {
    const response = await axios.put(`${CHANGESTATUS_ORDER_URL}?id=${id}&status=${status}&toStatus=${toStatus}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to change status");
    }
  
    return await response.data; // Return the response if needed
  };