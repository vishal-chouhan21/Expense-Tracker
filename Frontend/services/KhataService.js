import Api from "../Api/Api";

// Get khata details
export const getKhata = async (filters = {}) => {
  try {
    const response = await Api.get("/api/khata/get", { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Add new record
export const addKhata = async (data) => {
  try {
    const response = await Api.post("/api/khata/add", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Update record
export const updateKhata = async (id, data) => {
  try {
    const response = await Api.put(`/api/khata/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// Delete record
export const deleteKhata = async (id) => {
  try {
    const response = await Api.delete(`/api/khata/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
