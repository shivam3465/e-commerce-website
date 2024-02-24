import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller.js";

const UserRouter = Router();

UserRouter.post("/login", login);
UserRouter.post("/register", register);
UserRouter.get("/login", logout);

export { UserRouter };
