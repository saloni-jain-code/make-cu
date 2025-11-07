import { NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/data-supabase";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the logged-in user from cookies
    const user = await getSessionUser();
    console.log("👤 User check:", user ? `User ID ${user.id}` : "No user");

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin
    const isAdmin = requireAdmin(user);
    console.log("🔐 Admin check:", isAdmin, "User:", user);

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch all orders
    console.log("📦 Fetching orders...");
    const orders = await getAllOrders();
    console.log("✅ Orders fetched successfully:", orders ? orders.length : 0, "orders");
    if (orders && orders.length > 0) {
      console.log("First order sample:", orders[0]);
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("❌ Admin orders error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json({ 
      error: "Failed to load orders",
      details: error.message 
    }, { status: 500 });
  }
}

