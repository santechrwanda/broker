import express, { Router } from "express";
import { userController } from "@/api/user/user.controller";

const userRoutes: Router = express.Router();

userRoutes.get("/", userController.allUsers);
userRoutes.post("/", userController.createUser);
userRoutes.put("/:id", userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);
userRoutes.patch("/:id/status", userController.changeUserStatus);
userRoutes.post("/import", userController.importUsers);

export { userRoutes };