import { useState, useEffect, useCallback } from "react";
import * as accountApi from "../api/account.api";

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountApi.getUserAccounts();
      setAccounts(data.accounts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Exposed so the "Create Account" flow can trigger a refresh
  // without the component needing to know HOW refetching works.
  return { accounts, loading, error, refetch: fetchAccounts };
}