import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Product START
export const loadShop = async (
  token,
  page,
  size,
  keySort,
  orderBy,
  searchName,
  c_id,
  minPrice,
  maxPrice
) => {
  const response = await axios.get(
    `${API_BASE_URL}/product/getAll?keySort=${keySort}&orderBy=${orderBy}&page=${page}&size=${size}&name=${searchName}&c_id=${c_id}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(`${API_BASE_URL}/product/getAll?keySort=${keySort}&orderBy=${orderBy}&page=${page}&size=${size}&name=${searchName}&c_id=${c_id}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
  
  if (!response.status) {
    throw new Error("Failed to fetch products: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data.values;
};

export const loadProductDetail = async (token, id) => {
  const response = await axios.get(`${API_BASE_URL}/product/get/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.status) {
    throw new Error("Failed to fetch productDetail: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data.values;
};
// Product END

// Cart START
// nhận obj CartRequest
export const addToCart = async (token, dataCart) => {
  const response = await axios.post(`${API_BASE_URL}/cart/create`, dataCart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.status) {
    throw new Error("Failed to fetch cart: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data;
};

export const loadCarts = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/cart/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.status) {
    throw new Error("Failed to fetch carts: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data.values;
};

// nhận obj CartRequest
export const updateCart = async (token, dataCart) => {
  const response = await axios.put(`${API_BASE_URL}/cart/update`, dataCart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.status) {
    throw new Error("Failed to fetch cart: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data.values;
};

export const deleteCart = async (token, pd_id) => {
  const response = await axios.delete(`${API_BASE_URL}/cart/delete?pd_id=${pd_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.status) {
    throw new Error("Failed to fetch cart: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }

  return data.values;
};
// Cart END

// Order START
// nhận obj OrderRequest
export const createOrder = async (token, orderData) => {
  const response = await axios.post(`${API_BASE_URL}/order/create`, orderData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.status) {
    throw new Error("Failed to fetch cart: " + response.statusText);
  }

  const data = response.data;

  if (!data.values) {
    throw new Error("Data format is not as expected");
  }
  return data.values;
};
// Order END
