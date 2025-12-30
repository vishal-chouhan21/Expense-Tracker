import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getExpenses } from "../../services/ExpenseService";

const FILTERS = ["Today", "Week", "Month", "Year"];

const COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#e11d48",
  "#14b8a6",
  "#facc15",
];

const MonthlyExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Month");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.expenses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((exp) => {
      const d = new Date(exp.date);

      switch (activeFilter) {
        case "Today":
          return d.toDateString() === now.toDateString();

        case "Week": {
          const start = new Date(now);
          start.setDate(now.getDate() - 6);
          start.setHours(0, 0, 0, 0);

          const end = new Date(now);
          end.setHours(23, 59, 59, 999);

          return d >= start && d <= end;
        }

        case "Month":
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );

        case "Year":
          return d.getFullYear() === now.getFullYear();

        default:
          return true;
      }
    });
  }, [expenses, activeFilter]);

  /* ---------------- PIE DATA ---------------- */
  const pieData = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      map[e.category] =
        (map[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(map).map(([key, value]) => ({
      category: key,
      amount: value,
    }));
  }, [filteredExpenses]);

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  /* ---------------- PIE LABEL ---------------- */
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        ₹{value}
      </text>
    );
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Expense Analytics</h1>
          <p className="text-gray-400 text-sm">
            Category-wise breakdown
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm transition
                ${
                  activeFilter === f
                    ? "bg-orange-500 text-black"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-[#1a1a1a] rounded-xl p-5 mb-6">
        <p className="text-gray-400 text-sm">
          Total ({activeFilter})
        </p>
        <h2 className="text-4xl font-bold text-orange-400">
          ₹ {totalAmount.toLocaleString()}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {filteredExpenses.length} transactions
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 h-[420px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              Loading...
            </div>
          ) : pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No data found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={3}
                  label={renderLabel}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Transactions
          </h2>

          {filteredExpenses.length === 0 ? (
            <p className="text-gray-400">
              No transactions found
            </p>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto">
              {filteredExpenses.map((e) => (
                <div
                  key={e._id}
                  className="flex justify-between items-center bg-[#0f0f0f] p-3 rounded-lg border border-[#1f1f1f]"
                >
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-gray-400">
                      {e.category} •{" "}
                      {new Date(e.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-orange-400 font-semibold">
                    ₹ {e.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpense;
