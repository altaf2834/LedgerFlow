import { useState, useEffect, useCallback } from "react";
import * as transactionApi from "../api/transaction.api";

export function useAccountTransactions(accountId) {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(
    async (page = 1) => {
      if (!accountId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await transactionApi.getAccountTransactions(accountId, page);
        setTransactions(data.transactions);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    },
    [accountId]
  );

  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  return { transactions, pagination, loading, error, refetch: fetchTransactions };
}