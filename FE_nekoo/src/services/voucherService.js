import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const GET_ALL_VOUCHERS_URL = `${API_BASE_URL}/voucher/getAll`;
const GET_ALL_VOUCHERS_ENABLE_URL = `${API_BASE_URL}/voucher/getAllEnable`;
const DISABLE_VOUCHER_URL = `${API_BASE_URL}/voucher/disable`;
const UPDATE_VOUCHER_URL = `${API_BASE_URL}/voucher/update`; // New update voucher URL

export const fetchVouchers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(GET_ALL_VOUCHERS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code === 200) {
      return response.data.values.content;
    } else {
      console.error("Error fetching vouchers:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};
export const fetchVouchersEnable = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(GET_ALL_VOUCHERS_ENABLE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.code === 200) {
      return response.data.values.content;
    } else {
      console.error("Error fetching vouchers:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return [];
  }
};

export const addVoucher = async (voucherData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/voucher/create`,
      voucherData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === 200) {
      return response.data.message;
    } else {
      console.error("Error adding voucher:", response.data.message);
    }
  } catch (error) {
    console.error("Error adding voucher:", error);
  }
};

export const disableVoucher = async (voucherId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${DISABLE_VOUCHER_URL}?ids=${voucherId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === 200) {
      return response.data.message;
    } else {
      console.error("Error disabling voucher:", response.data.message);
    }
  } catch (error) {
    console.error("Error disabling voucher:", error);
  }
};

// New update function
export const updateVoucher = async (voucherId, discount) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      UPDATE_VOUCHER_URL,
      { v_id: voucherId, discount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.code === 200) {
      return response.data.message;
    } else {
      console.error("Error updating voucher:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating voucher:", error);
  }
};
