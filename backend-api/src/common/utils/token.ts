import { User } from "@/api/user/user.schema";
import type { Response } from "express";
import jwt from "jsonwebtoken";

export const signToken = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set!");
  }

  const token = jwt.sign({ sub: user.id, role: user.role, iat: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const attachToken = (user: User) => {
  //create jwt token
  const token = signToken(user);

  return {
    token,
    ...user,
  };
};

export const attachCookie = (user: User, res: Response) => {
  //create jwt token
  const token = signToken(user);

    res.cookie("auth_token", token, {
        secure: true,
        sameSite:'none',
        domain: ".onrender.com",
        httpOnly:true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
};

export function generateVerificationCode() {
  // Generate a 6-digit random number
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  return verificationCode;
}
