import React, { useEffect, useState } from "react";
import {
  getExpenses,
  deleteExpense,
  editExpense,
} from "../../services/ExpenseService";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const PAGE_SIZE = 10;

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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

  // DELETE
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

  // EDIT
  const openEdit = (expense) => {
    setEditData({ ...expense });
    setEditOpen(true);
  };

  const handleEditSave = async (id) => {
    try {
      const response = await editExpense(id, editData);
      const updatedExpense = response.expense; // get updated expense from backend
      setExpenses((prev) =>
        prev.map((e) => (e._id === id ? updatedExpense : e))
      );
      setEditOpen(false);
    } catch (error) {
      console.error("Failed to edit expense:", error);
      alert(error.message || "Failed to update expense");
    }
  };

  // PAGINATION
  const visibleExpenses = expenses.slice(0, visibleCount);

  // GROUPING
  const groupExpenses = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const map = {};

    visibleExpenses.forEach((expense) => {
      const d = new Date(expense.date);

      const monthKey = d.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      let dayKey = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (d.toDateString() === today.toDateString()) dayKey = "Today";
      else if (d.toDateString() === yesterday.toDateString())
        dayKey = "Yesterday";

      if (!map[monthKey]) map[monthKey] = {};
      if (!map[monthKey][dayKey]) map[monthKey][dayKey] = [];

      map[monthKey][dayKey].push(expense);
    });

    return map;
  };

  const groupedData = groupExpenses();

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <div className="overflow-y-auto max-h-[75vh] border border-[#1f1f1f] rounded-lg">
        <table className="w-full text-sm text-center">
          <thead className="bg-[#141414] sticky top-0 z-20 text-gray-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 pr-10">Title</th>
              <th className="px-4 py-3 text-center">Edit</th>
              <th className="px-4 py-3 text-center">Delete</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              Object.entries(groupedData).map(([month, days]) => {
                const monthTotal = Object.values(days)
                  .flat()
                  .reduce((sum, e) => sum + Number(e.amount), 0);

                return (
                  <React.Fragment key={month}>
                    {/* MONTH HEADER */}
                    <tr className="sticky top-[48px] bg-[#111] z-10">
                      <td colSpan="6" className="px-4 py-2 font-semibold text-left">
                        {month}
                      </td>
                    </tr>

                    {Object.entries(days).map(([day, items]) => {
                      const dayTotal = items.reduce(
                        (sum, e) => sum + Number(e.amount),
                        0
                      );

                      return (
                        <React.Fragment key={day}>
                          {/* DAY HEADER */}
                          <tr className="sticky top-[76px] bg-[#0f0f0f] z-10 text-left">
                            <td colSpan="6" className="px-4 py-2 text-gray-400">
                              {day}
                            </td>
                          </tr>

                          {items.map((expense, index) => (
                            <tr
                              key={expense._id}
                              className="border-t border-[#1f1f1f] hover:bg-[#141414]"
                            >
                              <td className="px-4 py-3">{index + 1}</td>

                              <td className="pl-16 px-4 py-3 text-orange-400">
                                ₹ {expense.amount}
                              </td>

                              <td className="px-4 py-3">
                                <span className="bg-[#1f1f1f] px-2 py-1 rounded text-xs">
                                  {expense.category}
                                </span>
                              </td>

                              <td className="px-4 py-3">{expense.title}</td>

                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => openEdit(expense)}
                                  className="inline-flex items-center gap-1 text-orange-400 text-xs"
                                >
                                  <FiEdit size={14} /> edit
                                </button>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDelete(expense._id)}
                                  disabled={deletingId === expense._id}
                                  className="inline-flex items-center gap-1 text-red-400 text-xs"
                                >
                                  <FiTrash2 size={14} /> delete
                                </button>
                              </td>
                            </tr>
                          ))}

                          {/* DAY TOTAL */}
                          <tr className="bg-[#111] border-t border-[#1f1f1f]">
                            <td colSpan="6" className="px-4 py-2 text-right">
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
                    <tr className="bg-[#0c0c0c] border-t border-[#1f1f1f]">
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-right font-semibold text-orange-400"
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

      {/* LOAD MORE */}
      {visibleCount < expenses.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="text-orange-400 text-sm hover:underline"
          >
            Load more
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-full max-w-md rounded-lg p-5 border border-[#1f1f1f]">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Expense</h2>
              <button onClick={() => setEditOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Title */}
            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
              placeholder="Title"
            />

            {/* Amount */}
            <input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({ ...editData, amount: e.target.value })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
              placeholder="Amount"
            />

            {/* Category */}
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
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

            {/* Date */}
            <input
              type="date"
              value={
                editData.date
                  ? new Date(editData.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded"
            />

            {/* Notes */}
            <textarea
              value={editData.notes || ""}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              placeholder="Notes"
              className="w-full mb-3 p-2 bg-[#0f0f0f] border border-[#1f1f1f] rounded resize-none"
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
