import axios from "axios";

const API_URL = "http://localhost:8080/staff";

export const fetchStaff = async (token) => {
  const response = await axios.get(`${API_URL}/viewAllStaff`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.values; // Trả về danh sách nhân viên
};

export const updateStaff = async (staff) => {
  const token = localStorage.getItem("token");
  await axios.put(`${API_URL}/${staff.id}`, staff, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
