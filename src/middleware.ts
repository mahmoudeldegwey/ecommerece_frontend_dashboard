import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { locales } from "./locales";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en", // Set your default locale
});

export default withAuth(
  function middleware(req) {

     // Run next-intl middleware first
    const localeResponse = intlMiddleware(req);
    if (localeResponse) return localeResponse;

    const locale = req.nextUrl.pathname.split("/")[1]; // Extract locale from URL

    if (locales.includes(locale)) {
      localeResponse.cookies.set("NEXT_LOCALE", locale);
    }

    const token = req.cookies.get("next-auth.session-token");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
 
    return NextResponse.next();

},
  {
    pages: {
      signIn: "/en/dashboard/login", // Redirect to login if not authenticated
    },
  }
);

export const config = {
  matcher: ["/(en|ar)?/dashboard/:path*"], // Protect these routes
  //["/dashboard/:path*", "/profile/:path*"]
};
