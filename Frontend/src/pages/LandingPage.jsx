import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Manage your <br />
            money in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              best possible way
            </span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-lg">
            ExpensePro helps you track expenses, analyze spending,
            and manage your finances smarter with real-time insights.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4 mt-8">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 text-black font-semibold hover:opacity-90 transition">
              Get Started
            </button>

            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-700 hover:bg-[#1a1a1f] transition">
              ▶ Watch Video
            </button>
          </div>

          {/* STORE BUTTONS */}
          <div className="flex gap-4 mt-8">
            <div className="bg-[#1a1a1f] px-4 py-2 rounded-lg text-sm">
               App Store
            </div>
            <div className="bg-[#1a1a1f] px-4 py-2 rounded-lg text-sm">
              ▶ Google Play
            </div>
          </div>
        </div>

        {/* RIGHT MOCKUP */}
        <div className="relative flex justify-center">
          <div className="absolute w-72 h-72 bg-green-400/20 rounded-full blur-3xl"></div>

          <div className="bg-[#111118] border border-[#1f1f2a] rounded-3xl p-6 shadow-2xl w-72 rotate-6">
            <p className="text-sm text-gray-400">Total Balance</p>
            <h2 className="text-3xl font-bold mt-2">₹54,280</h2>

            <div className="mt-6 bg-[#1a1a25] p-4 rounded-xl">
              <p className="text-xs text-gray-400">Monthly Spend</p>
              <h3 className="text-xl font-semibold text-orange-400">
                ₹18,320
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="border-t border-[#1a1a25] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div>
            <h3 className="text-3xl font-bold text-green-400">
              120M+
            </h3>
            <p className="text-gray-400 text-sm">
              Active Users
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-cyan-400">
              40M+
            </h3>
            <p className="text-gray-400 text-sm">
              App Downloads
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">
              10M+
            </h3>
            <p className="text-gray-400 text-sm">
              5★ Reviews
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
