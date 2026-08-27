import { useState } from "react";
import AccountBalance from "./AccountBalance";

const statusStyles = {
  ACTIVE: "bg-ledger/10 text-ledger",
  FROZEN: "bg-amber-100 text-amber-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

function AccountCard({ account }) {
  const [copied, setCopied] = useState(false);

  const copyAccountId = async () => {
    await navigator.clipboard.writeText(account._id);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="bg-white border border-line rounded-lg p-5 hover:border-ledger/40 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-lg text-ink">
          {account.name}
        </h3>

        <span
          className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded ${
            statusStyles[account.status]
          }`}
        >
          {account.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-ink-soft mb-1">
          A/C No.
        </p>

        <button
            onClick={copyAccountId}
            className="font-mono text-xs text-ink-soft hover:text-ledger transition-colors"
            title="Click to copy full Account ID"
          >
            {copied ? "Copied!" : `•• ${account._id.slice(-8)}`}
        </button>
      </div>

      <AccountBalance
        accountId={account._id}
        currency={account.currency}
      />

      <p className="text-xs text-ink-soft mt-4">
        Created {new Date(account.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default AccountCard;