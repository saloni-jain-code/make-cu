import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getUserTeam,
  getTeamByName,
  verifyTeamPassword,
  addTeamMember,
} from "@/data-supabase";

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

    const { name, password } = await req.json();

    // Validate input
    if (!name || !password) {
      return NextResponse.json(
        { error: "Team name and password are required" },
        { status: 400 }
      );
    }

    // Check if user is already in a team
    const existingTeam = await getUserTeam(user.id);
    if (existingTeam) {
      return NextResponse.json(
        { error: "You are already in a team. Leave your current team first." },
        { status: 400 }
      );
    }

    // Find the team
    const team = await getTeamByName(name);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Verify password
    const passwordMatch = await verifyTeamPassword(team.id, password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Add user to team
    await addTeamMember(team.id, user.id);

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Join team error:", error);
    return NextResponse.json(
      { error: "Failed to join team" },
      { status: 500 }
    );
  }
}