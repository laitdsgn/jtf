import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateSession } from "@/lib/middleware";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  if (pathName.startsWith("/admin")) {
    const secretKey = process.env.ADMIN_GATEWAY_PASSWORD;
    const cookieauth = request.cookies.get("admin_gate_token")?.value;
    if (!secretKey) {
      return new Response("Błąd konfiguracji serwera.", { status: 500 });
    }

    if (cookieauth) {
      const lastDot = cookieauth.lastIndexOf(".");
      if (lastDot === -1) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      const payload = cookieauth.slice(0, lastDot);
      const hash = crypto
        .createHmac("sha256", secretKey)
        .update(payload)
        .digest("hex");

      const cookieValue = `${payload}.${hash}`;

      if (cookieValue !== cookieauth) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      const expiresAt = parseInt(payload.split(":")[1], 10);
      if (!expiresAt || Date.now() > expiresAt) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url),
        );
        response.cookies.delete("admin_gate_token");
        return response;
      }
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
