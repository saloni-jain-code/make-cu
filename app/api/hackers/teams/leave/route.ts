import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserTeam, removeTeamMember } from "@/data-supabase";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is in a team
    const team = await getUserTeam(user.id);
    if (!team) {
      return NextResponse.json(
        { error: "You are not in a team" },
        { status: 400 }
      );
    }

    // Remove user from team
    await removeTeamMember(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave team error:", error);
    return NextResponse.json(
      { error: "Failed to leave team" },
      { status: 500 }
    );
  }
}