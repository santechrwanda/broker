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
    public registerUser: RequestHandler = asyncCatch(async (_req: Request, res: Response) => {
        const hashedPassword = await getHash(_req.body.password);
        const { names, email, address, phone_number } = _req.body;

        const { dataValues: user } = await User.create({
            names,
            email,
            address,
            phone_number,
            role: "client",
            password: hashedPassword,
        });

        attachCookie(user.id, res);
        return ServiceResponse.success("User registered successfully!", user, res);
    });

    public loginUser: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const userInstance = await User.findOne({ where: { email } });
        if (!userInstance || !userInstance.dataValues.password) return next(ErrorHandler.BadRequest("Invalid email or Password!"));

        const user = userInstance.dataValues;
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) return next(ErrorHandler.BadRequest("Invalid email or Password!"));

        attachCookie(user.id, res);

        const userData = { ...user, password: undefined };
        return ServiceResponse.success("User Log IN successful!", userData, res);
    });

    public googleLogin: RequestHandler = asyncCatch(async (req: Request, res: Response) => {
        attachCookie((req?.user as any).id, res);
        return res.redirect(process.env.FRONTED_REDIRECT || "/");
    });

    public userLogout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.cookie("auth_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        return ServiceResponse.success("User Logout successful!", null, res);
    };

    public forgotPassword: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        const userInstance = await User.findOne({ where: { email } });
        if (!userInstance) {
            return next(ErrorHandler.NotFound("Provided User Email Doesn't match Any in Database"));
        }

        const user = userInstance.dataValues;
        const resetCode = generateVerificationCode();

        await userInstance.update({
            resetPasswordCode: resetCode,
            resetPasswordExpires: Date.now() + 15 * 60 * 1000,
        });

        const resetLink = `${process.env.FRONTED_REDIRECT}/reset-password/${resetCode}`;
        const emailMessage = forgotPasswordEmailTemplate(user.names, resetLink);

        try {
            await sendEmail(email, "Password Recovery from Broker Ltd", emailMessage);
            return ServiceResponse.success(`Email sent to: ${user.names}`, null, res);
        } catch (error) {
            await userInstance.update({
                resetPasswordCode: null,
                resetPasswordExpires: null,
            });
            return next(
                ErrorHandler.InternalServerError((error as Error)?.message || "Something went wrong while sending email!"),
            );
        }
    });

    public resetPassword: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
        const { password, confirmPassword } = req.body;
        const { resetCode } = req.params;

        const userInstance = await User.findOne({
            where: {
                resetPasswordCode: resetCode,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });

        if (!userInstance) {
            return next(ErrorHandler.BadRequest("Password reset code is invalid or has expired"));
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

        return ServiceResponse.success("Password Reset Successful you can login now", null, res);
    });
}

export const aunthenticationController = new AuthenticationController();
