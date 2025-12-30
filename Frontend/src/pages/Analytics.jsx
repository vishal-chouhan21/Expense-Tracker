import React, { useEffect, useMemo, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { getExpenses } from "../../services/ExpenseService";
import { getIncome } from "../../services/IncomeService";
import CategoryAnalytics from "../components/CategoryAnalyzer";

/* ================= COLORS ================= */
const COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#e11d48",
  "#14b8a6",
];

/* ======== SAFE EXTRACTORS ================= */
const extractExpenses = (res) =>
  res?.expenses || res?.data?.expenses || res?.data || [];

const extractIncome = (res) =>
  res?.income || res?.data?.income || res?.data || [];

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const expRes = await getExpenses();
        const incRes = await getIncome();

        setExpenses(extractExpenses(expRes));
        setIncomes(extractIncome(incRes));
      } catch (err) {
        console.error("Analytics fetch error", err);
      }
    };

    fetchData();
  }, []);

  /* ============ TOTALS ================= */
  const totalExpense = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );

  const totalIncome = useMemo(
    () => incomes.reduce((s, i) => s + Number(i.amount || 0), 0),
    [incomes]
  );

  /*========== CATEGORY PIE ================= */
  const categoryData = useMemo(() => {
    const map = {};

    expenses.forEach((e) => {
      if (!e.amount || !e.category) return;
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .filter((c) => c.value > 0);
  }, [expenses]);

  /* ========== TOP CATEGORY ================= */
  const topCategory = useMemo(() => {
    if (!categoryData.length) return null;
    return categoryData.reduce((a, b) => (b.value > a.value ? b : a));
  }, [categoryData]);

  /*=========== MONTHLY BAR ================= */
  const monthlyExpense = useMemo(() => {
    // Initialize all 12 months with 0 amount
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      amount: 0,
    }));

    expenses.forEach((e) => {
      if (!e.date || !e.amount) return;
      const d = new Date(e.date);
      const monthIndex = d.getMonth();
      months[monthIndex].amount += Number(e.amount);
    });

    return months;
  }, [expenses]);

  /* =========== LINE GRAPH ================= */
  const incomeExpenseLine = useMemo(() => {
    const map = {};

    incomes.forEach((i) => {
      if (!i.date || !i.amount) return;
      const d = i.date.split("T")[0]; // YYYY-MM-DD
      map[d] = map[d] || { date: d, income: 0, expense: 0 };
      map[d].income += Number(i.amount);
    });

    expenses.forEach((e) => {
      if (!e.date || !e.amount) return;
      const d = e.date.split("T")[0];
      map[d] = map[d] || { date: d, income: 0, expense: 0 };
      map[d].expense += Number(e.amount);
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [incomes, expenses]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Summary
          title="Total Income"
          value={totalIncome}
          color="text-green-400"
        />
        <Summary
          title="Total Expense"
          value={totalExpense}
          color="text-red-400"
        />
        <Summary
          title="Top Spending"
          value={
            topCategory
              ? `${topCategory.name} (₹${topCategory.value})`
              : "No data"
          }
          color="text-orange-400"
        />
      </div>

      {/* LINE */}
      <ChartBox title="Income vs Expense">
        <LineChart data={incomeExpenseLine}>
          <XAxis dataKey="date" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }}
          />
          <Legend />
          <Line dataKey="income" stroke="#22c55e" strokeWidth={2} />
          <Line dataKey="expense" stroke="#e11d48" strokeWidth={2} />
        </LineChart>
      </ChartBox>

      {/* PIE + BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Category Pie */}
        <div>
          <CategoryAnalytics />
        </div>

        {/* Monthly Expense Bar */}
        <ChartBox title="Monthly Expenses">
          <BarChart data={monthlyExpense}>
            <XAxis dataKey="month" stroke="white" />
            <YAxis
              domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
              allowDataOverflow={false}
              stroke="white"
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }}
            />
            <Bar
              dataKey="amount"
              fill="yellow"
              label={{ position: "top", fill: "white" }}
            />
          </BarChart>
        </ChartBox>
      </div>
    </div>
  );
};

/* ======== SMALL COMPONENTS ============== */
const Summary = ({ title, value, color }) => (
  <div className="bg-[#141414] p-5 rounded-xl border border-[#1f1f1f]">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className={`text-2xl font-bold mt-2 ${color}`}>
      {typeof value === "number" ? `₹ ${value.toLocaleString()}` : value}
    </h2>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-[#141414] p-5 rounded-xl border border-[#1f1f1f]">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;
