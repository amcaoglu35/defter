import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  getMasterPassword,
  isEmailAuthorized,
} from "@/lib/session";

/**
 * GET /api/auth/callback
 * Handles OAuth callback from Google / GitHub via Supabase Auth.
 * Enforces strict single-user email whitelisting.
 */
export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth_error=missing_code`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(`${origin}/?auth_error=supabase_not_configured`);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user?.email) {
      console.error("[OAuth Callback] Code exchange error:", error);
      return NextResponse.redirect(`${origin}/?auth_error=exchange_failed`);
    }

    const userEmail = data.user.email;

    // Strict Whitelist Check
    if (!isEmailAuthorized(userEmail)) {
      console.warn(`[OAuth Callback] Unauthorized email access attempt: ${userEmail}`);
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/?auth_error=unauthorized_email&email=${encodeURIComponent(userEmail)}`
      );
    }

    // Authorized user! Set our secure session cookie for 30 days
    const masterPassword = getMasterPassword();
    const sessionToken = await createSessionToken(masterPassword, userEmail);

    const response = NextResponse.redirect(`${origin}/`);
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err) {
    console.error("[OAuth Callback] Unexpected error:", err);
    return NextResponse.redirect(`${origin}/?auth_error=unexpected_error`);
  }
}
