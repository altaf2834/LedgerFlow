import { useAccounts } from "../../hooks/useAccounts";

function AccountSelector({ value, onChange, label = "Account" }) {
  const { accounts, loading } = useAccounts();

  return (
    <div className="mb-4">
      <label className="block font-mono text-[11px] tracking-wider text-ink-soft uppercase mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white border border-line rounded-md text-ink text-sm outline-none focus:border-ledger focus:ring-1 focus:ring-ledger"
        disabled={loading}
      >
        <option value="">{loading ? "Loading accounts…" : "Select an account"}</option>
        {accounts.map((acc) => (
          <option key={acc._id} value={acc._id}>
            {acc.name} · •• {acc._id.slice(-6)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AccountSelector;