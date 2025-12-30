import Income from "../models/incomeModel.js";

export const addIncome = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false });
    }

    const { title, amount, source, date, notes } = req.body;

    const income = await Income.create({
      title,
      amount,
      source,
      date,
      notes,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add income",
    });
  }
};

export const getIncome = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success: true, income });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch income",
    });
  }
};
