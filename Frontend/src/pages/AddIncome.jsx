import React, { useState } from "react";
import { addIncome } from "../../services/IncomeService";

const AddIncome = () => {
  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.source || !form.date) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      amount: Number(form.amount),
      source: form.source,
      date: form.date,
    };

    try {
      await addIncome(payload);
      alert("Income added successfully");

      setForm({
        amount: "",
        source: "",
        date: "",
      });
    } catch (error) {
      alert(error.message || "Failed to add income");
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md">
      <h2 className="text-white text-lg font-semibold mb-4">
        Add Income
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full bg-[#0f0f0f] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="text"
          name="source"
          placeholder="Income Source"
          value={form.source}
          onChange={handleChange}
          className="w-full bg-[#0f0f0f] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full bg-[#0f0f0f] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg transition"
        >
          Add Income
        </button>
      </form>
    </div>
  );
};

export default AddIncome;
