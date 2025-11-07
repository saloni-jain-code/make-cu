import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) return null;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return user;
}

export function requireAdmin(user: any) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());
  return adminEmails.includes(user.email);
}

export default supabase;