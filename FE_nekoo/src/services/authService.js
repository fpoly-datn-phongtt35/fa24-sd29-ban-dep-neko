// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/auth";

// Hàm login để gửi yêu cầu đăng nhập
export const login = (username, password) => {
  return axios
    .post(`${API_URL}/login`, {
      username,
      password,
    })
    .then((response) => response.data); // Trả về dữ liệu nếu thành công
};
