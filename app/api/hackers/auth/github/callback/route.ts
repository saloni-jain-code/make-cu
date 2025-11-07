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
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${FRONTEND_URL}/hackers/login?error=token_failed`);
  }

  // 2️⃣ Fetch user info from GitHub
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  // 3️⃣ Fetch email (may be private)
  const emailRes = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const emails = await emailRes.json();
  const primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email
    || `${user.id}+${user.login}@users.noreply.github.com`;

  // 4️⃣ Upsert user in Supabase
  const existingUser = await getUserByEmail(primaryEmail);

  let finalUser = existingUser;
  if (!existingUser) {
    try {
      finalUser = await createUser({
        email: primaryEmail,
        name: user.name || user.login,
      });
    } catch (error) {
      console.error("User insert error:", error);
    }
  }

  // 5️⃣ Set cookie session with user ID
  const res = NextResponse.redirect(`${FRONTEND_URL}${state}`);
  
  if (finalUser) {
    res.cookies.set("user_id", finalUser.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  }

  return res;
}