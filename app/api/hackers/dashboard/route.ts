import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { getSavesForViewer } from "@/data-supabase";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const saves = await getSavesForViewer(user.id);
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
