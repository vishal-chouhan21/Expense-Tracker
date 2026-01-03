import React, { useState, useEffect } from "react";
import { Edit2Icon, PlusCircle, X } from "lucide-react";
import StatCard from "../components/StatCard";
import CategoryAnalytics from "../components/CategoryAnalyzer";
import Calendar from "../components/Calendar";
import { addExpense, getExpenses } from "../../services/ExpenseService";
import { getIncome, addIncome, editIncome } from "../../services/IncomeService";
import ExpenseList from "./ExpenseList";

const Home = () => {
  /* ================= STATES ================= */
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showIncomePopup, setShowIncomePopup] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const today = new Date();
  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */
  const fetchDashboardData = async () => {
    try {
      const expenseRes = await getExpenses();
      const incomeRes = await getIncome();

      setExpenses(expenseRes?.expenses || []);
      setIncome(incomeRes?.income || incomeRes?.data || []);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ================= INCOME FORM ================= */
  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    source: "",
    date: "",
  });

  const openAddIncome = () => {
    setEditingIncome(null);
    setIncomeForm({
      amount: "",
      source: "",
      date: today.toISOString().slice(0, 10),
    });
    setShowIncomePopup(true);
  };

  const openEditIncome = () => {
    if (!income.length) return;

    const latest = [...income].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    setEditingIncome(latest);
    setIncomeForm({
      amount: latest.amount,
      source: latest.source || "",
      date: latest.date.slice(0, 10),
    });

    setShowIncomePopup(true);
  };

  const handleIncomeSave = async () => {
    if (!incomeForm.amount || !incomeForm.date) {
      alert("Fill required fields");
      return;
    }

    try {
      if (editingIncome) {
        await editIncome(editingIncome._id, {
          amount: Number(incomeForm.amount),
          source: incomeForm.source,
          date: incomeForm.date,
        });
      } else {
        await addIncome({
          amount: Number(incomeForm.amount),
          source: incomeForm.source,
          date: incomeForm.date,
        });
      }

      await fetchDashboardData(); // 🔥 REFRESH
      setShowIncomePopup(false);
      setEditingIncome(null);
    } catch (err) {
      alert("Income save failed");
    }
  };

  /* ================= HELPERS ================= */
  const getMonthlyIncome = () =>
    income
      .filter((i) => {
        const d = new Date(i.date);
        return (
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const monthlyIncome = getMonthlyIncome(); // ✅ NO carry forward

  const monthlyExpense = expenses
    .filter((e) => e?.date)
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const todayExpense = expenses
    .filter((e) => e?.date)
    .filter(
      (e) => new Date(e.date).toDateString() === today.toDateString()
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalSaving = monthlyIncome - monthlyExpense;

  /* ================= EXPENSE FORM ================= */
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("receipt", file);

    try {
      setScanning(true);
      const res = await fetch("http://localhost:3000/api/scan-receipt", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          title: data.title || prev.title,
          amount: data.amount || prev.amount,
          date: data.date || prev.date,
          category: data.category || prev.category,
          note: "Scanned from receipt",
        }));
      }
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      alert("Fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.note,
      });
      setExpenses((prev) => [...prev, res.expense]);
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 px-4 py-2 rounded"
        >
          {showForm ? "Close" : "+ Add Expense"}
        </button>
      </div>

      {/* ADD INCOME */}
      <button
        onClick={openAddIncome}
        className="bg-orange-500 text-black px-3 py-1 rounded flex gap-1 items-center"
      >
        <PlusCircle size={18} /> Add Income
      </button>

      {/* edit INCOME */}
      <button
        onClick={openEditIncome}
        className="bg-green-500 text-white p-1 rounded flex gap-1 items-center mt-2"
      >
        <Edit2Icon size={18} />
      </button>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <div>
          <StatCard title="Monthly Income" amount={`₹ ${monthlyIncome}`} />
        </div>
        <StatCard title="Savings" amount={`₹ ${totalSaving}`} />
        <StatCard title="Monthly Expense" amount={`₹ ${monthlyExpense}`} />
        <StatCard title="Today Expense" amount={`₹ ${todayExpense}`} />
      </div>

      {/* ANALYTICS */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryAnalytics />
        </div>
        <Calendar />
      </div>

      <ExpenseList />

      {/* INCOME POPUP */}
      {showIncomePopup && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2>{editingIncome ? "Edit Income" : "Add Income"}</h2>
              <X onClick={() => setShowIncomePopup(false)} />
            </div>

            <input
              type="number"
              className="w-full p-2 mb-3 bg-[#111]"
              placeholder="Amount"
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, amount: e.target.value })
              }
            />
            <input
              className="w-full p-2 mb-3 bg-[#111]"
              placeholder="Source"
              value={incomeForm.source}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, source: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-2 mb-4 bg-[#111]"
              value={incomeForm.date}
              onChange={(e) =>
                setIncomeForm({ ...incomeForm, date: e.target.value })
              }
            />

            <button
              onClick={handleIncomeSave}
              className="w-full bg-orange-500 py-2 rounded"
            >
              Save Income
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
