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

authRoutes.get("/auth/google/redirect", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      // You can customize this URL
      const redirectUrl = new URL(`${process.env.FRONTEND_REDIRECT}/sign-in`);
      redirectUrl.searchParams.set("error", err?.message || "Authentication failed");
      return res.redirect(redirectUrl.toString());
    }

    // Success — proceed
    req.user = user;
    return aunthenticationController.handleGoogleRedirects(req, res, next);
  })(req, res, next);
});

// HANDLE FORGOT PASSWORD
authRoutes.post("/forgot-password", aunthenticationController.forgotPassword);

// HANDLE RESET PASSWORD
authRoutes.post("/reset-password/:resetCode", aunthenticationController.resetPassword);

// LOGOUT USER AND CLEAR COOKIES
authRoutes.delete("/logout", aunthenticationController.userLogout);

// LOGOUT USER AND CLEAR COOKIES
authRoutes.get("/me", passport.authenticate("jwt", { session: false }), aunthenticationController.getLoggedUser);

export { authRoutes };
