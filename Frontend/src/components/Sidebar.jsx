import React from "react";
import {
  Wallet,
  ArrowLeftRight,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  Home,
  PowerIcon,
  ListChecksIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/UserContext";
const Sidebar = () => {
  const navigate = useNavigate();
  const { open, closeSidebar } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
     ${
       isActive
         ? "bg-[#1f1f1f] text-orange-400"
         : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
     }`;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#0f0f0f]
        border-r border-[#1f1f1f] z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          {/* Mobile Close */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={closeSidebar}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {/* MAIN */}
          <p className="text-xs text-gray-500 mb-2 uppercase">Main</p>
          <nav className="flex flex-col gap-1 mb-6">
            <NavLink to="/" className={linkClass} onClick={closeSidebar}>
              <Home size={18} /> Home
            </NavLink>
            <NavLink
              to="/my-wallet"
              className={linkClass}
              onClick={closeSidebar}
            >
              <Wallet size={18} /> My Wallet
            </NavLink>
            <NavLink
              to="/transactions"
              className={linkClass}
              onClick={closeSidebar}
            >
              <ListChecksIcon size={18} /> Expense List
            </NavLink>
            <NavLink
              to="/payments"
              className={linkClass}
              onClick={closeSidebar}
            >
              <CreditCard size={18} /> Payments
            </NavLink>
            <NavLink
              to="/analytics-all"
              className={linkClass}
              onClick={closeSidebar}
            >
              <BarChart3 size={18} /> Analytics
            </NavLink>
          </nav>

          {/* TOOLS */}
          <p className="text-xs text-gray-500 mb-2 uppercase">Tools</p>
          <nav className="flex flex-col gap-1 mb-6">
            <NavLink
              to="/settings"
              className={linkClass}
              onClick={closeSidebar}
            >
              <Settings size={18} /> Settings
            </NavLink>
            <NavLink to="/help" className={linkClass} onClick={closeSidebar}>
              <HelpCircle size={18} /> Help Center
            </NavLink>
            <NavLink
              to="/login"
              className={linkClass}
              onClick={() => {
                handleLogout();
                closeSidebar();
              }}
            >
              <PowerIcon size={18} /> Logout
            </NavLink>
          </nav>

          {/* Upgrade */}
          <div className="mt-auto bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-sm">
            <p className="font-semibold mb-1">Upgrade Pro 🚀</p>
            <p className="text-xs opacity-90 mb-3">
              Unlock advanced analytics & reports
            </p>
            <button className="w-full bg-black/30 hover:bg-black/40 py-1.5 rounded-lg text-xs">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
