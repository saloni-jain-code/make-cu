# Admin Hardware Orders Management

This feature allows administrators to view, search, and manage all hardware orders from teams participating in the hackathon.

## Setup

### 1. Database Migration

Before using this feature, you need to add the `fulfilled` and `fulfilled_at` columns to your Supabase database.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL from `migrations/add_fulfilled_to_team_purchases.sql`

**Option B: Using Supabase CLI**
```bash
supabase db push migrations/add_fulfilled_to_team_purchases.sql
```

### 2. Admin Access

Make sure your email is listed in the `ADMIN_EMAILS` environment variable:
```env
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

## Features

### Access the Orders Page
Navigate to `/hackers/admin/orders` or click the "Hardware Orders" button on the admin dashboard at `/hackers/admin`.

### View All Orders
The orders page displays all hardware purchases with:
- Order ID
- Team name
- Item name and description
- Quantity
- Total cost
- Order date/time
- Fulfillment status (Fulfilled/Pending)

### Statistics Dashboard
At the top of the page, you'll see:
- **Total Orders**: Total number of orders placed
- **Fulfilled**: Number of completed orders
- **Unfulfilled**: Number of pending orders
- **Total Value**: Combined value of all orders

### Search by Team Name
Use the search box to filter orders by team name. The search is case-insensitive and matches partial names.

### Filter by Status
Use the dropdown to filter orders by:
- **All Orders**: Show everything
- **Unfulfilled Only**: Show only pending orders
- **Fulfilled Only**: Show only completed orders

### Mark Orders as Fulfilled

#### Individual Orders
Click the "Mark Fulfilled" or "Mark Unfulfilled" button next to any order to toggle its status.

#### Bulk Operations
1. Select multiple orders using the checkboxes
2. Use the bulk action buttons that appear:
   - **Mark as Fulfilled**: Mark all selected orders as complete
   - **Mark as Unfulfilled**: Mark all selected orders as pending
   - **Clear Selection**: Deselect all orders

#### Select All
Click the checkbox in the table header to select/deselect all visible orders (respects current filters).

## API Endpoints

### Get All Orders
```
GET /api/hackers/admin/orders
```
Returns all orders with team and item details. Requires admin authentication.

### Mark Orders as Fulfilled
```
POST /api/hackers/admin/orders/fulfill
Content-Type: application/json

{
  "purchaseId": 123,        // For single order
  "fulfilled": true         // true or false
}

// OR for multiple orders:

{
  "purchaseIds": [123, 456, 789],  // Array of order IDs
  "fulfilled": true                  // true or false
}
```

## Database Schema

The `team_purchases` table now includes:
- `fulfilled` (BOOLEAN, default: FALSE): Whether the order has been fulfilled
- `fulfilled_at` (TIMESTAMP): When the order was marked as fulfilled

## Usage Tips

1. **Daily Workflow**: Filter by "Unfulfilled Only" to see pending orders
2. **Team Lookup**: Search by team name to see all orders from a specific team
3. **Bulk Fulfillment**: After preparing a batch of items, select and mark them all as fulfilled at once
4. **Audit Trail**: The `fulfilled_at` timestamp helps track when orders were completed
5. **Order Priority**: Sort by order date to fulfill orders in chronological order

## Troubleshooting

### Orders Not Showing
- Verify you're logged in as an admin
- Check that `ADMIN_EMAILS` includes your email
- Ensure the database migration has been run

### Cannot Mark as Fulfilled
- Check browser console for errors
- Verify database columns were added correctly
- Ensure your admin session is valid

### Search Not Working
- The search is case-insensitive
- Try searching for partial team names
- Clear the search to see all orders

## Future Enhancements

Potential features to add:
- Export orders to CSV
- Email notifications to teams when orders are fulfilled
- Order notes/comments
- Filter by item type
- Filter by date range
- Print packing lists for fulfillment

