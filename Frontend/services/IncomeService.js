import Api from "../Api/Api";

export const addIncome = async (data) => {
  const res = await Api.post("/api/income/add-income", data);
  return res.data;
};

export const getIncome = async () => {
  const res = await Api.get("/api/income/get-income");
  return res.data;
};
