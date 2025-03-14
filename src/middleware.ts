import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();
    const token = req.nextauth?.token;

    // Define protected routes for admins
    const adminRoutes = ["/manageuser", "/manageareas", "/managecomplainttype", "/complaintsaction"];

    // Check if the requested route starts with any of the protected routes
    if (adminRoutes.some(route => url.pathname.startsWith(route)) && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect non-admins to home
    }

    return NextResponse.next(); // Allow access if no restriction applies
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Allow only if token exists
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
