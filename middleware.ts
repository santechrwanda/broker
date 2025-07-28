import { NextRequest, NextResponse } from "next/server";
import {
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_CLIENT_REDIRECT,
    DEFAULT_MANAGER_REDIRECT,
    DEFAULT_TELLER_REDIRECT,
    DEFAULT_ACCOUNTANT_REDIRECT,
    apiPrefix,
    authRoutes,
    publicRoutes
} from "@/utility/middleware-routes";
import { jwtVerify } from 'jose';


const roleRedirects: Record<string, string> = {
    "admin": DEFAULT_LOGIN_REDIRECT,
    "client": DEFAULT_CLIENT_REDIRECT,
    "manager": DEFAULT_MANAGER_REDIRECT,
    "teller": DEFAULT_TELLER_REDIRECT,
    "accountant": DEFAULT_ACCOUNTANT_REDIRECT,
};

export async function middleware(req: NextRequest) {

    // --- Your custom middleware logic below ---
    const token = req.cookies.get("auth_token")?.value;
    console.log(token);
    const { nextUrl } = req;

    let role: string | undefined;
    let isLoggedIn = false;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            if(payload.exp && new Date(payload.exp * 1000) < new Date()) {
                throw new Error("Token expired");
            }
            role = payload.role as string;
            isLoggedIn = true;
        } catch {
            isLoggedIn = false;
        }
    }

    const isApiAuthRoutes = nextUrl.pathname.startsWith(apiPrefix);
    const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoutes = authRoutes.some(route => nextUrl.pathname.includes(route));

    // API ROUTES
    if (isApiAuthRoutes) {
        return NextResponse.next();
    }

    // AUTHENTICATION ROUTES
    if (isAuthRoutes) {
        if (isLoggedIn && role) {
            // Redirect to role-specific dashboard
            const redirectPath = roleRedirects[role] || DEFAULT_LOGIN_REDIRECT;
            return NextResponse.redirect(new URL(redirectPath, nextUrl));
        }
        return NextResponse.next();
    }

    // PUBLIC ROUTES
    if (!isLoggedIn && !isPublicRoutes) {
        return NextResponse.redirect(new URL(authRoutes[0] as string, nextUrl));
    }

    // Role-based route protection
    if (isLoggedIn && role) {
        // Map role to allowed route
        const allowedRoute = roleRedirects[role];
        // If user tries to access a dashboard not matching their role, redirect to /not-found
        const isTryingOtherDashboard =
            Object.values(roleRedirects).some(
                (route) =>
                    nextUrl.pathname.startsWith(route) &&
                    route !== allowedRoute
            );
        if (isTryingOtherDashboard) {
            return NextResponse.redirect(new URL("/not-found", nextUrl));
        }
    }

    // Otherwise allow all routes
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};