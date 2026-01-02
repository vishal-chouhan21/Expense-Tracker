import { useEffect, useMemo, useState, Fragment } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import {
  getExpenses,
  deleteExpense,
  editExpense,
} from "../../services/ExpenseService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== EDIT POPUP STATE =====
  const [editingTx, setEditingTx] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        setTransactions(res.expenses || []);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteExpense(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete expense");
    }
  };

  // ================= OPEN EDIT POPUP =================
  const handleEditOpen = (tx) => {
    setEditingTx(tx);
    setFormData({
      title: tx.title || "",
      amount: tx.amount,
      category: tx.category,
      date: tx.date?.slice(0, 10),
    });
  };

  // ================= SAVE EDIT =================
  const handleEditSave = async () => {
    try {
      const updated = await editExpense(editingTx._id, {
        ...formData,
        amount: Number(formData.amount),
      });

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === editingTx._id ? updated.expense : t
        )
      );
      setEditingTx(null);
    } catch {
      alert("Failed to update expense");
    }
  };

  // ================= YEAR + DATE GROUP =================
  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return sorted.reduce((acc, tx) => {
      const d = new Date(tx.date);
      const year = d.getFullYear();
      const dateKey = d.toDateString();

      acc[year] ??= {};
      acc[year][dateKey] ??= [];
      acc[year][dateKey].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading transactions...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111] text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedTransactions)
              .sort(([a], [b]) => b - a)
              .map(([year, dates]) => (
                <Fragment key={year}>
                  <tr className="bg-[#0f0f0f]">
                    <td colSpan="5" className="px-4 py-3 font-bold text-orange-400">
                      {year}
                    </td>
                  </tr>

                  {Object.entries(dates)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .map(([date, items]) => (
                      <Fragment key={date}>
                        <tr className="bg-[#141414]">
                          <td colSpan="5" className="px-6 py-2 text-xs text-gray-400">
                            {date}
                          </td>
                        </tr>

                        {items.map((t) => (
                          <tr
                            key={t._id}
                            className="border-t border-[#2a2a2a] hover:bg-[#222]"
                          >
                            <td className="px-4 py-3">
                              {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">{t.category}</td>
                            <td className="px-4 py-3 text-orange-400">
                              ₹{t.amount}
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {t.title || "-"}
                            </td>
                            <td className="px-4 py-3 flex justify-end gap-3">
                              <button
                                onClick={() => handleEditOpen(t)}
                                className="text-blue-400"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="text-red-400"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT POPUP ================= */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edit Transaction</h2>
              <button onClick={() => setEditingTx(null)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full bg-[#111] p-2 rounded"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full bg-[#111] p-2 rounded"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              {/* <input
                className="w-full bg-[#111] p-2 rounded"
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              /> */}
              <select name="category"
              value={formData.category} onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                } className="w-full bg-[#111] p-2 rounded">
              <option value="">Category</option>
              <option value="Daily">Daily</option>
              <option value="Food">Food</option>
              <option value="Personal">Personal</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Vegitable">Vegitable</option>
              <option value="Dairy">Dairy</option>
              <option value="Grocery">Grocery</option>
              <option value="Health">Health</option>
              <option value="Study">Study</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
            </select>
              <input
                type="date"
                className="w-full bg-[#111] p-2 rounded"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />

              <button
                onClick={handleEditSave}
                className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
