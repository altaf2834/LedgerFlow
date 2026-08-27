import { useState } from "react";
import { useAccountTransactions } from "../../hooks/useAccountTransaction"
import AccountSelector from "../../components/transactions/AccountSelector";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionHistoryList from "../../components/transactions/TransactionHistoryList";

function TransactionsPage() {
  const [tab, setTab] = useState("send"); // "send" | "history"
  const [historyAccountId, setHistoryAccountId] = useState("");

  const { transactions, loading, error, refetch } = useAccountTransactions(historyAccountId);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Transactions</h1>

      <div className="flex gap-1 mb-6 border-b border-line">
        {["send", "history"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? "border-ledger text-ledger" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t === "send" ? "Send Money" : "History"}
          </button>
        ))}
      </div>

      {tab === "send" && (
        <div className="max-w-md">
          <TransactionForm onSuccess={() => refetch(1)} />
        </div>
      )}

      {tab === "history" && (
        <div className="max-w-md">
          <AccountSelector
            label="View history for"
            value={historyAccountId}
            onChange={setHistoryAccountId}
          />
          {historyAccountId ? (
            <TransactionHistoryList
              transactions={transactions}
              loading={loading}
              error={error}
              accountId={historyAccountId}
            />
          ) : (
            <p className="text-ink-soft text-sm">Select an account to view its history.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;