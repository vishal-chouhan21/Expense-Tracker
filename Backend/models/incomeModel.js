import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    title: { type: String },
    amount: { type: Number, required: true },
    source: { type: String, required: true },
    date: { type: Date, required: true },
    notes: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

incomeSchema.index({ user: 1, date: -1 });

export default mongoose.model("Income", incomeSchema);
