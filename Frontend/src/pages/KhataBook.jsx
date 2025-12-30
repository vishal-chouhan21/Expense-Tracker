import React, { useEffect, useState } from "react";
import {
  getKhata,
  addKhata,
  updateKhata,
  deleteKhata,
} from "../../services/KhataService";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const PAGE_SIZE = 15;
const PAYMENT_METHODS = ["Cash", "UPI", "Card"];

const KhataBook = () => {
  const [khata, setKhata] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "Taken",
    person: "",
    amount: "",
    paymentMethod: "Cash",
    date: "",
    notes: "",
  });

  const [editId, setEditId] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    const fetchKhata = async () => {
      try {
        const res = await getKhata();
        const data = Array.isArray(res?.data) ? res.data : [];

        // 🔥 sort recent date on top
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setKhata(data);
      } finally {
        setLoading(false);
      }
    };
    fetchKhata();
  }, []);

  // ================= SAFE DATA =================
  const safeKhata = khata.filter((k) => k && k.date);

  // ================= GROUPING =================
  const groupKhata = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const map = {};

    safeKhata.slice(0, visibleCount).forEach((item) => {
      const d = new Date(item.date);
      if (isNaN(d)) return;

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

      map[monthKey] ??= {};
      map[monthKey][dayKey] ??= [];
      map[monthKey][dayKey].push(item);
    });

    return map;
  };

  const groupedData = groupKhata();

  // ================= ADD / UPDATE =================
  const handleSubmit = async () => {
    if (!form.person || !form.amount || !form.date) {
      return alert("Please fill all required fields");
    }

    try {
      if (editId) {
        await updateKhata(editId, form);
      } else {
        await addKhata(form);
      }

      const res = await getKhata();
      const data = res.data || [];
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setKhata(data);
      setEditId(null);
      setForm({
        type: "Taken",
        person: "",
        amount: "",
        paymentMethod: "Cash",
        date: "",
        notes: "",
      });
    } catch (err) {
      alert(err.message || "Failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await deleteKhata(id);
    setKhata((prev) => prev.filter((k) => k._id !== id));
  };

  // ================= UI =================
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* ADD SECTION */}
      <div className="bg-[#141414] p-4 rounded-lg mb-6 border border-[#1f1f1f]">
        <div className="flex flex-wrap gap-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Taken">Taken</option>
            <option value="Given">Given</option>
          </select>

          <input
            placeholder="Person name"
            value={form.person}
            onChange={(e) => setForm({ ...form, person: e.target.value })}
            className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded w-28"
          />

          <select
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
            className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="bg-[#0f0f0f] border border-[#1f1f1f] p-2 rounded"
          />

          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-black"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-y-auto max-h-[75vh] border border-[#1f1f1f] rounded-lg">
        <table className="w-full text-sm">
          <tbody>
            {loading && (
              <tr>
                <td className="py-6 text-center text-gray-400">Loading...</td>
              </tr>
            )}

            {!loading &&
              Object.entries(groupedData).map(([month, days]) => (
                <React.Fragment key={month}>
                  {/* MONTH */}
                  <tr className="bg-[#111] sticky top-0 z-10">
                    <td colSpan="4" className="px-4 py-2 font-semibold">
                      {month}
                    </td>
                  </tr>

                  {Object.entries(days).map(([day, items]) => (
                    <React.Fragment key={day}>
                      {/* DAY */}
                      <tr className="bg-[#0f0f0f]">
                        <td colSpan="4" className="px-4 py-2 text-gray-400">
                          {day}
                        </td>
                      </tr>

                      {items.map((k) => (
                        <tr
                          key={k._id}
                          className="border-t border-[#1f1f1f] hover:bg-[#141414]"
                        >
                          {/* PERSON */}
                          <td className="px-4 py-3">{k.person}</td>

                          {/* AMOUNT + TAKEN/GIVEN */}
                          <td className="px-4 py-3">
                            <div
                              className={`font-semibold ${
                                k.type === "Taken"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              ₹ {k.amount}
                            </div>
                            <div className="text-xs text-gray-400">
                              {k.type === "Taken" ? "You Took" : "You Gave"}
                            </div>
                          </td>

                          {/* PAYMENT */}
                          <td className="px-4 py-3 text-gray-400">
                            {k.paymentMethod}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setForm(k);
                                setEditId(k._id);
                              }}
                              className="text-orange-400 mr-3"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(k._id)}
                              className="text-red-400"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE */}
      {visibleCount < safeKhata.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="text-orange-400 text-sm"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default KhataBook;
