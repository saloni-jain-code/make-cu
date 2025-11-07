import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { undoPurchase } from "@/data-supabase";

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
    const { purchaseId } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { error: "purchaseId is required" },
        { status: 400 }
      );
    }

    // Undo the purchase (restore stock, delete purchase record)
    const result = await undoPurchase(purchaseId);

    return NextResponse.json({ 
      success: true, 
      message: `Purchase undone. Restored ${result.restored_quantity} item(s) to stock.` 
    });
  } catch (error: any) {
    console.error("Undo purchase error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to undo purchase" },
      { status: 500 }
    );
  }
}

