import User from "@/common/models/users";
import type { Request } from "express";
import type { PassportStatic } from "passport";
import { type StrategyOptions as GoogleOptions, Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, type StrategyOptions, type VerifyCallback } from "passport-jwt";
import logger from "@/common/config/logger";
import { env } from "@/common/config/envConfig";

const cookieExtractor = (req: Request) => {
    let token = null;
    console.log(req.cookies);
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
            const email = profile?.emails?.[0].value;
            const googleId = profile.id;

            if (!email) return cb(new Error("Email not found in Google profile"), false);

            let res = await User.findOne({ where: { email } });
            let userInstance = res ? res.dataValues : null;

            if (userInstance) {
                // User exists — check login method
                if (userInstance.password && !userInstance.googleId) {
                    // Registered with credentials, not Google — deny
                    return cb(new Error("This account was created using email & password. Use credentials login."), false);
                } else if (userInstance.googleId && userInstance.googleId !== googleId) {
                    // Already has a Google ID, update in case it's changed (optional)
                    await userInstance.update({ googleId });
                }
            } else {
                // New user signing up via Google — allow
                res = await User.create({
                    email,
                    name: Object.values(profile.name || {}).join(" "),
                    googleId,
                    role: "client",
                    password: "", // No password for Google users
                });
                userInstance = res.dataValues;
            }

            return cb(null, userInstance);
        } catch (error) {
            logger.error(error, `Google Strategy Error Occurred: ${(error as Error).message}`);
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
