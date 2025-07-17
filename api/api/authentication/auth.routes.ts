import express, { type Router } from "express";
import passport from "passport";
import { aunthenticationController } from "./auth.controller";

const authRoutes: Router = express.Router();

//REGISTRACTION
authRoutes.post("/register", aunthenticationController.registerUser);


//LOGIN WITH CREDENTIALS
authRoutes.post("/credentials-login", aunthenticationController.loginUser);

// LOGIN WITH GOOGLE
authRoutes.get( "/google-login",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    }),
);

authRoutes.get(
    "/auth/google/redirect",
    passport.authenticate("google", { 
        successRedirect: process.env.FRONTED_REDIRECT || "/docs",
        session: false 
    }),
    aunthenticationController.googleLogin,
);

// HANDLE FORGOT PASSWORD
authRoutes.post("/forgot-password", aunthenticationController.forgotPassword);

// HANDLE RESET PASSWORD
authRoutes.post("/reset-password/:resetCode", aunthenticationController.resetPassword);

// LOGOUT USER AND CLEAR COOKIES
authRoutes.delete("/logout", aunthenticationController.userLogout);

export { authRoutes };
