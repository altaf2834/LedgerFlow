import Sidebar from "./Sidebar";

function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default AppShell;