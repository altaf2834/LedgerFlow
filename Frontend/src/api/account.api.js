import axiosInstance from "./axiosInstance";

export const createAccount = async (data) => {
  // data: { name }
  const response = await axiosInstance.post("/accounts", data);
  return response.data;
};

export const getUserAccounts = async () => {
  const response = await axiosInstance.get("/accounts");
  return response.data;
};

export const getAccountBalance = async (accountId) => {
  const response = await axiosInstance.get(`/accounts/balance/${accountId}`);
  return response.data;
};