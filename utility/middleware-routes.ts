/**
 * 
 * Array of routes that are accessible to the public
 * these routes do not require authentication
 * @type { string[] }
 */
export const publicRoutes = [
    "/en",
];

/**
 * 
 * Array of routes that are used for authentication
 * these routes will redirect logged user to /admin -> dashboard
 * @type { string[] }
 */
export const authRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
]

/**
 * 
 * The routes for APIs 
 * Routes that start with this prefix are used for api calls
 * @type { string }
 */
export const apiPrefix = "/api";


/**
 * 
 * Default redirect path after logging in.
 * @type { string }
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_CLIENT_REDIRECT = "/client";
export const DEFAULT_MANAGER_REDIRECT = "/manager";
export const DEFAULT_TELLER_REDIRECT = "/teller";
export const DEFAULT_ACCOUNTANT_REDIRECT = "/accountant";