# Team Approval System

## Overview

The team approval system requires admin approval before teams can access the hardware shop and make purchases. This gives administrators control over which teams can participate in the hardware ordering system.

## How It Works

### For Teams (Users)

1. **Create or Join a Team**: Users can create or join teams as before
2. **Pending Approval**: Newly created teams are automatically set to "Pending Approval" status
3. **Dashboard Notification**: Team members see a clear notification that their team is awaiting admin approval
4. **Shop Access Restricted**: The hardware shop button is disabled until the team is approved
5. **Approval Notification**: Once approved, team members can access the hardware shop immediately

### For Admins

1. **Team Management Page**: Accessible via `/hackers/admin/teams` or from the admin dashboard
2. **View All Teams**: See all teams with their status (Approved/Pending), member count, and creation date
3. **Filter Teams**: Filter by approval status to quickly find pending teams
4. **Approve/Revoke**: One-click approval or revocation of team access
5. **Stats Overview**: Dashboard shows total teams, approved count, and pending count

## Database Changes

### Migration Required

Run the SQL migration in your Supabase SQL Editor:

```bash
migrations/add_approved_to_teams.sql
```

This adds:
- `approved` column (boolean, defaults to `false`)
- Index on `approved` for better query performance
- Optional: Auto-approve existing teams (configurable in migration file)

## Features

### Admin Interface (`/hackers/admin/teams`)

- **Stats Cards**: Total teams, approved, and pending counts
- **Filter Options**: View all, approved only, or pending only
- **Team Table**: Shows:
  - Team ID
  - Team name
  - Member count
  - Creation date
  - Approval status badge
  - Action buttons (Approve/Revoke)

### User Dashboard Updates

- **Approval Status Badge**: Green "✓ Approved" or Yellow "⏳ Pending Approval"
- **Informational Alert**: Clear message explaining the approval process
- **Conditional Shop Access**: 
  - Approved: Full access to hardware shop
  - Pending: Disabled button with message

### API Protection

- **Shop Endpoint** (`/api/hackers/shop`): Returns 403 error if team not approved
- **Purchase Endpoint**: Inherits protection (can't access shop to make purchase)

## API Endpoints

### `GET /api/hackers/admin/teams`
Fetch all teams with approval status and member counts (admin only).

### `POST /api/hackers/admin/teams/approve`
Approve or revoke team approval (admin only).

**Request Body:**
```json
{
  "teamId": 123,
  "approved": true
}
```

## User Flow

```
1. User creates team → Team created with approved=false
2. User sees dashboard → "Pending Approval" message shown
3. Admin visits /hackers/admin/teams → Sees new team in "Pending" list
4. Admin clicks "Approve Team" → Team.approved set to true
5. User refreshes dashboard → "✓ Approved" badge shown
6. User clicks "Go to Hardware Shop" → Full access granted
```

## Configuration

### Auto-Approve Existing Teams

By default, the migration auto-approves existing teams. To change this behavior, comment out the last line in `migrations/add_approved_to_teams.sql`:

```sql
-- Comment this out if you want existing teams to require approval:
UPDATE teams SET approved = TRUE WHERE approved IS NULL OR approved = FALSE;
```

### Approval Requirement

To disable the approval requirement globally (not recommended), you would need to:
1. Remove the approval check in `/api/hackers/shop/route.ts`
2. Remove the conditional rendering in the dashboard
3. Set all teams to `approved=true`

## Testing

### Test the Approval Flow

1. Create a new team
2. Verify dashboard shows "Pending Approval"
3. Try accessing `/hackers/shop` - should see approval message
4. Login as admin
5. Navigate to `/hackers/admin/teams`
6. Approve the team
7. Return to user dashboard
8. Verify "✓ Approved" badge appears
9. Access hardware shop successfully

### Test Revocation

1. As admin, revoke an approved team
2. Team members should lose shop access
3. Dashboard should show "Pending Approval" again

## Security Notes

- ✅ Admin-only API endpoints protected by `requireAdmin()`
- ✅ Shop access checked at both frontend and backend
- ✅ Team approval status loaded fresh on each request (not cached)
- ✅ Cannot bypass approval by directly accessing shop URL

## Files Modified

### Backend
- `data-supabase.js`: Added `getAllTeams()`, `approveTeam()`, updated `getUserTeam()`
- `data-supabase.d.ts`: Added type definitions

### API Routes
- `app/api/hackers/admin/teams/route.ts`: Get all teams (new)
- `app/api/hackers/admin/teams/approve/route.ts`: Approve teams (new)
- `app/api/hackers/shop/route.ts`: Added approval check

### Frontend
- `app/hackers/admin/page.tsx`: Added Teams link
- `app/hackers/admin/teams/page.tsx`: Team management UI (new)
- `app/hackers/dashboard/page.tsx`: Added approval status display

### Database
- `migrations/add_approved_to_teams.sql`: Add approved column (new)

## Future Enhancements

Potential improvements:
- Email notifications when teams are approved
- Rejection reasons/notes
- Approval history/audit log
- Bulk approve/reject functionality
- Auto-approval based on criteria (e.g., all members verified)

