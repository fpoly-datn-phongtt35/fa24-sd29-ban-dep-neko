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

export const updateCustomer = async (customer) => {
  const token = localStorage.getItem("token");
  await axios.put(`${API_URL}/${customer.id}`, customer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
