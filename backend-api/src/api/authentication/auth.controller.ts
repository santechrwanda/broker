import User from "@/common/models/users";
import { comparePassword, getHash } from "@/common/utils/bcrypt";
import { forgotPasswordEmailTemplate, sendEmail } from "@/common/utils/email";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { attachCookie, generateVerificationCode } from "@/common/utils/token";
import type { Request, RequestHandler, Response } from "express";
import type { NextFunction } from "express";
import { ErrorHandler, asyncCatch } from "@/common/middleware/errorHandler";
import { Op } from "sequelize";

class AuthenticationController {
  public registerUser: RequestHandler = asyncCatch(
    async (_req: Request, res: Response) => {
      const hashedPassword = await getHash(_req.body.password);
      const { name, email, address, phone_number } = _req.body;

      const { dataValues: user } = await User.create({
        name,
        email,
        address,
        phone_number,
        role: "client",
        password: hashedPassword,
      });

      attachCookie(user, res);
      return ServiceResponse.success(
        "User registered successfully!",
        user,
        res
      );
    }
  );

  public loginUser: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      const userInstance = await User.findOne({ where: { email } });
      if (!userInstance || !userInstance.dataValues.password)
        return next(ErrorHandler.BadRequest("Invalid email or Password!"));

      const user = userInstance.dataValues;
      const isMatch = await comparePassword(password, user.password);

      if (!isMatch)
        return next(ErrorHandler.BadRequest("Invalid email or Password!"));

      if(user?.status === "blocked")
        return next(ErrorHandler.Forbidden("Your account has been blocked. Please contact support for assistance."));

      attachCookie(user, res);

      const userData = { ...user, password: undefined };
      return ServiceResponse.success("User Log IN successful!", userData, res);
    }
  );

  public userLogout: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.cookie("auth_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return ServiceResponse.success("User Logout successful!", null, res);
  };

  public forgotPassword: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const userInstance = await User.findOne({ where: { email } });
      if (!userInstance) {
        return next(
          ErrorHandler.NotFound(
            "Provided User Email Doesn't match Any in Database"
          )
        );
      }

      const user = userInstance.dataValues;
      const resetCode = generateVerificationCode();

      await userInstance.update({
        resetPasswordCode: resetCode,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000,
      });

      const resetLink = `${process.env.FRONTED_REDIRECT}/reset-password/${resetCode}`;
      const emailMessage = forgotPasswordEmailTemplate(user.name, resetLink);

      try {
        await sendEmail(
          email,
          "Password Recovery from Broker Ltd",
          emailMessage
        );
        return ServiceResponse.success(
          `Email sent to: ${user.name}`,
          null,
          res
        );
      } catch (error) {
        await userInstance.update({
          resetPasswordCode: null,
          resetPasswordExpires: null,
        });
        return next(
          ErrorHandler.InternalServerError(
            (error as Error)?.message ||
              "Something went wrong while sending email!"
          )
        );
      }
    }
  );

  public resetPassword: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, confirmPassword } = req.body;
      const { resetCode } = req.params;

      const userInstance = await User.findOne({
        where: {
          resetPasswordCode: resetCode,
          resetPasswordExpires: { [Op.gt]: Date.now() },
        },
      });

      if (!userInstance) {
        return next(
          ErrorHandler.BadRequest(
            "Password reset code is invalid or has expired"
          )
        );
      }

      if (password !== confirmPassword) {
        return next(ErrorHandler.BadRequest("Password does not match!"));
      }

      const newPassword = await getHash(password);

      await userInstance.update({
        resetPasswordCode: null,
        resetPasswordExpires: null,
        password: newPassword,
      });

      return ServiceResponse.success(
        "Password Reset Successful you can login now",
        null,
        res
      );
    }
  );

  public getLoggedUser: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      if (!user) {
        return next(ErrorHandler.BadRequest("User not logged in"));
      }
      return ServiceResponse.success("User retrieved successfully", user, res);
    }
  );

  public handleGoogleRedirects: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_REDIRECT}/login?error=Invalid user data from Google`);
      }

      const user = req.user as any;
      attachCookie(user, res);

      // Role-based redirect
      let redirectPath = "/dashboard";
      switch (user.role) {
        case "client":
          redirectPath = "/client";
          break;
        case "manager":
          redirectPath = "/manager";
          break;
        case "teller":
          redirectPath = "/teller";
          break;
        case "accountant":
          redirectPath = "/accountant";
          break;
        case "admin":
          redirectPath = "/dashboard";
          break;
        default:
          redirectPath = "/";
      }

      return res.redirect(`${process.env.FRONTEND_REDIRECT}${redirectPath}`);
    }
  );

}

export const aunthenticationController = new AuthenticationController();
