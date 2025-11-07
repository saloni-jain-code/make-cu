import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Delete the user_id cookie
  res.cookies.delete("user_id");
  
  return res;
}