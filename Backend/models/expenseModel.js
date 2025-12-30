import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
     title: { type: String, trim: true, require:true },
    amount: {type: Number, require: true, min: 0},
    category: { type: String, enum: ["Food", "Dairy", "Rent", "Travel", "Shopping", "Health", "Entertainment","Grocery", "Study", "Personal", "Other"], default: "Other"},
    date: { type: Date, require: true, default: Date.now},
    notes: { type: String, trim: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
  },
  {timestamps: true}
);

//Indexes
expenseSchema.index({ user: 1});
// Monthly / date-based queries
expenseSchema.index({ user: 1, date: -1 });

// Category analytics
expenseSchema.index({ user: 1, category: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;