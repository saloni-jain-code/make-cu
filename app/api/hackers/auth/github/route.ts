import { NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export async function GET() {
  const redirectUri = `${FRONTEND_URL}/api/hackers/auth/github/callback`;
  const scope = "user:email";
  
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", scope);
  githubAuthUrl.searchParams.set("allow_signup", "true");

  return NextResponse.redirect(githubAuthUrl.toString());
}