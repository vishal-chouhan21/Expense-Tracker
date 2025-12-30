import { useEffect, useMemo, useState, Fragment } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  getExpenses,
  deleteExpense,
  editExpense,
} from "../../services/ExpenseService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const confirm = window.confirm("Delete this transaction?");
    if (!confirm) return;

    try {
      await deleteExpense(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete expense");
    }
  };

  // ================= EDIT =================
  const handleEdit = async (tx) => {
    const newTitle = prompt("Edit title", tx.title);
    if (newTitle === null) return;

    try {
      const updated = await editExpense(tx._id, {
        ...tx,
        title: newTitle,
      });

      setTransactions((prev) =>
        prev.map((t) => (t._id === tx._id ? updated.expense : t))
      );
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to edit expense");
    }
  };

  // ================= SORT + GROUP =================
  const groupedTransactions = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return sorted.reduce((acc, tx) => {
      const dateKey = new Date(tx.date).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
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
            {Object.keys(groupedTransactions).length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              Object.entries(groupedTransactions).map(([date, items]) => (
                <Fragment key={date}>
                  <tr className="bg-[#141414]">
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-xs font-semibold text-gray-400"
                    >
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
                      <td className="px-4 py-3 text-orange-400 font-medium">
                        ₹{t.amount}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {t.title || "-"}
                      </td>
                      <td className="px-4 py-3 flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(t)}
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
