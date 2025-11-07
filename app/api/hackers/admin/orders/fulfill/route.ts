import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { markOrderFulfilled, markMultipleOrdersFulfilled } from "@/data-supabase";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { purchaseId, purchaseIds, fulfilled } = body;

    // Handle single or multiple purchases
    if (purchaseIds && Array.isArray(purchaseIds)) {
      // Mark multiple orders
      await markMultipleOrdersFulfilled(purchaseIds, fulfilled !== false);
    } else if (purchaseId) {
      // Mark single order
      await markOrderFulfilled(purchaseId, fulfilled !== false);
    } else {
      return NextResponse.json(
        { error: "purchaseId or purchaseIds required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Fulfill order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

