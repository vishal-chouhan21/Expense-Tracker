import mongoose from "mongoose";

const khataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Taken", "Given"], required: true },
    person: { type: String, required: true }, // who you give / take
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card"], required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);


const Khata = mongoose.models.Khata || mongoose.model("Khata", khataSchema);

export default Khata;