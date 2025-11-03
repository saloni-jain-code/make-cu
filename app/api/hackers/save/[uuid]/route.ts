import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserByUuid, addSave } from "@/data-supabase";

export async function POST(
  req: NextRequest,
  { params }: { params: { uuid: string } }
) {
  try {
    // Check authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { uuid } = params;

    // Prevent saving own profile
    if (user.id === uuid || user.uuid === uuid) {
      return NextResponse.json(
        { error: "Cannot save your own profile" },
        { status: 400 }
      );
    }

    // Check if profile exists
    const profile = await getUserByUuid(uuid);
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Save the profile
    await addSave(user.id, profile.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save profile error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}