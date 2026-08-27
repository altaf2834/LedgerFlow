import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AccountsPage from "../pages/accounts/AccountPage";
import TransactionsPage from "../pages/transactionsPage/TransactionsPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LandingPage from "../pages/landing/LandingPage";
// Placeholder imports — real pages come next
// import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LandingPage/>}/>
      {/* Protected routes — everything nested here requires auth */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/accounts" element={<AccountsPage/>}/>
        <Route path="/transactions" element={<TransactionsPage/>}/>
      </Route>
    </Routes>
  );
}

export default AppRoutes;