import express, { type Router } from "express"
import { userController } from "@/api/user/user.controller"
import { uploadProfileImage } from "@/common/middleware/multer"
import passport from "passport"

const userRoutes: Router = express.Router()

userRoutes.get("/", passport.authenticate("jwt", { session: false }),  userController.allUsers)
userRoutes.post("/", uploadProfileImage, userController.createUser)
userRoutes.put("/:id", uploadProfileImage, userController.updateUser)
userRoutes.delete("/:id", userController.deleteUser)
userRoutes.patch("/:id/status", userController.changeUserStatus)
userRoutes.post("/import", userController.importUsers)

export { userRoutes }
