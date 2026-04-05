import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJWT(token: string) {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const payload = decodeJWT(token);
        const path = request.nextUrl.pathname;

        const ROLE = {
            ESTUDIANTE: 1,
            PROFESOR: 2,
            ADMIN: 3,
        };

        if (path.startsWith("/admin")) {
            if (payload.role !== ROLE.ADMIN) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
        if (path.startsWith("/profesor")) {
            if (payload.role !== ROLE.PROFESOR) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
        }

        return NextResponse.next();

    } catch (error) {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/profesor/:path*"],
};