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

const COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#e11d48",
  "#14b8a6",
];

/* ---------- PIE LABEL ---------- */
const renderAmountLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius =
    innerRadius + (outerRadius - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="600"
    >
      ₹{value}
    </text>
  );
};

const DailyExpense = () => {
  const [expenses, setExpenses] = useState([]);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.expenses || []);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };
    fetchExpenses();
  }, []);

  /* ---------- TODAY FILTER ---------- */
  const todayExpenses = useMemo(() => {
    const today = new Date().toDateString();
    return expenses.filter(
      (e) => new Date(e.date).toDateString() === today
    );
  }, [expenses]);

  /* ---------- CATEGORY GROUP ---------- */
  const categoryData = useMemo(() => {
    const map = {};
    todayExpenses.forEach((e) => {
      map[e.category] =
        (map[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(map).map(([key, value]) => ({
      category: key,
      amount: value,
    }));
  }, [todayExpenses]);

  const totalAmount = todayExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-1">
        Today’s Expenses
      </h1>
      <p className="text-gray-400 mb-6">
        {new Date().toDateString()}
      </p>

      {/* TOTAL CARD */}
      <div className="bg-[#1a1a1a] p-5 rounded-xl mb-6">
        <p className="text-gray-400 text-sm">
          Total Spent Today
        </p>
        <h2 className="text-4xl font-bold text-orange-400">
          ₹ {totalAmount.toLocaleString()}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Category Breakdown
          </h2>

          <div className="h-80">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                No expenses today
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    label={renderAmountLabel}
                    labelLine={false}
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Today’s Transactions
          </h2>

          {todayExpenses.length === 0 ? (
            <p className="text-gray-400">
              No transactions today
            </p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {todayExpenses.map((e) => (
                <div
                  key={e._id}
                  className="flex justify-between items-center bg-[#0f0f0f] p-3 rounded-lg border border-[#1f1f1f]"
                >
                  <div>
                    <p className="font-medium">
                      {e.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {e.category}
                    </p>
                  </div>
                  <p className="text-orange-400 font-semibold">
                    ₹ {Number(e.amount).toLocaleString()}
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

export default DailyExpense;
