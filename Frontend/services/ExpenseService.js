import Api from "../Api/Api";


// Add Expense
export const addExpense = async (expenseData) => {
  try {
    const response = await Api.post("/api/expenses/add-expense", expenseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: "Something went wrong"}
  }
};

//get Expense
export const getExpenses = async () => {
  try {
    const response = await Api.get("/api/expenses/get-expense");
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: "something error"}
  }
};

//delete Expense 
export const deleteExpense = async (expenseId) => {
 try {
  const response = await Api.delete(`/api/expenses/delete-expense/${expenseId}`);
  return response.data;
 } catch (error) {
  throw error.response?.data || {message: "Failed to Delete"}
 }
};

//edit Expense
export const editExpense = async (expenseId, updateData) =>{
  try {
    const response = await Api.put(`/api/expenses/edit-expense/${expenseId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: "something error"}
  }
};