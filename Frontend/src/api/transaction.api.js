import axiosInstance from "./axiosInstance";

export const createTransaction = async (data) => {
  // data: { fromAccount, toAccount, amount, idempotencyKey }
  const response = await axiosInstance.post("/transactions", data);
  return response.data;
};

export const getAccountTransactions = async (accountId, page = 1, limit = 20) => {
  const response = await axiosInstance.get(`/transactions/${accountId}`, {
    params: { page, limit },
  });
  return response.data;
};