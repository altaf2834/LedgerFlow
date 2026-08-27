import axiosInstance from "./axiosInstance";

/**
 * Each function here maps 1:1 to a backend route.
 * They do ONE job: make the call, return the data.
 * No localStorage writes, no state updates, no redirects here —
 * that logic belongs in AuthContext, which will call these functions.
 */

export const registerUser = async (userData) => {
  // userData: { name, email, password, ... } — whatever your backend expects
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // credentials: { email, password }
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};