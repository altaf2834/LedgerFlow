import { useState } from "react";
import * as accountApi from "../../api/account.api";

function AccountBalance({ accountId, currency }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkBalance = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await accountApi.getAccountBalance(accountId);
      setBalance(data.balance);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (balance !== null) {
    return (
      <span className="font-mono text-lg text-ink">
        {currency === "INR" ? "₹" : currency} {balance.toFixed(2)}
      </span>
    );
  }

  return (
    <button
      onClick={checkBalance}
      disabled={loading}
      className="text-sm font-medium text-ledger hover:text-ledger-deep disabled:opacity-60 transition-colors"
    >
      {loading ? "Checking…" : error ? "Retry" : "Check balance"}
    </button>
  );
}

export default AccountBalance;