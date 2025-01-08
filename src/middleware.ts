import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes, routeAccessMap } from "@/lib/settings";
import { createRouteMatcher } from "@/lib/routeMatcher";

const { auth } = NextAuth(authConfig);

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
  if (isApiAuthRoute) {
    return;
  }
  
  if(isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin))
    }
    return;
  }
  
  if (isLoggedIn && !isPublicRoute) {
    const role = req.auth?.user.role.toLowerCase();
    const isAllowed = matchers.reduce((acc, {matcher, allowedRoles}) => {
      if (acc) return acc;
      return matcher(req) && allowedRoles.includes(role!);
    }, false);

    // console.log(`${nextUrl.pathname} : ${isAllowed ? "Allowed" : "Not Allowed"}`)

    if (!isAllowed) {
      return Response.redirect(new URL(`/${role}`, nextUrl));
    }
  }
  
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/signin?callbackUrl=${encodedCallbackUrl}`, 
      nextUrl
    ))
  }

  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search param
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    "/(api|trpc)(.*)",
  ]
}