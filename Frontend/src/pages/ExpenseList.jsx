import React, { useEffect, useState } from "react";
import {
  getExpenses,
  deleteExpense,
  editExpense,
} from "../../services/ExpenseService";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const PAGE_SIZE = 10;

const ExpenseList = () => {
  const currentYear = new Date().getFullYear();

  const [expenses, setExpenses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.expenses || []);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // ================= AVAILABLE YEARS =================
  const availableYears = Array.from(
    new Set(expenses.map((e) => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  // ================= FILTER BY YEAR + PAGINATION =================
  const visibleExpenses = expenses
    .filter((e) => new Date(e.date).getFullYear() === selectedYear)
    .slice(0, visibleCount);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      setDeletingId(id);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  // ================= EDIT =================
  const openEdit = (expense) => {
    setEditData({ ...expense });
    setEditOpen(true);
  };

  const handleEditSave = async (id) => {
    const res = await editExpense(id, editData);
    setExpenses((prev) => prev.map((e) => (e._id === id ? res.expense : e)));
    setEditOpen(false);
  };

  // ================= GROUPING (MONTH → DAY) =================
  const groupExpenses = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const map = {};

    visibleExpenses.forEach((expense) => {
      const d = new Date(expense.date);

      const month = d.toLocaleString("default", { month: "long" });

      let day = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (d.toDateString() === today.toDateString()) day = "Today";
      else if (d.toDateString() === yesterday.toDateString()) day = "Yesterday";

      if (!map[month]) map[month] = {};
      if (!map[month][day]) map[month][day] = [];

      map[month][day].push(expense);
    });

    return map;
  };

  const groupedData = groupExpenses();

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-1 flex flex-col rounded-2xl mt-5">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>

        {/* YEAR SELECTOR */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(Number(e.target.value));
            setVisibleCount(PAGE_SIZE);
          }}
          className="bg-[#141414] border border-[#1f1f1f] px-3 py-1 rounded text-sm"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="flex-1 overflow-y-auto border border-[#1f1f1f]">
        {/* YEAR HEADER */}
        <div className="px-6 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-xl font-bold text-orange-400">{selectedYear}</h2>
        </div>
        <table className="w-full text-sm text-center">
          <thead className="sticky top-0 bg-[#141414] text-gray-400 z-50">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="">Amount</th>
              <th className="">Category</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Edit</th>
              <th className="px-4 py-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && (
              <tr>
                <td colSpan="6" className="p-0">
                  <div className="bg-[#0c0c0c] border border-[#1f1f1f] rounded-xl">
                    <table className="w-full text-center">
                      <tbody>
                        {Object.entries(groupedData).map(([month, days]) => {
                          const monthTotal = Object.values(days)
                            .flat()
                            .reduce((s, e) => s + Number(e.amount), 0);

                          return (
                            <React.Fragment key={month}>
                              {/* MONTH */}
                              <tr className="bg-[#111]">
                                <td
                                  colSpan="6"
                                  className="px-6 py-2 text-left font-semibold"
                                >
                                  {month}
                                </td>
                              </tr>

                              {Object.entries(days).map(([day, items]) => {
                                const dayTotal = items.reduce(
                                  (s, e) => s + Number(e.amount),
                                  0
                                );

                                return (
                                  <React.Fragment key={day}>
                                    {/* DAY */}
                                    <tr className="bg-[#0f0f0f]">
                                      <td
                                        colSpan="6"
                                        className="px-6 py-2 text-left text-gray-400"
                                      >
                                        {day}
                                      </td>
                                    </tr>

                                    {items.map((expense, index) => (
                                      <tr
                                        key={expense._id}
                                        className="border-t border-[#1f1f1f] hover:bg-[#141414]"
                                      >
                                        <td className="px-4 py-3">
                                          {index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-orange-400">
                                          ₹ {expense.amount}
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="bg-[#1f1f1f] px-2 py-1 rounded text-xs">
                                            {expense.category}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3">
                                          {expense.title}
                                        </td>
                                        <td className="px-4 py-3">
                                          <button
                                            onClick={() => openEdit(expense)}
                                            className="text-orange-400 text-xs inline-flex gap-1 items-center"
                                          >
                                            <FiEdit size={14} /> edit
                                          </button>
                                        </td>
                                        <td className="px-4 py-3">
                                          <button
                                            onClick={() =>
                                              handleDelete(expense._id)
                                            }
                                            disabled={
                                              deletingId === expense._id
                                            }
                                            className="text-red-400 text-xs inline-flex gap-1 items-center"
                                          >
                                            <FiTrash2 size={14} /> delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}

                                    {/* DAY TOTAL */}
                                    <tr className="bg-[#111]">
                                      <td
                                        colSpan="6"
                                        className="px-6 py-2 text-right"
                                      >
                                        Total ({day}):{" "}
                                        <span className="text-orange-400">
                                          ₹ {dayTotal}
                                        </span>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}

                              {/* MONTH TOTAL */}
                              <tr className="bg-[#0c0c0c]">
                                <td
                                  colSpan="6"
                                  className="px-6 py-3 text-right font-semibold text-orange-400"
                                >
                                  {month} Total: ₹ {monthTotal}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= LOAD MORE ================= */}
      {visibleCount < expenses.length && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="text-orange-400 text-sm hover:underline"
          >
            Load more
          </button>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-full max-w-md rounded-lg p-5 border border-[#1f1f1f]">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Expense</h2>
              <button onClick={() => setEditOpen(false)}>
                <FiX />
              </button>
            </div>

            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title: e.target.value,
                })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
            />

            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amount: e.target.value,
                })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
            />

            <button
              onClick={() => handleEditSave(editData._id)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
