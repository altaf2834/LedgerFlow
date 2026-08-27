// Shared shell for Login/Register — keeps the brand panel + ruled-line
// signature in ONE place instead of duplicating it on both pages.

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-paper font-sans">
      {/* Brand panel — hidden on mobile, shown on md+ */}
      <div className="hidden md:flex md:w-2/5 bg-ledger relative overflow-hidden flex-col justify-between p-12">
        {/* Ledger-ruled line texture — the signature element */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 39px, #ffffff 39px, #ffffff 40px)",
          }}
        />
        <div className="relative">
          <span className="font-display text-2xl text-white tracking-tight">
            LedgerFlow
          </span>
        </div>
        <div className="relative">
          <p className="font-display text-3xl text-white leading-snug">
            Every entry,
            <br />
            balanced.
          </p>
          <p className="font-mono text-xs text-white/60 mt-4 tracking-wide">
            ACCOUNTS · TRANSACTIONS · BALANCES
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only compact brand mark */}
          <span className="md:hidden font-display text-xl text-ledger block mb-8">
            LedgerFlow
          </span>

          <h1 className="font-display text-3xl text-ink mb-2">{title}</h1>
          <p className="text-ink-soft text-sm mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;