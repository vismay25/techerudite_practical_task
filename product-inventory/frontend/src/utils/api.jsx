import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchProducts = (params) =>
  axios.get(`${API_BASE_URL}/products`, { params });

export const createProduct = (data) =>
  axios.post(`${API_BASE_URL}/products`, data);

export const deleteProduct = (id) =>
  axios.delete(`${API_BASE_URL}/products/${id}`);

export const fetchCategories = () => axios.get(`${API_BASE_URL}/categories`);
