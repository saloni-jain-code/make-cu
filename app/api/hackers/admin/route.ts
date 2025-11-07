import { NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { getUserStats, getAllUsers, getAllSaves } from "../../../../data-supabase"; // adjust paths as needed

export async function GET() {
  try {
    // 🔐 Get the logged-in user from cookies
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧑‍💼 Check if the user is an admin
    if (!requireAdmin(user)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // 📊 Fetch data
    const stats = await getUserStats();
    const recentUsers = await getAllUsers(10);
    const recentSaves = await getAllSaves(10);

    return NextResponse.json({ stats, recentUsers, recentSaves });
  } catch (error) {
    console.error("Admin error:", error);
    return NextResponse.json({ error: "Failed to load admin data" }, { status: 500 });
  }
}
