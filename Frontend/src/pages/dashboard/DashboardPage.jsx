import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardSummary } from "../../hooks/useDashBoardSummary";
import SummaryCard from "../../components/dashboard/SummaryCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

function DashboardPage() {
  const { accounts, balancesByCurrency, recentActivity, loading, error } = useDashboardSummary();
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  if (loading) {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-line rounded-lg p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-7 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-5 w-32 mb-3" />
      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

  // New-user empty state — no accounts yet, nothing to summarize
  if (!loading && accounts.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ink mb-6">Dashboard</h1>
        <div className="bg-white border border-line border-l-4 border-l-ledger rounded-lg p-10 text-center max-w-md mx-auto">
          <p className="font-display text-xl text-ink mb-2">Welcome to LedgerFlow</p>
          <p className="text-ink-soft text-sm mb-6">
            You don't have any accounts yet. Create your first account to start
            tracking balances and sending transactions.
          </p>
          <Button onClick={() => navigate("/accounts")} className="w-auto px-5 mx-auto">
            Create your first account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Accounts" value={accounts.length} accent="neutral" />

        {Object.entries(balancesByCurrency).map(([currency, total]) => (
          <SummaryCard
            key={currency}
            label={`Balance (${currency})`}
            value={
              revealed ? (
                `${currency === "INR" ? "₹" : currency} ${total.toFixed(2)}`
              ) : (
                <span className="tracking-widest">•••••</span>
              )
            }
            accent="ledger"
            action={
              <button
                onClick={() => setRevealed((r) => !r)}
                className="font-mono text-[10px] text-ledger hover:text-ledger-deep uppercase tracking-wide"
              >
                {revealed ? "Hide" : "Show"}
              </button>
            }
          />
        ))}
      </div>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      <h2 className="font-display text-lg text-ink mb-3">Recent Activity</h2>
      <RecentActivity transactions={recentActivity} loading={loading} error={error} />
    </div>
  );
}

export default DashboardPage;