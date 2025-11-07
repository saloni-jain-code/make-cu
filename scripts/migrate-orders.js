/**
 * Migration script to add fulfilled columns to team_purchases table
 * 
 * Run with: node scripts/migrate-orders.js
 * 
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('Starting migration...\n');

  try {
    // Check if columns already exist by trying to select them
    console.log('Checking if columns already exist...');
    const { error: checkError } = await supabase
      .from('team_purchases')
      .select('fulfilled, fulfilled_at')
      .limit(1);

    if (!checkError) {
      console.log('✓ Columns already exist! No migration needed.\n');
      return;
    }

    console.log('Columns do not exist. Please run the SQL migration manually.\n');
    console.log('Steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the SQL from migrations/add_fulfilled_to_team_purchases.sql\n');
    console.log('Or use Supabase CLI:');
    console.log('   supabase db push migrations/add_fulfilled_to_team_purchases.sql\n');
    
  } catch (error) {
    console.error('Migration check failed:', error);
    process.exit(1);
  }
}

runMigration();

