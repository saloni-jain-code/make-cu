import { NextRequest, NextResponse } from "next/server";
import { getSavesForViewer, getUserByUuid } from "@/data-supabase";
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;
    
    const profile = await getUserByUuid(uuid);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const user = await getSessionUser(); 
    const saves = await getSavesForViewer(profile.id);
    const hasSaved = saves.some(
      (save: any) => save.viewed_user_id === profile.id
    );

    const canSave = user && user.uuid !== uuid && !hasSaved;

    return NextResponse.json({ profile, canSave, user });
  } catch (error) {
    console.error("Profile view error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}