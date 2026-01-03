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

export const editIncome = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const { title, amount, source, date, notes } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        title,
        amount,
        source,
        date,
        notes,
      },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.json({
      success: true,
      message: "Income updated successfully",
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update income",
    });
  }
};

