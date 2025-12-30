import React from "react";
import { FiUser, FiLock, FiCreditCard, FiLogOut } from "react-icons/fi";

const Settings = () => {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* PROFILE */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FiUser className="text-orange-400" />
            <h2 className="font-semibold">Profile</h2>
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p>Name: <span className="text-white">User</span></p>
            <p>Email: <span className="text-white">user@email.com</span></p>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FiLock className="text-orange-400" />
            <h2 className="font-semibold">Security</h2>
          </div>

          <button className="text-sm text-orange-400 hover:underline">
            Change Password
          </button>
        </div>

        {/* PAYMENT PREFERENCE */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <FiCreditCard className="text-orange-400" />
            <h2 className="font-semibold">Default Payment Method</h2>
          </div>

          <select className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded text-sm">
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>

        {/* APP INFO */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 text-sm text-gray-400">
          <p>Theme: Dark</p>
          <p>Version: 1.0.0</p>
        </div>

        {/* LOGOUT */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <button className="flex items-center gap-2 text-red-400 hover:underline text-sm">
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
