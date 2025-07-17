import User from "@/common/models/users";
import type { Request } from "express";
import type { PassportStatic } from "passport";
import { type StrategyOptions as GoogleOptions, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, type StrategyOptions, type VerifyCallback } from "passport-jwt";
import logger from "@/common/config/logger";
import { env } from "../config/envConfig";

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req?.cookies) {
        token = req.cookies.auth_token;
    }
    return token;
};

export const jwtAuthMiddleware = async (passport: PassportStatic) => {
    if (!env.JWT_SECRET) return new Error("Required environment JWT_SECRET is missing!");

    const options: StrategyOptions = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: env.JWT_SECRET,
    };

    const callback: VerifyCallback = async (payload, done) => {
        try {
            const userInstance = await User.findOne({ where: { id: payload.sub } });
            if (userInstance) return done(null, userInstance.dataValues);
            else return done(new Error("User Doesn't exists any more!"), false);
        } catch (error) {
            done(error, null);
        }
    };

    passport.use(new JwtStrategy(options, callback));
};

export const googleAuthStrategy = async (passport: PassportStatic) => {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
        return new Error("Required environment: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are missing!");
    
    const googleOptions: GoogleOptions = {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/redirect",
    };

    const strategy = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, cb) => {
        try {
            // Update or insert user by email
            let userInstance = await User.findOne({ where: { email: profile?.emails?.[0].value } });
            if (userInstance) {
                await userInstance.update({ googleId: profile.id });
            } else {
                userInstance = await User.create({
                    email: profile?.emails?.[0].value || "",
                    names: Object.values(profile.name || {}).join(" "),
                    googleId: profile.id,
                    role: "client",
                    password: "", // No password for Google users
                });
            }
            return cb(null, userInstance.dataValues);
        } catch (error) {
            logger.error(error, `Google Strategy Error Occured: ${(error as Error).message}`);
            return cb(error, false);
        }
    });

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const userInstance = await User.findOne({ where: { id } });
            done(null, userInstance ? userInstance.dataValues : null);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(strategy);
};
