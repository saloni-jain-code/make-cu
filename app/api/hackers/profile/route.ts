import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/auth";
import { updateUserProfile } from "@/data-supabase";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("resume") as File | null;

    let resumeUrl: string | undefined;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.uuid}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      resumeUrl = data.publicUrl;
    }

    await updateUserProfile(user.id, name, resumeUrl);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
