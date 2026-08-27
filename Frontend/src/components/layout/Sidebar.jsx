import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/transactions", label: "Transactions" },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-line flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-line">
        <span className="font-display text-xl text-ledger">LedgerFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="font-mono text-[10px] tracking-wider text-ink-soft uppercase px-3 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ledger/10 text-ledger"
                      : "text-ink-soft hover:bg-paper hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-line">
        <p className="text-sm text-ink font-medium truncate">{user?.name}</p>
        <p className="text-xs text-ink-soft truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-ink-soft hover:text-error transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;