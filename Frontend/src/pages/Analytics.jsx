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

/* ===== SAFE EXTRACTORS ===== */
const extractExpenses = (res) =>
  res?.expenses || res?.data?.expenses || res?.data || [];

const extractIncome = (res) =>
  res?.income || res?.data?.income || res?.data || [];

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  /* ===== FETCH ===== */
  useEffect(() => {
    const fetchData = async () => {
      const expRes = await getExpenses();
      const incRes = await getIncome();

      setExpenses(extractExpenses(expRes));
      setIncomes(extractIncome(incRes));
    };

    fetchData();
  }, []);

  /* ===== CURRENT MONTH FILTER ===== */
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthIncome = useMemo(() => {
    return incomes.filter((i) => {
      if (!i.date) return false;
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [incomes]);

  const currentMonthExpense = useMemo(() => {
    return expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses]);

  /* ===== TOTALS (MONTHLY RESET) ===== */
  const totalIncome = useMemo(
    () => currentMonthIncome.reduce((s, i) => s + Number(i.amount || 0), 0),
    [currentMonthIncome]
  );

  const totalExpense = useMemo(
    () => currentMonthExpense.reduce((s, e) => s + Number(e.amount || 0), 0),
    [currentMonthExpense]
  );

  /* ===== MONTHLY LINE GRAPH ===== */
  const incomeExpenseLine = useMemo(() => {
    const map = {};

    incomes.forEach((i) => {
      if (!i.date || !i.amount) return;
      const d = new Date(i.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map[key] = map[key] || {
        month: d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        income: 0,
        expense: 0,
      };
      map[key].income += Number(i.amount);
    });

    expenses.forEach((e) => {
      if (!e.date || !e.amount) return;
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map[key] = map[key] || {
        month: d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        income: 0,
        expense: 0,
      };
      map[key].expense += Number(e.amount);
    });

    return Object.values(map);
  }, [incomes, expenses]);

  /* ===== MONTHLY EXPENSE BAR ===== */
  const monthlyExpense = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      amount: 0,
    }));

    currentMonthExpense.forEach((e) => {
      const d = new Date(e.date);
      months[d.getMonth()].amount += Number(e.amount);
    });

    return months;
  }, [currentMonthExpense]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Summary title="This Month Income" value={totalIncome} color="text-green-400" />
        <Summary title="This Month Expense" value={totalExpense} color="text-red-400" />
        <Summary
          title="This Month Savings"
          value={totalIncome - totalExpense}
          color="text-orange-400"
        />
      </div>

      {/* LINE CHART */}
      <ChartBox title="Monthly Income vs Expense">
        <LineChart data={incomeExpenseLine}>
          <XAxis dataKey="month" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }} />
          <Legend />
          <Line dataKey="income" stroke="#22c55e" strokeWidth={2} />
          <Line dataKey="expense" stroke="#e11d48" strokeWidth={2} />
        </LineChart>
      </ChartBox>

      {/* PIE + BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CategoryAnalytics />

        <ChartBox title="This Month Expenses">
          <BarChart data={monthlyExpense}>
            <XAxis dataKey="month" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }} />
            <Bar dataKey="amount" fill="#f97316" />
          </BarChart>
        </ChartBox>
      </div>
    </div>
  );
};

/* ===== COMPONENTS ===== */
const Summary = ({ title, value, color }) => (
  <div className="bg-[#141414] p-5 rounded-xl border border-[#1f1f1f]">
    <p className="text-gray-400 text-sm">{title}</p>
    <h2 className={`text-2xl font-bold mt-2 ${color}`}>
      ₹ {Number(value).toLocaleString()}
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
