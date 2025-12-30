import React, { useEffect, useMemo, useState } from "react";
import { PlusCircle, MinusCircle, Wallet, X } from "lucide-react";
import { getIncome, addIncome } from "../../services/IncomeService";
import { getExpenses } from "../../services/ExpenseService";
import { useNavigate } from "react-router-dom";

const MyWallet = () => {
  const navigate = useNavigate();

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: "",
  });

  /* ============ FETCH DATA ================= */
  const fetchWalletData = async () => {
    try {
      const incomeRes = await getIncome();
      const expenseRes = await getExpenses();

      // ✅ FIXED KEYS
      setIncomes(incomeRes?.income || incomeRes?.data || []);
      setExpenses(expenseRes?.expenses || expenseRes?.data || []);
    } catch (err) {
      console.error("Wallet fetch error", err);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  /* ================= CALCULATIONS ================= */
  const totalIncome = useMemo(
    () =>
      incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [incomes]
  );

  const totalExpense = useMemo(
    () =>
      expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const balance = totalIncome - totalExpense;

  /* ================= ACTIVITY FEED ================= */
  const activities = useMemo(() => {
    const incomeActivity = incomes.map((i) => ({
      title: i.source || i.title || "Income",
      amount: Number(i.amount || 0),
      date: i.date || new Date(),
    }));

    const expenseActivity = expenses.map((e) => ({
      title: e.title || "Expense",
      amount: -Number(e.amount || 0),
      date: e.date || new Date(),
    }));

    return [...incomeActivity, ...expenseActivity]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [incomes, expenses]);

  /* ================= ADD INCOME ================= */
  const handleAddIncome = async (e) => {
    e.preventDefault();

    const amount = Number(incomeForm.amount);
    if (!incomeForm.title || amount <= 0) {
      alert("Please fill valid title and amount");
      return;
    }

    try {
      await addIncome({
        source: incomeForm.title,
        amount,
        date: new Date(),
      });

      await fetchWalletData(); // ✅ refresh wallet

      setIncomeForm({ title: "", amount: "" });
      setShowIncomeModal(false);
    } catch (err) {
      alert("Failed to add income");
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="text-orange-400" size={28} />
        <h1 className="text-2xl font-bold">My Wallet</h1>
      </div>

      {/* BALANCE */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 mb-6">
        <p className="text-gray-400 text-sm">Savings</p>
        <h2
          className={`text-3xl font-bold mt-2 ${
            balance >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          ₹ {balance.toLocaleString()}
        </h2>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Stat label="Total Income" value={totalIncome} color="text-green-400" />
        <Stat label="Total Expenses" value={totalExpense} color="text-red-400" />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowIncomeModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-400"
        >
          <PlusCircle size={18} />
          Add Income
        </button>

        <button
          onClick={() => navigate("/add-expense")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1f1f1f] hover:bg-[#141414]"
        >
          <MinusCircle size={18} className="text-red-400" />
          Add Expense
        </button>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>

        <div className="text-sm text-gray-400 space-y-2">
          {activities.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            activities.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.title}</span>
                <span
                  className={
                    item.amount > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {item.amount > 0 ? "+" : "-"} ₹
                  {Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD INCOME MODAL */}
      {showIncomeModal && (
        <Modal onClose={() => setShowIncomeModal(false)}>
          <form onSubmit={handleAddIncome} className="space-y-4">
            <input
              type="text"
              placeholder="Income title"
              value={incomeForm.title}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, title: e.target.value })
              }
              className="input"
            />
            <input
              type="number"
              placeholder="Amount"
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, amount: e.target.value })
              }
              className="input"
            />
            <button className="btn-primary w-full">Add Income</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */
const Stat = ({ label, value, color }) => (
  <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-xl font-semibold mt-1 ${color}`}>
      ₹ {value.toLocaleString()}
    </p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl w-full max-w-md p-5">
      <div className="flex justify-end mb-2">
        <X
          className="cursor-pointer text-gray-400 hover:text-white"
          onClick={onClose}
        />
      </div>
      {children}
    </div>
  </div>
);

export default MyWallet;
