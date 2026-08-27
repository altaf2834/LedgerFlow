function Button({ children, loading, variant = "primary", className = "", ...props }) {
  const base =
    "w-full py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-ledger text-white hover:bg-ledger-deep",
    ghost: "bg-transparent text-ink-soft hover:text-ink",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export default Button;