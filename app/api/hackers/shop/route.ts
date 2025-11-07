import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getUserTeam,
  getHardwareItems,
  getTeamBudget,
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

    // Check if user is in a team
    const teamMembership = await getUserTeam(user.id);
    if (!teamMembership) {
      return NextResponse.json(
        { error: "You must be in a team to access the shop" },
        { status: 400 }
      );
    }

    // Check if team is approved
    if (!teamMembership.approved) {
      return NextResponse.json(
        { error: "Your team is pending admin approval. Please check back later." },
        { status: 403 }
      );
    }

    const teamId = teamMembership.team_id;

    const items = await getHardwareItems();
    const budget = await getTeamBudget(teamId);

    return NextResponse.json({
      items,
      budget,
      team: teamMembership,
    });
  } catch (error) {
    console.error("Get shop error:", error);
    return NextResponse.json(
      { error: "Failed to load shop" },
      { status: 500 }
    );
  }
}