import { useState, useEffect, useCallback } from "react";
import * as accountApi from "../api/account.api";
import * as transactionApi from "../api/transaction.api";

export function useDashboardSummary() {
  const [accounts, setAccounts] = useState([]);
  const [balancesByCurrency, setBalancesByCurrency] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { accounts } = await accountApi.getUserAccounts();
      setAccounts(accounts);

      const ownAccountIds = new Set(accounts.map((a) => a._id));

      // Fetch balance + recent transactions for every account in parallel —
      // fine at small scale (a handful of accounts), not meant to scale to hundreds.
      const results = await Promise.all(
        accounts.map(async (acc) => {
          const [balanceRes, txRes] = await Promise.all([
            accountApi.getAccountBalance(acc._id),
            transactionApi.getAccountTransactions(acc._id, 1, 5),
          ]);
          return {
            accountId: acc._id,
            currency: acc.currency,
            balance: balanceRes.balance,
            transactions: txRes.transactions,
          };
        })
      );

      // Sum balances per currency (never mixed across currencies)
      const totals = {};
      results.forEach(({ currency, balance }) => {
        totals[currency] = (totals[currency] || 0) + balance;
      });
      setBalancesByCurrency(totals);

      // Merge all transactions, dedupe (internal transfers appear once per side),
      // sort newest first, take top 8.
      const seen = new Map();
      results.forEach(({ transactions }) => {
        transactions.forEach((tx) => {
          if (!seen.has(tx._id)) seen.set(tx._id, tx);
        });
      });

      const merged = Array.from(seen.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8)
        .map((tx) => {
          const fromIsOwn = ownAccountIds.has(tx.fromAccount._id);
          const toIsOwn = ownAccountIds.has(tx.toAccount._id);
          return {
            ...tx,
            direction: fromIsOwn && toIsOwn ? "internal" : fromIsOwn ? "out" : "in",
          };
        });

      setRecentActivity(merged);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { accounts, balancesByCurrency, recentActivity, loading, error, refetch: fetchSummary };
}