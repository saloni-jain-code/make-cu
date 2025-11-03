import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/data-supabase";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/hackers/dashboard";

  if (!code) {
    return NextResponse.redirect(`${FRONTEND_URL}/hackers/login?error=missing_code`);
  }

  // 1️⃣ Exchange code for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${FRONTEND_URL}/api/hackers/auth/google/callback`,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${FRONTEND_URL}/hackers/login?error=token_failed`);
  }

  // 2️⃣ Fetch user info from Google
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  if (!user.email) {
    return NextResponse.redirect(`${FRONTEND_URL}/hackers/login?error=no_email`);
  }

  // 3️⃣ Upsert user in Supabase
  const existingUser = await getUserByEmail(user.email);

  let finalUser = existingUser;
  if (!existingUser) {
    try {
      finalUser = await createUser({
        email: user.email,
        name: user.name || user.email.split("@")[0],
      });
    } catch (error) {
      console.error("User insert error:", error);
    }
  }

  // 4️⃣ Set cookie session with user ID
  const res = NextResponse.redirect(`${FRONTEND_URL}${state}`);
  
  if (finalUser) {
    res.cookies.set("user_id", finalUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return res;
}