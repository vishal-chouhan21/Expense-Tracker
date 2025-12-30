import React, { useState } from "react";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Expense Data:", formData);

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      date: "",
      note: "",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full bg-[#141414] text-white border border-[#1f1f1f]
          p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-[#141414] text-white border border-[#1f1f1f]
          p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full bg-[#141414] text-white border border-[#1f1f1f]
          p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Note */}
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          className="w-full bg-[#141414] text-white border border-[#1f1f1f]
          p-2 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600
          text-black font-semibold py-2 rounded-lg transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
