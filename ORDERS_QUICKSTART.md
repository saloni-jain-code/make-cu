# Hardware Orders Admin - Quick Start Guide

## 🚀 Setup (First Time Only)

### Step 1: Run Database Migration
You need to add two columns to your `team_purchases` table in Supabase.

**Method 1: Supabase Dashboard (Recommended)**
1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Copy and paste the SQL from `migrations/add_fulfilled_to_team_purchases.sql`
4. Click **Run**

**Method 2: Check Migration Status**
```bash
node scripts/migrate-orders.js
```
This will tell you if the columns exist or guide you through adding them.

### Step 2: Verify Admin Access
Make sure your email is in the `.env` file:
```env
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

## 📋 Using the Orders Page

### Access the Page
1. Log in as an admin
2. Navigate to `/hackers/admin`
3. Click **"Hardware Orders"** button or card

### Common Tasks

#### View All Orders
The main page shows all orders from all teams with:
- Order details (ID, team, item, quantity, cost)
- Purchase date/time
- Current status (Fulfilled/Pending)

#### Search for a Team's Orders
1. Type the team name in the search box
2. Results update automatically
3. Search is case-insensitive

#### Filter by Status
Use the dropdown to show:
- All orders
- Only unfulfilled orders (default workflow)
- Only fulfilled orders (for records)

#### Mark a Single Order as Fulfilled
1. Find the order in the table
2. Click **"Mark Fulfilled"** button in the Actions column
3. Status updates immediately

#### Bulk Fulfill Multiple Orders
1. Check the boxes next to orders to fulfill
2. Click **"Mark as Fulfilled"** at the top
3. All selected orders are marked as complete

#### Select All Visible Orders
- Click the checkbox in the table header
- Selects all orders currently visible (respects filters)

#### Mark Orders as Unfulfilled (Undo)
- For single: Click **"Mark Unfulfilled"** 
- For multiple: Select orders, click **"Mark as Unfulfilled"**

## 💡 Recommended Workflow

### Daily Order Fulfillment
1. Open the orders page
2. Filter by **"Unfulfilled Only"**
3. Review pending orders
4. Prepare/collect items
5. Select fulfilled orders
6. Click **"Mark as Fulfilled"**

### Team-Specific Lookup
1. Search for the team name
2. View all their orders (fulfilled and pending)
3. Useful for team check-ins

### End of Day Review
1. Check statistics at the top
2. Review unfulfilled count
3. Plan next day's fulfillment

## 📊 Understanding the Statistics

- **Total Orders**: All orders ever placed
- **Fulfilled**: Orders marked as complete
- **Unfulfilled**: Orders still pending
- **Total Value**: Sum of all order costs in dollars

## ❓ Troubleshooting

**Can't see the orders page?**
- Verify you're logged in
- Check your email is in ADMIN_EMAILS
- Restart the app if you just added yourself

**Orders not loading?**
- Check browser console for errors
- Verify database migration was run
- Ensure Supabase credentials are correct

**Changes not saving?**
- Check network tab for API errors
- Verify admin permissions
- Try refreshing the page

## 🔒 Security Notes

- Only users with emails in `ADMIN_EMAILS` can access this page
- All API endpoints verify admin status
- Regular users cannot see or modify orders

## 📝 Tips

1. **Use the search** to quickly find specific team orders
2. **Bulk operations** save time when fulfilling multiple orders
3. **Filter by status** to focus on pending work
4. **Check timestamps** to prioritize older orders
5. **Clear selection** before starting a new bulk operation

## Need Help?

See `ADMIN_ORDERS_README.md` for detailed documentation including:
- Complete feature list
- API endpoint documentation
- Database schema details
- Future enhancement ideas

