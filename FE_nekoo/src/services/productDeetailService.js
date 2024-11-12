import { toast } from "react-toastify";
import axios from "axios";

export const fetchProductDetails = async (productId, token) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/productDetail/getAll?productId=${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.code === 200 && data.message === "success") {
      return data.values;
    } else {
      toast.error("Failed to load product details!");
      return [];
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    toast.error("Failed to load product details!");
    return [];
  }
};
export const createProductDetail = async (formData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/productDetail/create", // API endpoint của bạn
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Đảm bảo Content-Type là multipart/form-data để gửi tệp
        },
      }
    );

    if (response.data.code === 200 && response.data.message === "success") {
      return response.data.values; // Trả về dữ liệu nếu thành công
    } else {
      toast.error("Không thể thêm chi tiết sản phẩm!");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Lỗi khi gửi dữ liệu lên server!");
    return null;
  }
};
