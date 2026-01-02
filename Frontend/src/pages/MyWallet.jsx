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

  /* ================= FETCH DATA ================= */
  const fetchWalletData = async () => {
    try {
      const incomeRes = await getIncome();
      const expenseRes = await getExpenses();

      setIncomes(incomeRes?.income || incomeRes?.data || []);
      setExpenses(expenseRes?.expenses || expenseRes?.data || []);
    } catch (err) {
      console.error("Wallet fetch error", err);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  /* ================= YEARLY TOTAL SAVINGS ================= */
  const yearlyTotals = useMemo(() => {
    const data = {};

    const allData = [
      ...incomes.map((i) => ({
        type: "income",
        amount: Number(i.amount || 0),
        date: i.date ? new Date(i.date) : new Date(),
      })),
      ...expenses.map((e) => ({
        type: "expense",
        amount: Number(e.amount || 0),
        date: e.date ? new Date(e.date) : new Date(),
      })),
    ];

    allData.forEach(({ type, amount, date }) => {
      const year = date.getFullYear();
      if (!data[year]) data[year] = { income: 0, expense: 0, net: 0 };

      if (type === "income") data[year].income += amount;
      else data[year].expense += amount;

      data[year].net = data[year].income - data[year].expense;
    });

    return Object.entries(data)
      .sort(([a], [b]) => b - a) // descending year
      .map(([year, val]) => ({ year, ...val }));
  }, [incomes, expenses]);

  /* ================= MONTHLY BALANCES (RESET EACH MONTH) ================= */
  const monthlyBalances = useMemo(() => {
    const data = {};

    const allData = [
      ...incomes.map((i) => ({
        type: "income",
        amount: Number(i.amount || 0),
        date: i.date ? new Date(i.date) : new Date(),
      })),
      ...expenses.map((e) => ({
        type: "expense",
        amount: Number(e.amount || 0),
        date: e.date ? new Date(e.date) : new Date(),
      })),
    ];

    allData.forEach(({ type, amount, date }) => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!data[key]) data[key] = { income: 0, expense: 0, net: 0 };

      if (type === "income") data[key].income += amount;
      else data[key].expense += amount;

      data[key].net = data[key].income - data[key].expense;
    });

    return Object.entries(data)
      .sort(
        ([a], [b]) =>
          new Date(b.split("-")[0], b.split("-")[1]) -
          new Date(a.split("-")[0], a.split("-")[1])
      )
      .map(([key, val]) => {
        const [year, monthIndex] = key.split("-");
        const month = new Date(year, monthIndex).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        return { month, ...val };
      });
  }, [incomes, expenses]);

  /* ================= RECENT ACTIVITY ================= */
  const activities = useMemo(() => {
    const incomeActivity = incomes.map((i) => ({
      title: i.source || i.title || "Income",
      amount: Number(i.amount || 0),
      date: i.date ? new Date(i.date) : new Date(),
    }));

    const expenseActivity = expenses.map((e) => ({
      title: e.title || "Expense",
      amount: -Number(e.amount || 0),
      date: e.date ? new Date(e.date) : new Date(),
    }));

    return [...incomeActivity, ...expenseActivity]
      .sort((a, b) => b.date - a.date)
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

      await fetchWalletData(); // refresh wallet
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

      {/* YEARLY TOTALS */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Yearly Total Savings</h3>
        {yearlyTotals.length === 0 ? (
          <p className="text-gray-400 text-sm">No data available</p>
        ) : (
          <div className="space-y-2">
            {yearlyTotals.map((y, i) => (
              <div key={i} className="flex justify-between">
                <span>{y.year}</span>
                <span
                  className={
                    y.net >= 0
                      ? "text-green-400 font-medium"
                      : "text-red-400 font-medium"
                  }
                >
                  ₹ {y.net.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MONTHLY BALANCES */}
      <div className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Monthly Balance</h3>
        {monthlyBalances.length === 0 ? (
          <p className="text-gray-400 text-sm">No data available</p>
        ) : (
          <div className="space-y-2">
            {monthlyBalances.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span>{m.month}</span>
                <span
                  className={
                    m.net >= 0
                      ? "text-green-400 font-medium"
                      : "text-red-400 font-medium"
                  }
                >
                  ₹ {m.net.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
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
                  className={item.amount > 0 ? "text-green-400" : "text-red-400"}
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
