const directionStyles = {
  out: { sign: "−", color: "text-error" },
  in: { sign: "+", color: "text-ledger" },
  internal: { sign: "⇄", color: "text-ink-soft" },
};

import Skeleton from "../ui/Skeleton";

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}



function RecentActivity({ transactions, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white border border-line rounded-lg divide-y divide-line">
        {[1, 2, 3].map((i) => <RowSkeleton key={i} />)}
      </div>
    );
  }
  if (error) return <p className="text-error text-sm">{error}</p>;
  if (transactions.length === 0)
    return <p className="text-ink-soft text-sm">No transactions yet.</p>;

  return (
    <div className="bg-white border border-line rounded-lg divide-y divide-line">
      {transactions.map((tx) => {
        const style = directionStyles[tx.direction];
        return (
          <div key={tx._id} className="flex items-center justify-between px-5 py-3.5">
            <div>
              <p className="text-sm text-ink font-medium">
                {tx.direction === "internal"
                  ? `${tx.fromAccount.name} → ${tx.toAccount.name}`
                  : tx.direction === "out"
                  ? `To ${tx.toAccount.name}`
                  : `From ${tx.fromAccount.name}`}
              </p>
              <p className="font-mono text-[11px] text-ink-soft">
                {new Date(tx.createdAt).toLocaleString()} · {tx.status}
              </p>
            </div>
            <span className={`font-mono text-sm ${style.color}`}>
              {style.sign} {tx.amount.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RecentActivity;