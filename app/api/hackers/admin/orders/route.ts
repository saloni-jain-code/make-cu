import { NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/data-supabase";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the logged-in user from cookies
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin
    if (!requireAdmin(user)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch all orders
    const orders = await getAllOrders();

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ 
      error: "Failed to load orders",
      details: error.message 
    }, { status: 500 });
  }
}

