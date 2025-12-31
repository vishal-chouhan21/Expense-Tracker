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

  /*====== NEW STATES (LOGIC ONLY) =========== */
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  /* ======== FETCH INCOME + EXPENSE ========= */
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

  /* ================= CALCULATIONS ================= */
  const today = new Date();

  const totalIncome = income.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const todayExpense = expenses
    .filter(
      (e) => new Date(e.date).toDateString() === today.toDateString()
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const monthlyExpense = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalSaving = totalIncome - totalExpense;

  /* ================= YOUR EXISTING CODE ================= */

  const [formData, setFormData] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const token = localStorage.getItem("token");

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

    const payload = {
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.note,
    };

    try {
      setLoading(true);
      await addExpense(payload);
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
        {/* Add expense section */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {showForm ? "Close" : "+ Add Expense"}
        </button>
      </div>
      {/* ADD EXPENSE FORM */}
      {showForm && (
        <div className="max-w-md p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Add Expense
          </h2>

          {/* RECEIPT UPLOAD */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Upload Receipt (Image / PDF)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg"
            />
            {scanning && (
              <p className="text-xs text-orange-400 mt-2">
                Scanning receipt...
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Dairy">Dairy</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Daily">Daily</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Vegitable">Vegitable</option>
              <option value="Grocery">Grocery</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
            />

            <textarea
              name="note"
              placeholder="Note (optional)"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#141414] text-white border border-[#1f1f1f] p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      )}

        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Manage your 
            money in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              best possible way
            </span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-lg">
            ExpensePro helps you track expenses, analyze spending,
            and manage your finances smarter with real-time insights.
          </p>
        </div>


      {/* STATS */}
        <button onClick={()=> navigate("/add-income")}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-400 mt-4"
        >
          <PlusCircle size={18} />
          Add Income
        </button>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard title="Total Income" amount={`₹ ${totalIncome.toLocaleString()}`} />
        <StatCard title="Total Saving" amount={`₹ ${totalSaving.toLocaleString()}`} />
        <StatCard title="Monthly Expense" amount={`₹ ${monthlyExpense.toLocaleString()}`} />
        <StatCard title="Today Expense" amount={`₹ ${todayExpense.toLocaleString()}`} />
      </div>

      {/* ANALYTICS + CALENDAR */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryAnalytics />
        </div>
        <div className="flex justify-center mb-2">
          <Calendar />
        </div>
      </div>
      <div className="w-full border-[#1f1f1f] rounded-2xl mt-8">
          <ExpenseList/>
        </div>
        {/*======= STATS SECTION ============ */}
      <section className="border-t border-[#1a1a25] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
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

export default Home;
