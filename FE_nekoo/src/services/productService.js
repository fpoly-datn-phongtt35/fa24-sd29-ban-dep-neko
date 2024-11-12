const API_BASE_URL = "http://localhost:8080/api/product"; // Base URL for your API

export const loadProducts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/viewAll`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products: " + response.statusText);
  }

  const data = await response.json();

  if (!Array.isArray(data.values)) {
    throw new Error("Data format is not as expected");
  }
  return data.values; // Return the list of products
};

export const addProduct = async (newProduct, productDetails, token) => {
  const formData = new FormData();
  formData.append("name", newProduct.name);
  formData.append("material", newProduct.material);
  formData.append("vat", newProduct.vat);
  formData.append("price", newProduct.price);
  formData.append("category.c_Id", newProduct.category.c_Id); // Updated to use category.c_Id

  productDetails.forEach((detail, index) => {
    formData.append(`productDetails[${index}].size`, detail.size);
    formData.append(`productDetails[${index}].color`, detail.color);
    formData.append(`productDetails[${index}].quantity`, detail.quantity);
    formData.append(`productDetails[${index}].image`, detail.image);
  });

  const response = await fetch(`${API_BASE_URL}/create`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return await response.json(); // Return the response if needed
};

export const updateProduct = async (productData, token) => {
  const response = await fetch(`${API_BASE_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
    body: JSON.stringify(productData), // Convert productData to JSON format
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return await response.json(); // Return the response if needed
};

export const toggleProductStatus = async (productId, token) => {
  const response = await fetch(`${API_BASE_URL}/disable/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the request
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle product status");
  }

  return await response.json(); // Return the response if needed
};
