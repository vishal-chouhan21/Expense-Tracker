import React, { useState, useEffect } from "react";
import { getExpenses } from "../../services/ExpenseService";
import { FiX } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#e11d48",
  "#14b8a6",
];

const CalendarPage = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [expenses, setExpenses] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await getExpenses();
      setExpenses(res.expenses || []);
    };
    fetchExpenses();
  }, []);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Helper functions
  const hasExpenseOnDate = (date) =>
    expenses.some((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === date &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

  const selectedDayExpenses = expenses.filter((e) => {
    if (!selectedDate) return false;
    const d = new Date(e.date);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  const dailyTotal = selectedDayExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  // Category data for pie chart
  const categoryData = Object.entries(
    selectedDayExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
      return acc;
    }, {})
  ).map(([category, amount]) => ({ category, amount }));

  // Label for pie chart
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
    <div className="min-h-96 bg-[#0f0f0f] text-white p-2">
      {/* Calendar Card */}
      <div className="max-w-md mx-auto bg-[#1a1a1a] border border-[#2a2a35] rounded-2xl p-12 shadow-xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Expense Calendar</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track expenses by date
          </p>
        </div>
        {/* Month Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[#2a2a35] text-gray-400 hover:text-white transition"
          >
            ◀
          </button>
          <h2 className="text-sm font-semibold tracking-wide">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={nextMonth}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-[#2a2a35] text-gray-400 hover:text-white transition"
          >
            ▶
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-2 text-sm">
          {[...Array(firstDay)].map((_, i) => (
            <div key={i}></div>
          ))}
          {[...Array(lastDate)].map((_, i) => {
            const date = i + 1;
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === date &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;
            const isToday =
              today.getDate() === date &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(new Date(year, month, date));
                  setOpenPopup(true);
                }}
                className={`relative h-10 w-10 rounded-lg flex items-center justify-center transition font-medium
                  ${
                    isSelected
                      ? "bg-cyan-500 text-black"
                      : isToday
                      ? "border border-cyan-400 text-cyan-300"
                      : "hover:bg-[#2a2a35] text-gray-300"
                  }`}
              >
                {date}
                {hasExpenseOnDate(date) && (
                  <span className="absolute bottom-1 h-1.5 w-1.5 bg-cyan-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-page Popup */}
      {openPopup && selectedDate && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-start pt-16 z-50 overflow-y-auto">
          <div className="bg-[#141414] w-full max-w-4xl rounded-xl p-6 border border-[#1f1f1f]">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate.toDateString()}
              </h2>
              <button onClick={() => setOpenPopup(false)}>
                <FiX />
              </button>
            </div>

            {/* Total */}
            <div className="mb-4">
              <p className="text-gray-400">Total Spent</p>
              <h3 className="text-3xl font-bold text-orange-400">
                ₹ {dailyTotal}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDayExpenses.length} transactions
              </p>
            </div>

            {/* Grid: Pie + Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-[#1a1a1a] p-5 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">
                  Category Breakdown
                </h3>
                {categoryData.length === 0 ? (
                  <p className="text-gray-400">No expenses</p>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="amount"
                          nameKey="category"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={3}
                          label={renderLabel}
                          labelLine={false}
                        >
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Transactions */}
              <div className="bg-[#1a1a1a] p-5 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Transactions</h3>
                {selectedDayExpenses.length === 0 ? (
                  <p className="text-gray-400">No transactions</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedDayExpenses.map((e) => (
                      <div
                        key={e._id}
                        className="flex justify-between bg-[#0f0f0f] p-3 rounded-lg border border-[#1f1f1f]"
                      >
                        <div>
                          <p className="font-medium">{e.title}</p>
                          <p className="text-xs text-gray-400">{e.category}</p>
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
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
