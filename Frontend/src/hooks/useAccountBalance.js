import { useState, useEffect } from "react";
import * as accountApi from "../api/account.api";

export function useAccountBalance(accountId) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false; // guards against setting state if component unmounts mid-fetch

    async function fetchBalance() {
      try {
        const data = await accountApi.getAccountBalance(accountId);
        if (!ignore) setBalance(data.balance);
      } catch {
        if (!ignore) setBalance(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBalance();
    return () => {
      ignore = true;
    };
  }, [accountId]);

  return { balance, loading };
}