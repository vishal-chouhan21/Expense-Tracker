import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getExpenses } from "../../services/ExpenseService";

const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7","#718355", "#569e34", "red", "#blue"];

const renderAmountLabel = ({
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
      fontSize={14}
      fontWeight="600"
    >
      ₹{value}
    </text>
  );
};

const CategoryAnalytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [timeFilter, setTimeFilter] = useState("All"); // Today, Week, Month, Year, All

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.expenses || []);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const today = new Date();
    let filtered = [...expenses];

    if (timeFilter === "Today") {
      filtered = filtered.filter(
        (e) => new Date(e.date).toDateString() === today.toDateString()
      );
    } else if (timeFilter === "Week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d >= startOfWeek && d <= endOfWeek;
      });
    } else if (timeFilter === "Month") {
      const month = today.getMonth();
      const year = today.getFullYear();
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
    } else if (timeFilter === "Year") {
      const year = today.getFullYear();
      filtered = filtered.filter((e) => new Date(e.date).getFullYear() === year);
    }

    // Group by category
    const grouped = filtered.reduce((acc, expense) => {
      const cat = expense.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const chartData = Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
    }));

    setFilteredExpenses(chartData);
  }, [expenses, timeFilter]);

  return (
    <div className="p-6 text-white bg-[#1a1a1a] border-[#2a2a35] rounded-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track expenses by category
          </p>
        </div>

        {/* Time Filter on Right */}
        <div>
          <select
            className="p-2 bg-[#0f0f0f] border border-[#1f1f1f] text-white rounded-2xl"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
            <option value="Year">This Year</option>
          </select>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-72 sm:h-96 bg-[#1a1a1a] rounded-xl p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredExpenses}
              dataKey="amount"
              nameKey="category"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={3}
              label={renderAmountLabel}
              labelLine={false}
            >
              {filteredExpenses.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Legend layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip formatter={(value) => `₹${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryAnalytics;
