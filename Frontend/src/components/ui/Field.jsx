// Mono-label styling is the signature detail carried into the form itself —
// labels read like ledger field tags (EMAIL, PASSWORD) rather than generic floating labels.

function Field({ label, error, ...inputProps }) {
  return (
    <div className="mb-4">
      <label className="block font-mono text-[11px] tracking-wider text-ink-soft uppercase mb-1.5">
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-ink text-sm
          placeholder:text-ink-soft/50 outline-none transition-colors
          focus:border-ledger focus:ring-1 focus:ring-ledger
          ${error ? "border-error" : "border-line"}`}
      />
      {error && <p className="text-error text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export default Field;