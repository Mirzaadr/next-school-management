/**
 * Define the number of items being fetched for each page
 * of the table.
 * @type {number}
 */
export const ITEM_PER_PAGE = 10

/**
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 * will redirect logged in users to signin
 */
export const publicRoutes: string[] = [
  // "/",
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

type RouteAccessMap = {
  [key: string]: string[];
};

/**
 * mapping the route to the role that can access it
 * @type {RouteAccessMap}
 */
export const routeAccessMap: RouteAccessMap = {
  "/admin{/*path}": ["admin"],
  "/student{/*path}": ["student"],
  "/teacher{/*path}": ["teacher"],
  "/parent{/*path}": ["parent"],
  "/list/teachers{/*path}": ["admin", "teacher"],
  "/list/students{/*path}": ["admin", "teacher"],
  "/list/parents{/*path}": ["admin", "teacher"],
  "/list/subjects{/*path}": ["admin"],
  "/list/classes{/*path}": ["admin", "teacher"],
  "/list/lessons{/*path}": ["admin", "teacher", "parent", "student"],
  "/list/exams{/*path}": ["admin", "teacher", "student", "parent"],
  "/list/assignments{/*path}": ["admin", "teacher", "student", "parent"],
  "/list/results{/*path}": ["admin", "teacher", "student", "parent"],
  "/list/attendance{/*path}": ["admin", "teacher", "student", "parent"],
  "/list/events{/*path}": ["admin", "teacher", "student", "parent"],
  "/list/announcements{/*path}": ["admin", "teacher", "student", "parent"],
  "/profile": ["admin", "teacher", "student", "parent"],
  "/settings": ["admin", "teacher", "student", "parent"],
};