// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8080";

// Hàm login để gửi yêu cầu đăng nhập
export const login = (username, password) => {
  return axios
    .post(`${API_URL}/auth/login`, {
      username,
      password,
    })
    .then((response) => response.data); // Trả về dữ liệu nếu thành công
};

export const registor = (
  username,
  password,
  name,
  phone,
  cccd,
  dob,
  gender,
  address,
  role
) => {
  return axios
    .post(`${API_URL}/customer/create-account-customer`, {
      username,
      password,
      phone,
      cccd,
      name,
      dob,
      gender,
      address,
      role,
    })
    .then((response) => response.data); // Trả về dữ liệu nếu thành công
};
