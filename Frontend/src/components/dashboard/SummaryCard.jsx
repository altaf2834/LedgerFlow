const accentStyles = {
  ledger: "border-l-ledger",
  neutral: "border-l-line",
};

function SummaryCard({ label, value, sublabel, accent = "neutral", action }) {
  return (
    <div className={`bg-white border border-line border-l-4 ${accentStyles[accent]} rounded-lg p-5`}>
      <div className="flex items-start justify-between mb-2">
        <p className="font-mono text-[11px] tracking-wider text-ink-soft uppercase">
          {label}
        </p>
        {action}
      </div>
      <p className="font-mono text-2xl text-ink">{value}</p>
      {sublabel && <p className="text-xs text-ink-soft mt-1">{sublabel}</p>}
    </div>
  );
}

export default SummaryCard;