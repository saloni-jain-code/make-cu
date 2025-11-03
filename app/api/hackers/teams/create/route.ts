import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getUserTeam,
  getTeamByName,
  createTeam,
  addTeamMember,
} from "@/data-supabase";
import bcrypt from "bcrypt";

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

    // Check if team name already exists
    const teamExists = await getTeamByName(name);
    if (teamExists) {
      return NextResponse.json(
        { error: "Team name already taken" },
        { status: 400 }
      );
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create team and add user as member
    const team = await createTeam({ name, password_hash });
    await addTeamMember(team.id, user.id);

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}