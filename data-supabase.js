const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role for server access
);

// === USERS ===
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function getUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function getUserByUuid(uuid) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uuid', uuid)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function createUser({ email, name }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, name }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateUserProfile(userId, name, resume_path) {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (resume_path !== undefined) updates.resume_path = resume_path;

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

// === SAVES ===
async function addSave(viewer_user_id, viewed_user_id) {
  const { data: viewedUser, error: viewErr } = await supabase
    .from('users')
    .select('name, resume_path')
    .eq('id', viewed_user_id)
    .single();
  if (viewErr) throw viewErr;

  const { error } = await supabase.from('saves').insert([
    {
      viewer_user_id,
      viewed_user_id,
      saved_name: viewedUser.name,
      saved_resume_path: viewedUser.resume_path,
    },
  ]);
  if (error) throw error;
}

async function getSavesForViewer(viewer_user_id) {
  const { data, error } = await supabase
    .from('saves')
    .select('*, viewed_user_id(name, email, uuid, resume_path)')
    .eq('viewer_user_id', viewer_user_id)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data;
}

// === ADMIN ===
async function getAllUsers(limit = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function getAllSaves(limit = 10) {
  const { data, error } = await supabase
    .from('saves')
    .select('*')
    .order('saved_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function getUserStats() {
  const [{ count: userCount }, { count: saveCount }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('saves').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: userCount || 0,
    totalSaves: saveCount || 0,
  };
}

// === TEAMS ===
async function createTeam({ name, password_hash }) {
  // Expect password to already be hashed on server side
  const { data, error } = await supabase
    .from('teams')
    .insert([{ name, password_hash }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function getTeamByName(name) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('name', name)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function verifyTeamPassword(teamId, password) {
  const bcrypt = require('bcrypt');
  const { data: team, error } = await supabase
    .from('teams')
    .select('password_hash')
    .eq('id', teamId)
    .single();
  if (error) throw error;
  if (!team) return false;
  return await bcrypt.compare(password, team.password_hash);
}

async function addTeamMember(team_id, user_id) {
  const joined_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('team_members')
    .insert([{ team_id, user_id, joined_at }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function removeTeamMember(user_id) {
  const { data, error } = await supabase
    .from('team_members')
    .delete()
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
}

async function getUserTeam(user_id) {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id, teams(name, created_at), joined_at')
    .eq('user_id', user_id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;
  const { team_id, teams, joined_at } = data;
  return {
    team_id,
    name: teams.name,
    created_at: teams.created_at,
    joined_at,
  }
}


async function getTeamMembers(team_id) {
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      joined_at,
      users!inner (
        id,
        name,
        email,
        uuid
      )
    `)
    .eq('team_id', team_id)
    .order('joined_at', { ascending: true });
  
  if (error) throw error;
  
  // Flatten the structure to match SQLite output
  return (data || []).map(tm => ({
    id: tm.users.id,
    name: tm.users.name,
    email: tm.users.email,
    uuid: tm.users.uuid,
    joined_at: tm.joined_at
  }));
}


async function getTeamBudget(team_id) {
  // Max budget: $2000 * min(4, members)
  const { data: members, error: membersErr } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', team_id);
  if (membersErr) throw membersErr;

  const { data: purchases, error: purchasesErr } = await supabase
    .from('team_purchases')
    .select('total_cost')
    .eq('team_id', team_id);
  if (purchasesErr) throw purchasesErr;

  const memberCount = members.length;
  const totalSpent = purchases.reduce((sum, p) => sum + (p.total_cost || 0), 0);
  const maxBudget = 1000 * Math.min(memberCount, 4);
  const remaining = maxBudget - totalSpent;

  return { maxBudget, totalSpent, remaining, memberCount };
}

// === HARDWARE ===
async function getHardwareItems() {
  const { data, error } = await supabase
    .from('hardware_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function purchaseHardware(team_id, item_id, quantity) {
  const purchased_at = new Date().toISOString();

  // Get item info
  const { data: item, error: itemErr } = await supabase
    .from('hardware_items')
    .select('cost, stock')
    .eq('id', item_id)
    .single();
  if (itemErr) throw itemErr;
  if (!item) throw new Error('Item not found');
  if (item.stock < quantity) throw new Error('Insufficient stock');

  const total_cost = item.cost * quantity;

  // Insert purchase
  const { data, error: purchaseErr } = await supabase
    .from('team_purchases')
    .insert([{ team_id, item_id, quantity, total_cost, purchased_at }])
    .select()
    .single();
  if (purchaseErr) throw purchaseErr;

  // Update stock
  const { error: stockErr } = await supabase
    .from('hardware_items')
    .update({ stock: item.stock - quantity })
    .eq('id', item_id);
  if (stockErr) throw stockErr;

  return { ...data, total_cost };
}

async function getTeamPurchases(team_id) {
  const { data, error } = await supabase
    .from('team_purchases')
    .select(`
      *,
      hardware_items!inner(name)
    `)
    .eq('team_id', team_id)
    .order('purchased_at', { ascending: false });

  if (error) throw error;

  // Flatten hardware_items fields into the top-level object
  const formatted = data.map(row => ({
    ...row,
    name: row.hardware_items.name,
    hardware_items: undefined, // remove nested object if you want exact same structure
  }));

  return formatted || [];
}

module.exports = {
  getUserByEmail,
  getUserById,
  getUserByUuid,
  createUser,
  updateUserProfile,
  addSave,
  getSavesForViewer,
  getAllUsers,
  getAllSaves,
  getUserStats,
  createTeam,
  getTeamByName,
  verifyTeamPassword,
  addTeamMember,
  removeTeamMember,
  getUserTeam,
  getTeamMembers,
  getTeamBudget,
  getHardwareItems,
  purchaseHardware,
  getTeamPurchases,
};
