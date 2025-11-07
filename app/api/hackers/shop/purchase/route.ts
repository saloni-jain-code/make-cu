import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getUserTeam,
  getTeamBudget,
  getHardwareItems,
  purchaseHardware,
} from "@/data-supabase";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { purchases } = await req.json();

    // Validate input
    if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
        return NextResponse.json(
          { error: "Invalid purchases data" },
          { status: 400 }
        );
    }

    // Check if user is in a team
    const teamMembership = await getUserTeam(user.id);
    if (!teamMembership) {
      return NextResponse.json(
        { error: "You must be in a team to purchase items" },
        { status: 400 }
      );
    }
    const teamId = teamMembership.team_id;
    // Check budget
    const budget = await getTeamBudget(teamId);
    const items = await getHardwareItems();

    // Calculate total cost and validate all items
    let totalCost = 0;
    const validatedPurchases = [];
    
    for (const purchase of purchases) {
      const { itemId, quantity } = purchase;
      
      if (!itemId || !quantity || quantity < 1) {
        return NextResponse.json(
          { error: `Invalid item or quantity for item ${itemId}` },
          { status: 400 }
        );
      }

      const item = items.find((i) => i.id === itemId);
      if (!item) {
        return NextResponse.json(
          { error: `Item ${itemId} not found` },
          { status: 404 }
        );
      }

      // Validate stock availability
      if (item.stock < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}. Only ${item.stock} available.` },
          { status: 400 }
        );
      }

      totalCost += item.cost * quantity;
      validatedPurchases.push({ itemId, quantity, itemName: item.name });
    }

    if (totalCost > budget.remaining) {
      return NextResponse.json(
        { error: "Insufficient budget" },
        { status: 400 }
      );
    }

    // Purchase all items - the purchaseHardware function uses atomic operations
    // to prevent race conditions
    const results = [];
    for (const purchase of validatedPurchases) {
      try {
        const result = await purchaseHardware(teamId, purchase.itemId, purchase.quantity);
        results.push(result);
      } catch (error: any) {
        // If any purchase fails (e.g., due to race condition), return error
        // Previous successful purchases remain (team can undo via admin panel if needed)
        return NextResponse.json(
          { error: error.message || `Failed to purchase ${purchase.itemName}` },
          { status: 400 }
        );
      }
    }


    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to purchase item" },
      { status: 500 }
    );
  }
}