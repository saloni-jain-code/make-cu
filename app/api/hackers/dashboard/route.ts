import { NextResponse } from "next/server";
import QRCode from "qrcode";
import supabase, { getSessionUser, requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: saves } = await supabase
      .from("saves")
      .select("*")
      .eq("viewer_id", user.id);

    const profileUrl = `${process.env.FRONTEND_URL}/hackers/u/${user.uuid}`;
    const qrDataUrl = await QRCode.toDataURL(profileUrl);

    return NextResponse.json({
      user,
      saves,
      qrDataUrl,
      profileUrl,
      isAdmin: requireAdmin(user),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
