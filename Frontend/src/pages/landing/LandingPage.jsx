import { Link } from "react-router-dom";


const features = [
  {
    title: "Accounts",
    description: "Create and manage multiple accounts, each with its own status and balance.",
  },
  {
    title: "Transactions",
    description: "Send money between accounts with built-in concurrency and idempotency protection.",
  },
  {
    title: "Dashboard",
    description: "See your total balance and recent activity across every account, at a glance.",
  },
];

function LandingPage() {
  return (
    <div className="bg-paper min-h-screen font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5 border-b border-line">
        <span className="font-display text-xl text-ledger">LedgerFlow</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-ink-soft hover:text-ink font-medium">
            Log in
          </Link>
          <Link to="/register">
            <button className="bg-ledger text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-ledger-deep transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      {/* Hero */}
<section className="relative overflow-hidden px-6 sm:px-12 py-20 sm:py-28 text-center">
  <div
    className="absolute inset-0 opacity-[0.04] pointer-events-none"
    style={{
      backgroundImage:
        "repeating-linear-gradient(to bottom, transparent, transparent 39px, #0B6E4F 39px, #0B6E4F 40px)",
    }}
  />
  <div className="relative max-w-2xl mx-auto">
    <p className="font-mono text-[11px] tracking-wider text-ledger uppercase mb-4">
      Accounts · Transactions · Balances
    </p>
    <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-5">
      Every entry, balanced.
    </h1>
    <p className="text-ink-soft text-base sm:text-lg mb-3 max-w-lg mx-auto">
      LedgerFlow keeps your accounts and transactions precise, auditable,
      and easy to track — built for people who care where every rupee goes.
    </p>

    {/* New: welcome funding callout */}
    <div className="inline-flex items-center gap-2 bg-ledger/10 text-ledger font-mono text-xs px-3 py-1.5 rounded-full mb-8">
      <span>₹10,000</span>
      <span className="text-ink-soft">credited free on your first account</span>
    </div>

    <div>
      <Link to="/register">
        <button className="bg-ledger text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-ledger-deep transition-colors">
          Create your account
        </button>
      </Link>
    </div>
  </div>
</section>
      {/* Features */}
      <section className="px-6 sm:px-12 py-16 border-t border-line">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-line rounded-lg p-6">
              <h3 className="font-display text-lg text-ink mb-2">{f.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 border-t border-line text-center">
        <p className="font-mono text-xs text-ink-soft">
          LedgerFlow — built with precision.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;