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
};
