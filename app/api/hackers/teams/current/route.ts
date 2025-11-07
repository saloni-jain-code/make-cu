import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getUserTeam,
  getTeamMembers,
  getTeamBudget,
  getTeamPurchases,
} from "@/data-supabase";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const teamMembership = await getUserTeam(user.id);
    if (!teamMembership) {
      return NextResponse.json({ team: null });
    }

    const teamId = teamMembership.team_id;

    const members = await getTeamMembers(teamId);
    const budget = await getTeamBudget(teamId);
    const purchases = await getTeamPurchases(teamId);

    return NextResponse.json({
      team: teamMembership,
      members,
      budget,
      purchases,
    });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { error: "Failed to get team info" },
      { status: 500 }
    );
  }
}