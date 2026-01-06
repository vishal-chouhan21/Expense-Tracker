import React from "react";
import { Zap, Home, Wallet, Calendar, Sun, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { getUserProfile } from "../../services/ProfileService";
import { useState, useEffect } from "react";

const Navbar = () => {

  const { toggleSidebar } = useSidebar();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getUserProfile();
       console.log("Profile fetched:", res);
      setProfile(res?.profile || null);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-3xl text-sm transition
     ${
       isActive
         ? "bg-[#1f1f1f] text-orange-400"
         : "text-gray-400 hover:text-white"
     }`;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-[#0f0f0f] border-b border-[#1f1f1f] z-50">
      <div className="flex items-center justify-between h-full px-6">

 {/* Mobile Menu */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-300 hover:text-white text-left"
          >
            <Menu size={22} />
          </button>
        {/* Logo */}
        <div className="sm:flex items-center gap-3 text-white font-bold text-lg">
          <Zap className="text-orange-500" size={20} />
          <span className="hidden sm:block">ExpensePro</span>
        </div>

        {/* Navigation */}
        <nav className="sm:gap-0 flex items-center gap-2 bg-[#0f0f0f] rounded-3xl">
          <NavLink to="/" className={linkClass}>
            <Home size={18} />
            <span className="hidden sm:block">Home</span>
          </NavLink>
          <NavLink to="/monthly" className={linkClass}>
            <Calendar size={18} />
            <span className="hidden sm:block">Monthly</span>
          </NavLink>
          <NavLink to="/daily" className={linkClass}>
            <Sun size={18} />
           <span className="hidden sm:block">Daily</span>
          </NavLink>
          <NavLink to="/my-wallet" className={linkClass}>
            <Wallet size={18} />
            <span className="hidden sm:block">Savings</span>
          </NavLink>
        </nav>

       <div>
  <button className="h-9 w-9 rounded-full bg-orange-500 text-black font-semibold
  flex items-center justify-center hover:bg-orange-600 transition">
    {loading
  ? "…"
  : profile?.name?.trim().charAt(0).toUpperCase() || ""}
  </button>
</div>


      </div>
    </header>
  );
};

export default Navbar;
