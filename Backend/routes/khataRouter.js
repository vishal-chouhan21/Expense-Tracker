import express from "express";
import { userAuth } from "../middleware/userAuthMiddleware.js";
import { getKhata, addKhata, updateKhata, deleteKhata } from "../controllers/khataController.js";

const khataRouter = express.Router();

khataRouter.use(userAuth); // all routes protected

khataRouter.get("/get", getKhata);
khataRouter.post("/add", addKhata);
khataRouter.put("/update/:id", updateKhata);
khataRouter.delete("/delete/:id", deleteKhata);

export default khataRouter;