import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import StatCard from "../components/StatCard";
import CategoryAnalytics from "../components/CategoryAnalyzer";
import Calendar from "../components/Calendar";
import { addExpense, getExpenses } from "../../services/ExpenseService";
import { getIncome } from "../../services/IncomeService";
import ExpenseList from "./ExpenseList";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const today = new Date();
  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseRes = await getExpenses();
        const incomeRes = await getIncome();

        setExpenses(expenseRes?.expenses || []);
        setIncome(incomeRes?.income || []);
      } catch (err) {
        console.error("Dashboard data error", err);
      }
    };
    fetchData();
  }, []);

  /* ================= HELPER ================= */
  const getMonthlyIncome = (monthOffset = 0) => {
    const refDate = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1
    );

    return income
      .filter((i) => {
        const d = new Date(i.date);
        return (
          d.getMonth() === refDate.getMonth() &&
          d.getFullYear() === refDate.getFullYear()
        );
      })
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
  };

  /* ================= CALCULATIONS ================= */

  // 👉 Carry-forward income logic
  let monthlyIncome = getMonthlyIncome(0); // current month
  if (monthlyIncome === 0) {
    monthlyIncome = getMonthlyIncome(-1); // last month
  }

  const monthlyExpense = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const todayExpense = expenses
    .filter(
      (e) => new Date(e.date).toDateString() === today.toDateString()
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalSaving = monthlyIncome - monthlyExpense;

  /* ================= FORM ================= */
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.note,
      });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? "Close" : "+ Add Expense"}
        </button>
      </div>

      {/* ADD EXPENSE FORM */}
      {showForm && (
        <div className="max-w-md p-6 border border-[#1f1f1f] rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

          <input type="file" onChange={handleFileUpload} />
          {scanning && <p className="text-orange-400 text-sm">Scanning receipt...</p>}

          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 bg-[#141414]" />
            <input name="amount" type="number" placeholder="Amount" onChange={handleChange} className="w-full p-2 bg-[#141414]" />
            <select name="category" onChange={handleChange} className="w-full p-2 bg-[#141414]">
              <option value="">Category</option>
              <option value="Daily">Daily</option>
              <option value="Food">Food</option>
              <option value="Personal">Personal</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Vegitable">Vegitable</option>
              <option value="Grocery">Grocery</option>
              <option value="Dairy">Dairy</option>
              <option value="Health">Health</option>
              <option value="Study">Study</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
            </select>
            <input name="date" type="date" onChange={handleChange} className="w-full p-2 bg-[#141414]" />
            <textarea name="note" placeholder="Note" onChange={handleChange} className="w-full p-2 bg-[#141414]" />
            <button disabled={loading} className="bg-orange-500 w-full py-2 rounded">
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      )}

      {/* STATS */}
      <button
        onClick={() => navigate("/add-income")}
        className="flex items-center gap-1 bg-orange-500 text-black px-3 py-1 rounded-lg"
      >
        <PlusCircle size={18} /> Add Income
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard title="Monthly Income" amount={`₹ ${monthlyIncome.toLocaleString()}`} />
        <StatCard title="Savings" amount={`₹ ${totalSaving.toLocaleString()}`} />
        <StatCard title="Monthly Expense" amount={`₹ ${monthlyExpense.toLocaleString()}`} />
        <StatCard title="Today Expense" amount={`₹ ${todayExpense.toLocaleString()}`} />
      </div>

      {/* ANALYTICS */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryAnalytics />
        </div>
        <Calendar />
      </div>

      <ExpenseList />
    </div>
  );
};

export default Home;
