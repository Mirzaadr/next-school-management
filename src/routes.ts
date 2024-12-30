/**
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 * wil redirect logged in users to 
 */
export const publicRoutes = [
  "/",
  // "/auth/new-verification"
]

/**
 * An array of routes that are used for authentication
 * these routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/signin",
  // "/register",
  // "/error",
  // "/reset",
  // "/new-password",
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API auth purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default route after redirect
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/admin";