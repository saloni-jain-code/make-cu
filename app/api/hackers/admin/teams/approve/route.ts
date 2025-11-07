import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { approveTeam } from "@/data-supabase";

export async function POST(req: NextRequest) {
  try {
    // Get the logged-in user from cookies
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin
    if (!requireAdmin(user)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { teamId, approved } = body;

    if (!teamId) {
      return NextResponse.json(
        { error: "teamId is required" },
        { status: 400 }
      );
    }

    // Approve or reject the team
    await approveTeam(teamId, approved !== false);

    return NextResponse.json({ 
      success: true,
      message: approved !== false ? 'Team approved successfully' : 'Team approval revoked'
    });
  } catch (error: any) {
    console.error("Approve team error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update team approval" },
      { status: 500 }
    );
  }
}

