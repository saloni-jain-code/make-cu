import { NextRequest, NextResponse } from "next/server";
import { getUserByUuid } from "@/data-supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const profile = await getUserByUuid(uuid);
    if (!profile || !profile.resume_path) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Redirect to the public Supabase URL
    return NextResponse.redirect(profile.resume_path);
  } catch (error) {
    console.error("Resume serve error:", error);
    return NextResponse.json(
      { error: "Failed to serve resume" },
      { status: 500 }
    );
  }
}