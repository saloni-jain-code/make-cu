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

      totalCost += item.cost * quantity;
    }

    if (totalCost > budget.remaining) {
      return NextResponse.json(
        { error: "Insufficient budget" },
        { status: 400 }
      );
    }

    // Purchase all items
    for (const purchase of purchases) {
      await purchaseHardware(teamId, purchase.itemId, purchase.quantity);
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