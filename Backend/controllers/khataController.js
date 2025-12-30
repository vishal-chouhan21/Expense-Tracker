import Khata from "../models/khataModel.js";

// GET all khata entries for a user with optional filters
export const getKhata = async (req, res) => {
  try {
    const { person, paymentMethod, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (person) query.person = person;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);

    const khata = await Khata.find(query).sort({ date: 1 });
    res.status(200).json({ success: true, data: khata });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD new khata entry
export const addKhata = async (req, res) => {
  try {
    const { type, person, amount, paymentMethod, date, notes } = req.body;
    const khata = await Khata.create({
      user: req.user.id,
      type,
      person,
      amount,
      paymentMethod,
      date,
      notes,
    });
    res.status(201).json({ success: true, data: khata });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE khata entry
export const updateKhata = async (req, res) => {
  try {
    const khata = await Khata.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!khata) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: khata });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE khata entry
export const deleteKhata = async (req, res) => {
  try {
    const khata = await Khata.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!khata) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
