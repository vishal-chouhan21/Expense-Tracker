import Expense from "../models/expenseModel.js";

// Add Expense
export const addExpense = async (req, res) => {
  try {
    //user check
     if(!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User not authentictaed",
      });
    }

    const {title, amount, category, date, notes} = req.body;

    if( !title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: " Please fill all required fields ",
      });
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      notes: notes || "",
      user: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    })
  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(400).json({
      success:false,
      message: "something wrong",
      error: error.message,
    })
  }
}

//get Expense
export const getExpense = async (req, res) => {
  try {
    if(!req.user || !req.user.id){
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const expenses = await Expense.find({ user: req.user.id}).sort({ date: -1});

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
}

//delete Expense
export const deleteExpense = async (req, res) => {
  try {
    if(!req.user || !req.user.id){
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {id} = req.params;
    const expense = await Expense.findOneAndDelete({_id: id, user: req.user.id });

    if(!expense){
      return res.status(400).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
      expense,
    })
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  };
};

//edit Expense
export const editExpense = async (req, res) => {
  try {
    if(!req.user || !req.user.id){
      return res.status(400).json({
        success: false,
        message: "user not authorised"
      })
    };

    const {id} = req.params;
    const {title, amount, category, date, notes} = req.body;

    const expense = await Expense.findByIdAndUpdate(
      {_id: id, user: req.user.id},
      {
        title,
        amount,
        category,
        date,
        notes
      },
      {new: true}
    );

    if(!expense){
      return res.status(400).json({
        success: false,
        message: "Expense Not Found",
      })
    };

    res.status(200).json({
      success: true,
      message: "Expense Update Successfully",
      expense,
    })
  } catch (error) {
     console.error("Edit expense error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit expense",
    });
  }
};