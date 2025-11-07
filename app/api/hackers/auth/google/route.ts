import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function GET() {
  const redirectUri = `${FRONTEND_URL}/api/hackers/auth/google/callback`;
  const scope = "openid email profile";
  
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", scope);
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(googleAuthUrl.toString());
}