import axios from "axios";

const API_URL = "http://localhost:8080/customer";

export const fetchCustomer = async (token) => {
  const response = await axios.get(`${API_URL}/viewAllCustomer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values; // Trả về danh sách nhân viên
};

export const fetchOneCustomer = async (id, token) => {
  const response = await axios.get(`${API_URL}/viewById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values.userDetail;
  
};

export const updateCustomer = async (id, customer) => {
  const token = localStorage.getItem("token");
  await axios.put(`${API_URL}/${id}`, customer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
