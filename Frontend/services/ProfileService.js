import Api from "../Api/Api";

export const getUserProfile = async () => {
  try {
    const res = await Api.get("/api/profile/get-user-profile");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return { profile: null }; // safe fallback
  }
};
