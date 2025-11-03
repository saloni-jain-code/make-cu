import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth"; // adjust path if needed

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Failed to verify authentication" }, { status: 500 });
  }
}
